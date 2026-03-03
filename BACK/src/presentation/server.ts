import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { AppRoutes } from './routes';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { ClientSourceMiddleware } from './middlewares/client-source.middleware';
import { generalRateLimiter } from './middlewares/rate-limit.middleware';
import { MongoDatabase } from '../infrastructure/datasources/mongo/mongo-database';
import { SocketService } from '../infrastructure/services/socket.service';
import { envs } from '../config/envs';
import fs from 'fs';

const app = express();
const httpServer = createServer(app);

const uploadPath = path.resolve(envs.UPLOAD_PATH);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const allowedOrigins = [
  ...envs.CORS_ORIGINS,
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8100',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Source'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(ClientSourceMiddleware.detect);

app.use('/api/', generalRateLimiter);

app.use('/uploads', express.static(uploadPath));

app.use(AppRoutes.routes);

app.use(ErrorMiddleware);

SocketService.init(httpServer);

const startServer = async () => {
  try {
    await MongoDatabase.connect();
    const host = process.env.HOST || '0.0.0.0'; // 0.0.0.0 para cloud (Railway, Render, etc.)
    httpServer.listen(envs.PORT, host, () => {
      console.log(`🚀 Agendly API running on port ${envs.PORT}`);
      console.log(`📦 Environment: ${envs.NODE_ENV}`);
      console.log(`🌐 CORS enabled for: ${allowedOrigins.slice(0, 3).join(', ')}...`);
      console.log(`🔒 Rate limiting: Active`);
      console.log(`📱 Multi-platform support: Enabled`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
