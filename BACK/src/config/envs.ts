import dotenv from 'dotenv';

dotenv.config();

export const envs = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/agendlybd',
  JWT_SEED: process.env.JWT_SEED || 'default-seed-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '2h',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 5242880,
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:4200',
    'http://localhost:5173',
  ],
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
} as const;
