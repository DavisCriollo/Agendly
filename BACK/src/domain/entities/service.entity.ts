export interface ServiceEntity {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  costOfService: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
