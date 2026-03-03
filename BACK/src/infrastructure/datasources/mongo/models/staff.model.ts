import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkingHours {
  day: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface IStaff extends Document {
  businessId: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  services: string[];
  workingHours: IWorkingHours[];
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WorkingHoursSchema = new Schema<IWorkingHours>(
  {
    day: { type: Number, required: true, min: 1, max: 7 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const StaffSchema = new Schema<IStaff>(
  {
    businessId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    services: [{ type: String }],
    workingHours: [WorkingHoursSchema],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StaffSchema.index({ businessId: 1, userId: 1 });
StaffSchema.index({ businessId: 1, isActive: 1 });
StaffSchema.index({ businessId: 1, averageRating: -1 });

export const StaffModel: Model<IStaff> = mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);
