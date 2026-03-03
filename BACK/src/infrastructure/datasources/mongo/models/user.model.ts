import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  businessId?: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: string;
  fcmToken?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    businessId: { type: String, default: null, index: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, default: null },
    role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'USER'], default: 'USER' },
    fcmToken: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ businessId: 1, role: 1 });

export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
