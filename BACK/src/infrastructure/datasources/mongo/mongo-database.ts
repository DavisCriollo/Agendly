import mongoose from 'mongoose';
import { envs } from '../../../config/envs';

export class MongoDatabase {
  static async connect(): Promise<void> {
    try {
      await mongoose.connect(envs.MONGODB_URI);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}
