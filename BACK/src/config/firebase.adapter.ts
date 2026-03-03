import admin from 'firebase-admin';
import { envs } from './envs';

let firebaseApp: admin.app.App | null = null;

export class FirebaseAdapter {
  static getApp(): admin.app.App | null {
    if (firebaseApp) return firebaseApp;

    if (!envs.FIREBASE_PROJECT_ID || !envs.FIREBASE_CLIENT_EMAIL || !envs.FIREBASE_PRIVATE_KEY) {
      console.warn('Firebase credentials not configured. Push notifications disabled.');
      return null;
    }

    try {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: envs.FIREBASE_PROJECT_ID,
          clientEmail: envs.FIREBASE_CLIENT_EMAIL,
          privateKey: envs.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      return firebaseApp;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return null;
    }
  }

  static async sendPushNotification(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<boolean> {
    const app = this.getApp();
    if (!app) return false;

    try {
      await admin.messaging().send({
        token: fcmToken,
        notification: { title, body },
        data: data || {},
      });
      return true;
    } catch (error) {
      console.error('FCM send error:', error);
      return false;
    }
  }

  static async sendMulticast(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<{ successCount: number; failureCount: number }> {
    const app = this.getApp();
    if (!app) return { successCount: 0, failureCount: tokens.length };

    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        data: data || {},
      });

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error('FCM multicast error:', error);
      return { successCount: 0, failureCount: tokens.length };
    }
  }

  static async sendAppointmentReminder(fcmToken: string, appointmentDetails: any): Promise<boolean> {
    return this.sendPushNotification(
      fcmToken,
      'Recordatorio de Cita',
      `Tu cita es mañana a las ${appointmentDetails.time}`,
      {
        type: 'appointment_reminder',
        appointmentId: appointmentDetails.id,
      }
    );
  }

  static async sendAppointmentConfirmation(fcmToken: string, appointmentDetails: any): Promise<boolean> {
    return this.sendPushNotification(
      fcmToken,
      'Cita Confirmada',
      `Tu cita ha sido confirmada para el ${appointmentDetails.date}`,
      {
        type: 'appointment_confirmed',
        appointmentId: appointmentDetails.id,
      }
    );
  }
}
