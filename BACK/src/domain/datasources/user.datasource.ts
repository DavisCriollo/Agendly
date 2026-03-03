import { UserEntity } from '../entities/user.entity';

export interface UserDatasource {
  create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<any>;
  findByEmail(email: string, businessId?: string): Promise<any | null>;
  findById(id: string): Promise<any | null>;
  updateFcmToken(userId: string, fcmToken: string | null): Promise<void>;
}
