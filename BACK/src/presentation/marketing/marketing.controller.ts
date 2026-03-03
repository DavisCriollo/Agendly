import { Request, Response } from 'express';
import { MarketingService } from '../../infrastructure/services/marketing.service';
import { CustomError } from '../../domain/errors/custom.error';

export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  getWelcomeKit = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;

      const kit = await this.marketingService.getWelcomeKit(businessId);

      res.json({
        success: true,
        data: kit,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  createWelcomeKit = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;

      const kit = await this.marketingService.createWelcomeKit(businessId);

      res.json({
        success: true,
        data: kit,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  handleDeepLink = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const userAgent = req.headers['user-agent'] || '';

      const redirectUrl = this.marketingService.getDeepLinkRedirect(slug, userAgent);

      res.redirect(302, redirectUrl);
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error al procesar deep link' });
    }
  };

  generateFlyerPDF = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;

      const pdfBuffer = await this.marketingService.generateWelcomeFlyerPDF(businessId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=flyer-bienvenida-${businessId}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error al generar PDF' });
    }
  };
}
