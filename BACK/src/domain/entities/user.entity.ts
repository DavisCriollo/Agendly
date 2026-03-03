export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'USER';

export interface UserEntity {
  id: string;
  businessId?: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  fcmToken?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
