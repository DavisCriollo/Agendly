export interface WorkingHours {
  day: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface StaffEntity {
  id: string;
  businessId: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  services: string[];
  workingHours: WorkingHours[];
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
