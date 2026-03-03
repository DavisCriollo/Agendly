import { BusinessModel } from '../datasources/mongo/models/business.model';
import { CustomError } from '../../domain/errors/custom.error';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import { envs } from '../../config/envs';

export interface WelcomeKit {
  qrCodeUrl: string;
  deepLink: string;
  slug: string;
}

export class MarketingService {
  private readonly baseUrl: string;
  private readonly appStoreUrl: string = 'https://apps.apple.com/app/agendly/id123456789';
  private readonly playStoreUrl: string = 'https://play.google.com/store/apps/details?id=com.agendly';

  constructor(baseUrl: string = envs.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  generateSlug(businessName: string): string {
    return businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (await BusinessModel.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async generateQRCode(businessId: string, slug: string): Promise<string> {
    try {
      const deepLink = `${this.baseUrl}/join/${slug}`;
      const qrCodeDataUrl = await QRCode.toDataURL(deepLink, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return qrCodeDataUrl;
    } catch (error) {
      throw CustomError.internalServer('Error al generar código QR');
    }
  }

  async getWelcomeKit(businessId: string): Promise<any> {
    try {
      const business = await BusinessModel.findById(businessId);
      if (!business) {
        throw CustomError.notFound('Negocio no encontrado');
      }

      if (!business.slug || !business.qrCodeUrl) {
        return await this.createWelcomeKit(businessId);
      }

      const bookingUrl = `${this.baseUrl}/booking/${business.slug}`;
      const deepLink = `${this.baseUrl}/join/${business.slug}`;

      return {
        qrCodeUrl: business.qrCodeUrl,
        bookingUrl,
        deepLinks: {
          ios: `${this.appStoreUrl}?businessSlug=${business.slug}`,
          android: `${this.playStoreUrl}&referrer=businessSlug%3D${business.slug}`,
        },
        slug: business.slug,
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Error al obtener kit de marketing');
    }
  }

  async createWelcomeKit(businessId: string): Promise<WelcomeKit> {
    try {
      const business = await BusinessModel.findById(businessId);
      if (!business) {
        throw CustomError.notFound('Negocio no encontrado');
      }

      if (!business.slug) {
        const baseSlug = this.generateSlug(business.name);
        business.slug = await this.ensureUniqueSlug(baseSlug);
      }

      const qrCodeUrl = await this.generateQRCode(businessId, business.slug);
      business.qrCodeUrl = qrCodeUrl;
      await business.save();

      const deepLink = `${this.baseUrl}/join/${business.slug}`;

      return {
        qrCodeUrl,
        deepLink,
        slug: business.slug,
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Error al crear kit de bienvenida');
    }
  }

  detectMobileOS(userAgent: string): 'ios' | 'android' | 'unknown' {
    const ua = userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(ua)) {
      return 'ios';
    } else if (/android/.test(ua)) {
      return 'android';
    }

    return 'unknown';
  }

  getDeepLinkRedirect(slug: string, userAgent: string): string {
    const os = this.detectMobileOS(userAgent);

    const deepLinkScheme = `agendly://join/${slug}`;

    switch (os) {
      case 'ios':
        return `${this.appStoreUrl}?businessSlug=${slug}`;
      case 'android':
        return `${this.playStoreUrl}&referrer=businessSlug%3D${slug}`;
      default:
        return `${this.baseUrl}/download?slug=${slug}`;
    }
  }

  async generateWelcomeFlyerPDF(businessId: string): Promise<Buffer> {
    try {
      const business = await BusinessModel.findById(businessId);
      if (!business) {
        throw CustomError.notFound('Negocio no encontrado');
      }

      if (!business.qrCodeUrl) {
        const kit = await this.createWelcomeKit(businessId);
        business.qrCodeUrl = kit.qrCodeUrl;
      }

      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc.fontSize(28).fillColor(business.primaryColor || '#4A90E2').text(business.name, {
          align: 'center',
        });

        doc.moveDown(1);

        doc
          .fontSize(16)
          .fillColor('#333333')
          .text('¡Agenda tu cita fácilmente!', { align: 'center' });

        doc.moveDown(1);

        doc
          .fontSize(12)
          .fillColor('#666666')
          .text('Escanea el código QR con tu celular para descargar nuestra app', {
            align: 'center',
          });

        doc.moveDown(2);

        if (business.qrCodeUrl) {
          const qrBase64 = business.qrCodeUrl.split(',')[1];
          const qrBuffer = Buffer.from(qrBase64, 'base64');

          const qrSize = 250;
          const pageWidth = doc.page.width;
          const qrX = (pageWidth - qrSize) / 2;

          doc.image(qrBuffer, qrX, doc.y, {
            width: qrSize,
            height: qrSize,
          });

          doc.moveDown(10);
        }

        doc
          .fontSize(14)
          .fillColor(business.primaryColor || '#4A90E2')
          .text(`${this.baseUrl}/join/${business.slug}`, { align: 'center' });

        doc.moveDown(2);

        doc
          .fontSize(10)
          .fillColor('#999999')
          .text('Powered by Agendly', { align: 'center' });

        doc.end();
      });
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Error al generar PDF de bienvenida');
    }
  }
}
