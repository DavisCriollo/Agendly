import { Request, Response } from 'express';
import { ReportsService } from '../../infrastructure/services/reports.service';
import { CustomError } from '../../domain/errors/custom.error';

export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  getRevenueReport = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ success: false, error: 'startDate y endDate son requeridos' });
      }

      const report = await this.reportsService.getRevenueReport(
        businessId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({ success: true, data: report });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  getStaffRanking = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const ranking = await this.reportsService.getStaffRanking(businessId);

      res.json({ success: true, data: ranking });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  getTopServices = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const { limit } = req.query;

      const topServices = await this.reportsService.getTopServices(
        businessId,
        limit ? parseInt(limit as string) : 10
      );

      res.json({ success: true, data: topServices });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  getRetentionReport = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const report = await this.reportsService.getRetentionReport(businessId);

      res.json({ success: true, data: report });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  getSuperAdminMetrics = async (req: Request, res: Response) => {
    try {
      const metrics = await this.reportsService.getSuperAdminMetrics();

      res.json({ success: true, data: metrics });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };
}
