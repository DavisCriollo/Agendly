import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity>;
  findByEmail(email: string, businessId?: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  updateFcmToken(userId: string, fcmToken: string | null): Promise<void>;
}
