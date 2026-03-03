import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
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

const ServiceSchema = new Schema<IService>(
  {
    businessId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    costOfService: { type: Number, required: true, default: 0 },
    category: { type: String, required: true, default: 'General' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.index({ businessId: 1, category: 1 });
ServiceSchema.index({ businessId: 1, isActive: 1 });

export const ServiceModel: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
