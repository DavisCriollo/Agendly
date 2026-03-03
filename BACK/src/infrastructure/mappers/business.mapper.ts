import { BusinessEntity } from '../../domain/entities/business.entity';
import { IBusiness } from '../datasources/mongo/models/business.model';

export class BusinessMapper {
  static fromMongo(document: IBusiness): BusinessEntity {
    return {
      id: document._id.toString(),
      name: document.name,
      logoUrl: document.logoUrl,
      primaryColor: document.primaryColor,
      secondaryColor: document.secondaryColor,
      slug: document.slug,
      subscriptionPlan: document.subscriptionPlan as any,
      subscriptionStartDate: document.subscriptionStartDate,
      subscriptionEndDate: document.subscriptionEndDate,
      storageUsed: document.storageUsed,
      qrCodeUrl: document.qrCodeUrl,
      isActive: document.isActive,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
