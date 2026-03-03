import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDatasource } from '../../domain/datasources/user.datasource';
import { UserMapper } from '../mappers/user.mapper';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly datasource: UserDatasource) {}

  async create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
    const doc = await this.datasource.create(user);
    return UserMapper.fromMongo(doc);
  }

  async findByEmail(email: string, businessId?: string): Promise<UserEntity | null> {
    const doc = await this.datasource.findByEmail(email, businessId);
    return doc ? UserMapper.fromMongo(doc) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await this.datasource.findById(id);
    return doc ? UserMapper.fromMongo(doc) : null;
  }

  async updateFcmToken(userId: string, fcmToken: string | null): Promise<void> {
    await this.datasource.updateFcmToken(userId, fcmToken);
  }
}
