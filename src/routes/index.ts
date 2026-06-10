import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.routes';
import { contentRouter } from '../modules/content/content.routes';
import { analyticsRouter } from '../modules/analytics/analytics.routes';
import { notificationsRouter } from '../modules/notifications/notifications.routes';
import { uploadsRouter } from '../modules/uploads/uploads.routes';
import { qrRouter } from '../modules/qr/qr.routes';
import { paymentsRouter } from '../modules/payments/payments.routes';
import { incidentsRouter } from '../modules/incidents/incidents.routes';
import { profileRouter } from '../modules/users/profile.routes';
import { chatRouter } from '../modules/chat/chat.routes';
import { dashboardRouter } from '../modules/dashboard/dashboard.routes';
import { residentsRouter } from '../modules/residents/residents.routes';
import { visitorsRouter } from '../modules/visitors/visitors.routes';
import { reportsRouter } from '../modules/reports/reports.routes';
import { announcementsRouter } from '../modules/announcements/announcements.routes';
import { documentsRouter } from '../modules/documents/documents.routes';
import { packagesRouter } from '../modules/packages/packages.routes';
import { contributionsRouter } from '../modules/contributions/contributions.routes';
import { securityRouter } from '../modules/security/security.routes';
import { buildingsRouter } from '../modules/buildings/buildings.routes';
import { healthRouter } from './health';

export const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/content', contentRouter);
router.use('/uploads', uploadsRouter);
router.use('/notifications', notificationsRouter);
router.use('/analytics', analyticsRouter);

// New Routes mappings matching Flutter expectations
router.use('/qr', qrRouter);
router.use('/payments', paymentsRouter);
router.use('/incidents', incidentsRouter);
router.use('/chat', chatRouter);
router.use('/', profileRouter);
router.use('/dashboard', dashboardRouter);
router.use('/residents', residentsRouter);
router.use('/visitors', visitorsRouter);
router.use('/reports', reportsRouter);
router.use('/announcements', announcementsRouter);
router.use('/documents', documentsRouter);
router.use('/packages', packagesRouter);
router.use('/contributions', contributionsRouter);
router.use('/security', securityRouter);
router.use('/buildings', buildingsRouter);
// router.use('/history', historyRouter);
