import { Router } from 'express';
import { AuthRoutes } from './auth/auth.routes';
import { BusinessRoutes } from './business/business.routes';
import { AppointmentsRoutes } from './appointments/appointments.routes';
import { ServicesRoutes } from './services/services.routes';
import { StaffRoutes } from './staff/staff.routes';
import { ClientRoutes } from './client/client.routes';
import { ReviewRoutes } from './review/review.routes';
import { ReportsRoutes } from './reports/reports.routes';
import { AvailabilityRoutes } from './availability/availability.routes';
import { MarketingRoutes } from './marketing/marketing.routes';
import { BookingRoutes } from './booking/booking.routes';
import { AnalyticsRoutes } from './analytics/analytics.routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/businesses', BusinessRoutes.routes);
    router.use('/api/appointments', AppointmentsRoutes.routes);
    router.use('/api/services', ServicesRoutes.routes);
    router.use('/api/staff', StaffRoutes.routes);
    router.use('/api/clients', ClientRoutes.routes);
    router.use('/api/reviews', ReviewRoutes.routes);
    router.use('/api/reports', ReportsRoutes.routes);
    router.use('/api/availability', AvailabilityRoutes.routes);
    router.use('/api/marketing', MarketingRoutes.routes);
    router.use('/api/analytics', AnalyticsRoutes.routes);
    router.use('/booking', BookingRoutes.routes);

    router.get('/api/health', (req, res) => {
      res.json({
        success: true,
        message: 'Agendly API is running',
        version: '2.0.0',
        features: ['multi-platform', 'business-intelligence', 'real-time'],
        timestamp: new Date().toISOString(),
      });
    });

    return router;
  }
}
