import { AppointmentModel } from '../datasources/mongo/models/appointment.model';
import { ServiceModel } from '../datasources/mongo/models/service.model';
import { StaffModel } from '../datasources/mongo/models/staff.model';
import { ClientModel } from '../datasources/mongo/models/client.model';
import { CustomError } from '../../domain/errors/custom.error';

export interface ProfitabilityReport {
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  profitMargin: number;
  topServices: {
    serviceId: string;
    serviceName: string;
    category: string;
    totalBookings: number;
    revenue: number;
    cost: number;
    netProfit: number;
    profitMargin: number;
  }[];
}

export interface EfficiencyReport {
  staffPerformance: {
    staffId: string;
    staffName: string;
    totalAppointments: number;
    onTimeAppointments: number;
    lateAppointments: number;
    punctualityRate: number;
    averageDelayMinutes: number;
  }[];
  overallPunctuality: number;
}

export interface RetentionReport {
  totalClients: number;
  newClients: number;
  returningClients: number;
  retentionRate: number;
  noShowRate: number;
  noShowCount: number;
  lostRevenue: number;
  clientsBySource: {
    source: string;
    count: number;
    percentage: number;
  }[];
}

export interface HeatMapData {
  dayOfWeek: number;
  hour: number;
  appointmentCount: number;
  occupancyRate: number;
}

export interface HeatMapReport {
  heatMap: HeatMapData[];
  peakHours: {
    dayOfWeek: number;
    hour: number;
    count: number;
  }[];
  quietHours: {
    dayOfWeek: number;
    hour: number;
    count: number;
  }[];
}

