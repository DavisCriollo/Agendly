import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBusiness extends Document {
  name: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  slug: string;
  subscriptionPlan: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  storageUsed: number;
  qrCodeUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, default: null },
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subscriptionPlan: { type: String, enum: ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'], default: 'FREE' },
    subscriptionStartDate: { type: Date, default: null },
    subscriptionEndDate: { type: Date, default: null },
    storageUsed: { type: Number, default: 0 },
    qrCodeUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BusinessSchema.index({ slug: 1 }, { unique: true });
BusinessSchema.index({ subscriptionPlan: 1 });
BusinessSchema.index({ isActive: 1 });

export const BusinessModel: Model<IBusiness> = mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);
