import { StaffEntity } from '../../domain/entities/staff.entity';
import { IStaff } from '../datasources/mongo/models/staff.model';

export class StaffMapper {
  static fromMongo(document: IStaff): StaffEntity {
    return {
      id: document._id.toString(),
      businessId: document.businessId,
      userId: document.userId,
      name: document.name,
      avatarUrl: document.avatarUrl,
      services: document.services,
      workingHours: document.workingHours || [],
      averageRating: document.averageRating || 0,
      totalReviews: document.totalReviews || 0,
      isActive: document.isActive,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
