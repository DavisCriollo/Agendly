import { UserEntity } from '../../domain/entities/user.entity';
import { IUser } from '../datasources/mongo/models/user.model';

export class UserMapper {
  static fromMongo(document: IUser): UserEntity {
    return {
      id: document._id.toString(),
      businessId: document.businessId,
      email: document.email,
      password: document.password,
      name: document.name,
      role: document.role as UserEntity['role'],
      fcmToken: document.fcmToken,
      avatarUrl: document.avatarUrl,
      isActive: document.isActive,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
