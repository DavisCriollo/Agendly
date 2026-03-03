export type ClientSource = 'qr_door' | 'web_booking' | 'app' | 'manual' | 'unknown';

export interface ClientEntity {
  id: string;
  businessId: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  referredBy?: string;
  source: ClientSource;
  avatarUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
