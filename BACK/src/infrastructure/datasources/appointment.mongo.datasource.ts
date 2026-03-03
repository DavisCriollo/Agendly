import { AppointmentDatasource } from '../../domain/datasources/appointment.datasource';
import { AppointmentEntity } from '../../domain/entities/appointment.entity';
import { AppointmentModel } from './mongo/models/appointment.model';

export class AppointmentMongoDatasource implements AppointmentDatasource {
  async create(appointment: Omit<AppointmentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    const doc = await AppointmentModel.create(appointment);
    return doc;
  }

  async findById(id: string, businessId: string): Promise<any | null> {
    return AppointmentModel.findOne({ _id: id, businessId }).exec();
  }

  async findByBusinessId(businessId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    const query: any = { businessId };
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = startDate;
      if (endDate) query.startTime.$lte = endDate;
    }
    return AppointmentModel.find(query).sort({ startTime: 1 }).exec();
  }

  async findByStaffAndDateRange(staffId: string, businessId: string, startDate: Date, endDate: Date): Promise<any[]> {
    return AppointmentModel.find({
      staffId,
      businessId,
      startTime: { $gte: startDate, $lte: endDate },
    }).sort({ startTime: 1 }).exec();
  }

  async update(id: string, businessId: string, data: Partial<AppointmentEntity>): Promise<any> {
    const doc = await AppointmentModel.findOneAndUpdate(
      { _id: id, businessId },
      { $set: data },
      { new: true }
    ).exec();
    return doc;
  }
}
