export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface BusinessEntity {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  slug: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  storageUsed: number;
  qrCodeUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

