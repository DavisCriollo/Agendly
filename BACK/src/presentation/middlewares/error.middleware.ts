import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain/errors/custom.error';

interface StandardErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    status: number;
    timestamp: string;
    path: string;
  };
}

export const ErrorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const path = req.originalUrl || req.url;

  if (err instanceof CustomError) {
    const response: StandardErrorResponse = {
      success: false,
      error: {
        code: err.name.replace('Error', '').toUpperCase(),
        message: err.message,
        status: err.statusCode,
        timestamp,
        path,
      },
    };

    console.error(`[${timestamp}] ${err.statusCode} - ${err.name}: ${err.message} - ${path}`);

    return res.status(err.statusCode).json(response);
  }

  console.error(`[${timestamp}] 500 - Unhandled Error:`, err);

  const response: StandardErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error interno del servidor',
      status: 500,
      timestamp,
      path,
    },
  };

  return res.status(500).json(response);
};
