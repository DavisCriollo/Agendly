import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';

let io: SocketServer | null = null;

interface SocketData {
  businessId?: string;
  userId?: string;
  role?: string;
  platform?: 'web' | 'mobile_ios' | 'mobile_android';
}

export class SocketService {
  static init(httpServer: HttpServer): SocketServer {
    io = new SocketServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    io.on('connection', (socket) => {
      console.log(`[Socket] Client connected: ${socket.id}`);

      socket.on('join:business', (data: { businessId: string; userId?: string; role?: string; platform?: string }) => {
        const { businessId, userId, role, platform } = data;
        
        socket.join(`business:${businessId}`);
        
        if (userId) {
          socket.join(`user:${userId}`);
        }
        
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
          socket.join(`admin:${businessId}`);
        }

        (socket.data as SocketData) = { businessId, userId, role, platform: platform as any };

        console.log(`[Socket] ${socket.id} joined business:${businessId} as ${role || 'guest'} from ${platform || 'unknown'}`);

        socket.emit('connection:success', {
          message: 'Conectado exitosamente',
          businessId,
          timestamp: new Date().toISOString(),
        });
      });

      socket.on('disconnect', () => {
        const data = socket.data as SocketData;
        console.log(`[Socket] Client disconnected: ${socket.id} (business: ${data.businessId || 'none'})`);
      });

      socket.on('error', (error) => {
        console.error(`[Socket] Error on ${socket.id}:`, error);
      });
    });

    return io;
  }

  static getIO(): SocketServer | null {
    return io;
  }

  static emitToBusiness(businessId: string, event: string, payload: any): void {
    if (io) {
      const timestamp = new Date().toISOString();
      io.to(`business:${businessId}`).emit(event, {
        ...payload,
        timestamp,
      });
      console.log(`[Socket] Emitted ${event} to business:${businessId}`);
    }
  }

  static emitToAdmins(businessId: string, event: string, payload: any): void {
    if (io) {
      const timestamp = new Date().toISOString();
      io.to(`admin:${businessId}`).emit(event, {
        ...payload,
        timestamp,
      });
      console.log(`[Socket] Emitted ${event} to admins of business:${businessId}`);
    }
  }

  static emitToUser(userId: string, event: string, payload: any): void {
    if (io) {
      const timestamp = new Date().toISOString();
      io.to(`user:${userId}`).emit(event, {
        ...payload,
        timestamp,
      });
      console.log(`[Socket] Emitted ${event} to user:${userId}`);
    }
  }

  static emitAppointmentCreated(businessId: string, appointment: any): void {
    this.emitToBusiness(businessId, 'appointment:created', {
      appointment,
      message: 'Nueva cita creada',
    });

    this.emitToAdmins(businessId, 'appointment:new', {
      appointment,
      message: 'Nueva reserva recibida',
      requiresAction: true,
    });
  }

  static emitAppointmentCancelled(businessId: string, appointment: any): void {
    this.emitToBusiness(businessId, 'appointment:cancelled', {
      appointment,
      message: 'Cita cancelada',
    });
  }

  static emitAppointmentUpdated(businessId: string, appointment: any): void {
    this.emitToBusiness(businessId, 'appointment:updated', {
      appointment,
      message: 'Cita actualizada',
    });
  }

  static emitLowRatingAlert(businessId: string, review: any): void {
    this.emitToAdmins(businessId, 'review:low-rating', {
      review,
      message: `⚠️ Nueva calificación baja (${review.rating} estrellas)`,
      priority: 'high',
      requiresAction: true,
    });
  }

  static emitNewReview(businessId: string, review: any): void {
    this.emitToBusiness(businessId, 'review:created', {
      review,
      message: 'Nueva reseña recibida',
    });
  }

  static getConnectedClients(businessId: string): number {
    if (!io) return 0;
    const room = io.sockets.adapter.rooms.get(`business:${businessId}`);
    return room ? room.size : 0;
  }

  static async broadcastSystemMessage(message: string): Promise<void> {
    if (io) {
      io.emit('system:message', {
        message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
