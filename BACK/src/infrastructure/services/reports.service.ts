import { AppointmentModel } from '../datasources/mongo/models/appointment.model';
import { ReviewModel } from '../datasources/mongo/models/review.model';
import { BusinessModel } from '../datasources/mongo/models/business.model';
import { StaffModel } from '../datasources/mongo/models/staff.model';
import { ServiceModel } from '../datasources/mongo/models/service.model';
import { CustomError } from '../../domain/errors/custom.error';

export interface RevenueReport {
  totalRevenue: number;
  period: string;
  breakdown: {
    date: string;
    revenue: number;
    appointmentsCount: number;
  }[];
}

export interface StaffRankingReport {
  staffId: string;
  staffName: string;
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  totalAppointments: number;
}

export interface TopServicesReport {
  serviceId: string;
  serviceName: string;
  totalBookings: number;
  totalRevenue: number;
}

export interface RetentionReport {
  totalClients: number;
  returningClients: number;
  retentionRate: number;
  newClients: number;
}

export interface SuperAdminMetrics {
  totalBusinesses: number;
  activeBusinesses: number;
  totalRevenue: number;
  subscriptionBreakdown: {
    plan: string;
    count: number;
    revenue: number;
  }[];
  storageUsage: {
    totalUsed: number;
    averagePerBusiness: number;
  };
  growthMetrics: {
    newBusinessesThisMonth: number;
    growthRate: number;
  };
}

export class ReportsService {
  async getRevenueReport(businessId: string, startDate: Date, endDate: Date): Promise<RevenueReport> {
    try {
      const appointments = await AppointmentModel.aggregate([
        {
          $match: {
            businessId,
            status: 'COMPLETED',
            startTime: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: 'services',
            localField: 'serviceId',
            foreignField: '_id',
            as: 'service',
          },
        },
        { $unwind: '$service' },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$startTime' },
            },
            revenue: { $sum: '$service.price' },
            appointmentsCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const totalRevenue = appointments.reduce((sum, item) => sum + item.revenue, 0);

      return {
        totalRevenue,
        period: `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`,
        breakdown: appointments.map((item) => ({
          date: item._id,
          revenue: item.revenue,
          appointmentsCount: item.appointmentsCount,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer('Error al generar reporte de ingresos');
    }
  }

  async getStaffRanking(businessId: string): Promise<StaffRankingReport[]> {
    try {
      const staffRanking = await StaffModel.aggregate([
        { $match: { businessId, isActive: true } },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'staffId',
            as: 'reviews',
          },
        },
        {
          $lookup: {
            from: 'appointments',
            let: { staffId: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$staffId', '$$staffId'] },
                      { $eq: ['$businessId', businessId] },
                      { $eq: ['$status', 'COMPLETED'] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: 'services',
                  localField: 'serviceId',
                  foreignField: '_id',
                  as: 'service',
                },
              },
              { $unwind: '$service' },
            ],
            as: 'appointments',
          },
        },
        {
          $project: {
            staffId: { $toString: '$_id' },
            staffName: '$name',
            averageRating: {
              $cond: {
                if: { $gt: [{ $size: '$reviews' }, 0] },
                then: { $avg: '$reviews.rating' },
                else: 0,
              },
            },
            totalReviews: { $size: '$reviews' },
            totalSales: { $sum: '$appointments.service.price' },
            totalAppointments: { $size: '$appointments' },
          },
        },
        { $sort: { averageRating: -1, totalSales: -1 } },
      ]);

      return staffRanking;
    } catch (error) {
      throw CustomError.internalServer('Error al generar ranking de staff');
    }
  }

  async getTopServices(businessId: string, limit: number = 10): Promise<TopServicesReport[]> {
    try {
      const topServices = await AppointmentModel.aggregate([
        {
          $match: {
            businessId,
            status: { $in: ['COMPLETED', 'CONFIRMED'] },
          },
        },
        {
          $group: {
            _id: '$serviceId',
            totalBookings: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'services',
            localField: '_id',
            foreignField: '_id',
            as: 'service',
          },
        },
        { $unwind: '$service' },
        {
          $project: {
            serviceId: { $toString: '$_id' },
            serviceName: '$service.name',
            totalBookings: 1,
            totalRevenue: { $multiply: ['$totalBookings', '$service.price'] },
          },
        },
        { $sort: { totalBookings: -1 } },
        { $limit: limit },
      ]);

      return topServices;
    } catch (error) {
      throw CustomError.internalServer('Error al obtener servicios más vendidos');
    }
  }

  async getRetentionReport(businessId: string): Promise<RetentionReport> {
    try {
      const clientAppointments = await AppointmentModel.aggregate([
        { $match: { businessId, status: 'COMPLETED' } },
        {
          $group: {
            _id: '$customerId',
            appointmentCount: { $sum: 1 },
            firstAppointment: { $min: '$startTime' },
          },
        },
      ]);

      const totalClients = clientAppointments.length;
      const returningClients = clientAppointments.filter((c) => c.appointmentCount > 1).length;
      const retentionRate = totalClients > 0 ? (returningClients / totalClients) * 100 : 0;
      const newClients = clientAppointments.filter((c) => c.appointmentCount === 1).length;

      return {
        totalClients,
        returningClients,
        retentionRate: Math.round(retentionRate * 100) / 100,
        newClients,
      };
    } catch (error) {
      throw CustomError.internalServer('Error al calcular tasa de retención');
    }
  }

  async getSuperAdminMetrics(): Promise<SuperAdminMetrics> {
    try {
      const totalBusinesses = await BusinessModel.countDocuments();
      const activeBusinesses = await BusinessModel.countDocuments({ isActive: true });

      const subscriptionBreakdown = await BusinessModel.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$subscriptionPlan',
            count: { $sum: 1 },
          },
        },
      ]);

      const planPrices: { [key: string]: number } = {
        FREE: 0,
        BASIC: 29,
        PRO: 79,
        ENTERPRISE: 199,
      };

      const subscriptionData = subscriptionBreakdown.map((item) => ({
        plan: item._id,
        count: item.count,
        revenue: item.count * (planPrices[item._id] || 0),
      }));

      const totalRevenue = subscriptionData.reduce((sum, item) => sum + item.revenue, 0);

      const storageStats = await BusinessModel.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalUsed: { $sum: '$storageUsed' },
            averagePerBusiness: { $avg: '$storageUsed' },
          },
        },
      ]);

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const newBusinessesThisMonth = await BusinessModel.countDocuments({
        createdAt: { $gte: startOfMonth },
      });

      const businessesLastMonth = await BusinessModel.countDocuments({
        createdAt: { $lt: startOfMonth, $gte: startOfLastMonth },
      });

      const growthRate =
        businessesLastMonth > 0
          ? ((newBusinessesThisMonth - businessesLastMonth) / businessesLastMonth) * 100
          : 0;

      return {
        totalBusinesses,
        activeBusinesses,
        totalRevenue,
        subscriptionBreakdown: subscriptionData,
        storageUsage: {
          totalUsed: storageStats[0]?.totalUsed || 0,
          averagePerBusiness: Math.round(storageStats[0]?.averagePerBusiness || 0),
        },
        growthMetrics: {
          newBusinessesThisMonth,
          growthRate: Math.round(growthRate * 100) / 100,
        },
      };
    } catch (error) {
      throw CustomError.internalServer('Error al obtener métricas de super admin');
    }
  }
}
