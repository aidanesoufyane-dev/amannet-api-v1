import { Router } from 'express';

import { trackEvent } from './analytics.controller';

export const analyticsRouter = Router();

analyticsRouter.post('/event', trackEvent);
