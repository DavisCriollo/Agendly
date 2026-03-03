import { useState, useEffect } from 'react';
import { marketingService, authService } from '../services/api';
import { QrCode, Download, Link2, Copy, CheckCircle, ExternalLink } from 'lucide-react';

const Marketing = () => {
  const [welcomeKit, setWelcomeKit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const user = authService.getCurrentUser();
  const businessId = user?.businessId;

  useEffect(() => {
    if (businessId) {
      loadWelcomeKit();
    }
  }, [businessId]);

  const loadWelcomeKit = async () => {
    try {
      setLoading(true);
      const response = await marketingService.getWelcomeKit(businessId);
      setWelcomeKit(response.data);
    } catch (error) {
      console.error('Error loading welcome kit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFlyer = async () => {
    try {
      const blob = await marketingService.downloadFlyer(businessId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agendly-flyer-${welcomeKit.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading flyer:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!welcomeKit) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudo cargar el kit de marketing</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
        <p className="text-gray-600 mt-1">Herramientas para promocionar tu negocio</p>
      </div>

      {/* QR Code Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <QrCode className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Código QR</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center mb-4">
            {welcomeKit.qrCodeUrl ? (
              <img
                src={welcomeKit.qrCodeUrl}
                alt="QR Code"
                className="w-64 h-64"
              />
            ) : (
              <div className="text-gray-500">QR no disponible</div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Imprime este código QR y colócalo en tu local para que los clientes puedan reservar
              fácilmente desde sus dispositivos móviles.
            </p>
            
            <button
              onClick={handleDownloadFlyer}
              className="w-full btn-primary flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Descargar Flyer PDF
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div className="space-y-6">
          {/* Booking Link */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Link2 className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Link de Reserva Rápida</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Link público para reservas:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={welcomeKit.bookingUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => handleCopyLink(welcomeKit.bookingUrl)}
                  className="btn-secondary flex items-center"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      <span className="text-green-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            <a
              href={welcomeKit.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Abrir en nueva pestaña
            </a>
          </div>

          {/* Deep Links */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deep Links</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">iOS (App Store):</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={welcomeKit.deepLinks.ios}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleCopyLink(welcomeKit.deepLinks.ios)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Android (Play Store):</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={welcomeKit.deepLinks.android}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleCopyLink(welcomeKit.deepLinks.android)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Los deep links detectan automáticamente el dispositivo del
                usuario y lo redirigen a la tienda de aplicaciones correspondiente con tu negocio
                pre-seleccionado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm font-medium text-gray-600">Slug del Negocio</h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">{welcomeKit.slug}</p>
          <p className="text-sm text-gray-500 mt-1">Identificador único</p>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-600">Estado del QR</h4>
          <p className="text-2xl font-bold text-green-600 mt-2">Activo</p>
          <p className="text-sm text-gray-500 mt-1">Listo para usar</p>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-600">Plataformas</h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">3</p>
          <p className="text-sm text-gray-500 mt-1">Web, iOS, Android</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cómo usar estas herramientas</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-gray-900">Descarga el Flyer PDF</h4>
              <p className="text-sm text-gray-600 mt-1">
                Imprime el flyer con el código QR y colócalo en tu recepción o entrada.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-gray-900">Comparte el Link de Reserva</h4>
              <p className="text-sm text-gray-600 mt-1">
                Envía el link por WhatsApp, email o redes sociales para que tus clientes reserven
                online.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-gray-900">Usa Deep Links en Publicidad</h4>
              <p className="text-sm text-gray-600 mt-1">
                Incluye los deep links en tus campañas de Facebook/Instagram Ads para llevar a los
                usuarios directamente a la app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
