export interface ReviewEntity {
  id: string;
  businessId: string;
  appointmentId: string;
  staffId: string;
  clientId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
