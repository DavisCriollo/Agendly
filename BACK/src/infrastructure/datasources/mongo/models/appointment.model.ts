import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment extends Document {
  businessId: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  isFirstTime: boolean;
  cancellationReason?: string;
  clientDevice: string;
  notes?: string;
  medicalRecordUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    businessId: { type: String, required: true, index: true },
    customerId: { type: String, required: true },
    staffId: { type: String, required: true, index: true },
    serviceId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'], default: 'PENDING' },
    checkInTime: { type: Date, default: null },
    checkOutTime: { type: Date, default: null },
    isFirstTime: { type: Boolean, default: false },
    cancellationReason: { type: String, default: null },
    clientDevice: { type: String, enum: ['web', 'ios', 'android', 'unknown'], default: 'unknown' },
    notes: { type: String, default: null },
    medicalRecordUrl: { type: String, default: null },
  },
  { timestamps: true }
);

AppointmentSchema.index({ businessId: 1, staffId: 1 });
AppointmentSchema.index({ businessId: 1, startTime: 1 });
AppointmentSchema.index({ businessId: 1, status: 1 });
AppointmentSchema.index({ staffId: 1, startTime: 1, endTime: 1 });
AppointmentSchema.index({ businessId: 1, customerId: 1 });
AppointmentSchema.index({ businessId: 1, isFirstTime: 1 });
AppointmentSchema.index({ businessId: 1, clientDevice: 1 });

export const AppointmentModel: Model<IAppointment> = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
