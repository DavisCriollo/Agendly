import { Request, Response } from 'express';
import { AnalyticsService } from '../../infrastructure/services/analytics.service';
import { CustomError } from '../../domain/errors/custom.error';

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  getProfitability = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        throw CustomError.badRequest('startDate y endDate son requeridos');
      }

      const report = await this.analyticsService.getProfitabilityReport(
        businessId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data: report,
        message: 'Reporte de rentabilidad generado exitosamente',
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.name,
            message: error.message,
            status: error.statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
          },
        });
      }
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error interno del servidor',
          status: 500,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }
  };

  getEfficiency = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        throw CustomError.badRequest('startDate y endDate son requeridos');
      }

      const report = await this.analyticsService.getEfficiencyReport(
        businessId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data: report,
        message: 'Reporte de eficiencia generado exitosamente',
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.name,
            message: error.message,
            status: error.statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
          },
        });
      }
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error interno del servidor',
          status: 500,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }
  };

  getRetention = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;

      const report = await this.analyticsService.getRetentionReport(businessId);

      res.json({
        success: true,
        data: report,
        message: 'Reporte de retención generado exitosamente',
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.name,
            message: error.message,
            status: error.statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
          },
        });
      }
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error interno del servidor',
          status: 500,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }
  };

  getHeatMap = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        throw CustomError.badRequest('startDate y endDate son requeridos');
      }

      const report = await this.analyticsService.getHeatMapReport(
        businessId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data: report,
        message: 'Mapa de calor generado exitosamente',
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.name,
            message: error.message,
            status: error.statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
          },
        });
      }
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error interno del servidor',
          status: 500,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }
  };

  getDashboard = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        throw CustomError.badRequest('startDate y endDate son requeridos');
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      const [profitability, efficiency, retention, heatMap] = await Promise.all([
        this.analyticsService.getProfitabilityReport(businessId, start, end),
        this.analyticsService.getEfficiencyReport(businessId, start, end),
        this.analyticsService.getRetentionReport(businessId),
        this.analyticsService.getHeatMapReport(businessId, start, end),
      ]);

      res.json({
        success: true,
        data: {
          profitability,
          efficiency,
          retention,
          heatMap,
        },
        message: 'Dashboard completo generado exitosamente',
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.name,
            message: error.message,
            status: error.statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
          },
        });
      }
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error interno del servidor',
          status: 500,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }
  };
}
