import { Router } from 'express';

import { authenticate } from '../../middlewares/auth';
import {
	createNotification,
	deleteNotification,
	listNotifications,
	markNotificationRead,
	sendTestNotification,
} from './notifications.controller';

export const notificationsRouter = Router();

notificationsRouter.use(authenticate);

notificationsRouter.get('/', listNotifications);
notificationsRouter.post('/', createNotification);
notificationsRouter.patch('/:id/read', markNotificationRead);
notificationsRouter.delete('/:id', deleteNotification);
notificationsRouter.post('/test', sendTestNotification);
