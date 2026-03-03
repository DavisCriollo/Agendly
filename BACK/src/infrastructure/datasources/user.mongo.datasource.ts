import { UserDatasource } from '../../domain/datasources/user.datasource';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserModel } from './mongo/models/user.model';
import { UserMapper } from '../mappers/user.mapper';

export class UserMongoDatasource implements UserDatasource {
  async create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    const doc = await UserModel.create(user);
    return doc;
  }

  async findByEmail(email: string, businessId?: string): Promise<any | null> {
    const query: any = { email: email.toLowerCase().trim() };
    if (businessId) query.businessId = businessId;

    const doc = await UserModel.findOne(query).exec();
    return doc;
  }

  async findById(id: string): Promise<any | null> {
    return UserModel.findById(id).exec();
  }

  async updateFcmToken(userId: string, fcmToken: string | null): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { fcmToken }).exec();
  }
}
