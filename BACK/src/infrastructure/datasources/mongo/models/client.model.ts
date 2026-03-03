import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClient extends Document {
  businessId: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  referredBy?: string;
  source: string;
  avatarUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    businessId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    birthDate: { type: Date, default: null },
    referredBy: { type: String, default: null },
    source: { type: String, enum: ['qr_door', 'web_booking', 'app', 'manual', 'unknown'], default: 'unknown' },
    avatarUrl: { type: String, default: null },
    notes: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ClientSchema.index({ businessId: 1, email: 1 }, { unique: true });
ClientSchema.index({ businessId: 1, userId: 1 });
ClientSchema.index({ businessId: 1, source: 1 });
ClientSchema.index({ businessId: 1, createdAt: 1 });

export const ClientModel: Model<IClient> = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
