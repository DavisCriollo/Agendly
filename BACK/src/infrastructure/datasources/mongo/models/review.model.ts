import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  businessId: string;
  appointmentId: string;
  staffId: string;
  clientId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    businessId: { type: String, required: true, index: true },
    appointmentId: { type: String, required: true, unique: true },
    staffId: { type: String, required: true, index: true },
    clientId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: null },
  },
  { timestamps: true }
);

ReviewSchema.index({ businessId: 1, staffId: 1 });
ReviewSchema.index({ businessId: 1, rating: 1 });
ReviewSchema.index({ staffId: 1, rating: 1 });

export const ReviewModel: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