export class AnalyticsService {
  async getProfitabilityReport(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ProfitabilityReport> {
    try {
      const profitByService = await AppointmentModel.aggregate([
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
            let: { serviceId: { $toObjectId: '$serviceId' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$serviceId'] } } },
            ],
            as: 'service',
          },
        },
        { $unwind: '$service' },
        {
          $group: {
            _id: '$serviceId',
            serviceName: { $first: '$service.name' },
            category: { $first: '$service.category' },
            totalBookings: { $sum: 1 },
            revenue: { $sum: '$service.price' },
            cost: { $sum: '$service.costOfService' },
          },
        },
        {
          $project: {
            serviceId: { $toString: '$_id' },
            serviceName: 1,
            category: 1,
            totalBookings: 1,
            revenue: 1,
            cost: 1,
            netProfit: { $subtract: ['$revenue', '$cost'] },
            profitMargin: {
              $cond: {
                if: { $eq: ['$revenue', 0] },
                then: 0,
                else: {
                  $multiply: [
                    { $divide: [{ $subtract: ['$revenue', '$cost'] }, '$revenue'] },
                    100,
                  ],
                },
              },
            },
          },
        },
        { $sort: { netProfit: -1 } },
      ]);

      const totalRevenue = profitByService.reduce((sum, s) => sum + s.revenue, 0);
      const totalCost = profitByService.reduce((sum, s) => sum + s.cost, 0);
      const netProfit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      return {
        totalRevenue,
        totalCost,
        netProfit,
        profitMargin: Math.round(profitMargin * 100) / 100,
        topServices: profitByService.map((s) => ({
          ...s,
          profitMargin: Math.round(s.profitMargin * 100) / 100,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer('Error al generar reporte de rentabilidad');
    }
  }

  async getEfficiencyReport(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<EfficiencyReport> {
    try {
      const staffPerformance = await AppointmentModel.aggregate([
        {
          $match: {
            businessId,
            status: { $in: ['COMPLETED', 'CONFIRMED'] },
            startTime: { $gte: startDate, $lte: endDate },
            checkInTime: { $exists: true, $ne: null },
          },
        },
        {
          $lookup: {
            from: 'staff',
            let: { staffId: { $toObjectId: '$staffId' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$staffId'] } } },
            ],
            as: 'staff',
          },
        },
        { $unwind: '$staff' },
        {
          $project: {
            staffId: '$staffId',
            staffName: '$staff.name',
            isOnTime: {
              $lte: ['$checkInTime', '$startTime'],
            },
            delayMinutes: {
              $cond: {
                if: { $gt: ['$checkInTime', '$startTime'] },
                then: {
                  $divide: [
                    { $subtract: ['$checkInTime', '$startTime'] },
                    60000,
                  ],
                },
                else: 0,
              },
            },
          },
        },
        {
          $group: {
            _id: '$staffId',
            staffName: { $first: '$staffName' },
            totalAppointments: { $sum: 1 },
            onTimeAppointments: {
              $sum: { $cond: ['$isOnTime', 1, 0] },
            },
            lateAppointments: {
              $sum: { $cond: ['$isOnTime', 0, 1] },
            },
            totalDelayMinutes: { $sum: '$delayMinutes' },
          },
        },
        {
          $project: {
            staffId: { $toString: '$_id' },
            staffName: 1,
            totalAppointments: 1,
            onTimeAppointments: 1,
            lateAppointments: 1,
            punctualityRate: {
              $multiply: [
                { $divide: ['$onTimeAppointments', '$totalAppointments'] },
                100,
              ],
            },
            averageDelayMinutes: {
              $cond: {
                if: { $eq: ['$lateAppointments', 0] },
                then: 0,
                else: { $divide: ['$totalDelayMinutes', '$lateAppointments'] },
              },
            },
          },
        },
        { $sort: { punctualityRate: -1 } },
      ]);

      const totalAppointments = staffPerformance.reduce(
        (sum, s) => sum + s.totalAppointments,
        0
      );
      const totalOnTime = staffPerformance.reduce(
        (sum, s) => sum + s.onTimeAppointments,
        0
      );
      const overallPunctuality =
        totalAppointments > 0 ? (totalOnTime / totalAppointments) * 100 : 0;

      return {
        staffPerformance: staffPerformance.map((s) => ({
          ...s,
          punctualityRate: Math.round(s.punctualityRate * 100) / 100,
          averageDelayMinutes: Math.round(s.averageDelayMinutes * 100) / 100,
        })),
        overallPunctuality: Math.round(overallPunctuality * 100) / 100,
      };
    } catch (error) {
      throw CustomError.internalServer('Error al generar reporte de eficiencia');
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
      const newClients = clientAppointments.filter((c) => c.appointmentCount === 1).length;
      const returningClients = clientAppointments.filter((c) => c.appointmentCount > 1).length;
      const retentionRate = totalClients > 0 ? (returningClients / totalClients) * 100 : 0;

      const noShowStats = await AppointmentModel.aggregate([
        { $match: { businessId, status: 'NO_SHOW' } },
        {
          $lookup: {
            from: 'services',
            let: { serviceId: { $toObjectId: '$serviceId' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$serviceId'] } } },
            ],
            as: 'service',
          },
        },
        { $unwind: '$service' },
        {
          $group: {
            _id: null,
            noShowCount: { $sum: 1 },
            lostRevenue: { $sum: '$service.price' },
          },
        },
      ]);

      const noShowData = noShowStats[0] || { noShowCount: 0, lostRevenue: 0 };
      const totalAppointments = await AppointmentModel.countDocuments({ businessId });
      const noShowRate = totalAppointments > 0 ? (noShowData.noShowCount / totalAppointments) * 100 : 0;

      const clientsBySource = await ClientModel.aggregate([
        { $match: { businessId, isActive: true } },
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            source: '$_id',
            count: 1,
            percentage: {
              $multiply: [{ $divide: ['$count', totalClients || 1] }, 100],
            },
          },
        },
        { $sort: { count: -1 } },
      ]);

      return {
        totalClients,
        newClients,
        returningClients,
        retentionRate: Math.round(retentionRate * 100) / 100,
        noShowRate: Math.round(noShowRate * 100) / 100,
        noShowCount: noShowData.noShowCount,
        lostRevenue: noShowData.lostRevenue,
        clientsBySource: clientsBySource.map((s) => ({
          source: s.source,
          count: s.count,
          percentage: Math.round(s.percentage * 100) / 100,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer('Error al generar reporte de retención');
    }
  }

  async getHeatMapReport(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<HeatMapReport> {
    try {
      const heatMapData = await AppointmentModel.aggregate([
        {
          $match: {
            businessId,
            status: { $in: ['COMPLETED', 'CONFIRMED'] },
            startTime: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $project: {
            dayOfWeek: { $dayOfWeek: '$startTime' },
            hour: { $hour: '$startTime' },
          },
        },
        {
          $group: {
            _id: {
              dayOfWeek: '$dayOfWeek',
              hour: '$hour',
            },
            appointmentCount: { $sum: 1 },
          },
        },
        {
          $project: {
            dayOfWeek: '$_id.dayOfWeek',
            hour: '$_id.hour',
            appointmentCount: 1,
          },
        },
        { $sort: { dayOfWeek: 1, hour: 1 } },
      ]);

      const maxAppointments = Math.max(...heatMapData.map((d) => d.appointmentCount), 1);

      const heatMap = heatMapData.map((d) => ({
        dayOfWeek: d.dayOfWeek,
        hour: d.hour,
        appointmentCount: d.appointmentCount,
        occupancyRate: Math.round((d.appointmentCount / maxAppointments) * 100),
      }));

      const sortedByCount = [...heatMapData].sort(
        (a, b) => b.appointmentCount - a.appointmentCount
      );

      const peakHours = sortedByCount.slice(0, 5).map((d) => ({
        dayOfWeek: d.dayOfWeek,
        hour: d.hour,
        count: d.appointmentCount,
      }));

      const quietHours = sortedByCount.slice(-5).reverse().map((d) => ({
        dayOfWeek: d.dayOfWeek,
        hour: d.hour,
        count: d.appointmentCount,
      }));

      return {
        heatMap,
        peakHours,
        quietHours,
      };
    } catch (error) {
      throw CustomError.internalServer('Error al generar mapa de calor');
    }
  }
}
