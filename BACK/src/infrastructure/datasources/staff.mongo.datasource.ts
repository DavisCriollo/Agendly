import { StaffDatasource } from '../../domain/datasources/staff.datasource';
import { StaffEntity } from '../../domain/entities/staff.entity';
import { StaffModel } from './mongo/models/staff.model';

export class StaffMongoDatasource implements StaffDatasource {
  async create(staff: Omit<StaffEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    const doc = await StaffModel.create(staff);
    return doc;
  }

  async findByBusinessId(businessId: string): Promise<any[]> {
    return StaffModel.find({ businessId }).exec();
  }

  async findById(id: string, businessId: string): Promise<any | null> {
    return StaffModel.findOne({ _id: id, businessId }).exec();
  }

  async update(id: string, businessId: string, data: Partial<StaffEntity>): Promise<any> {
    const doc = await StaffModel.findOneAndUpdate(
      { _id: id, businessId },
      { $set: data },
      { new: true }
    ).exec();
    return doc;
  }
}
