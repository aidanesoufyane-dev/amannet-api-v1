import { Router } from 'express';

import { authenticate } from '../../middlewares/auth';
import {
  listAccessControls,
  listAccessLogs,
  listGuards,
  updateAccessControl,
} from './security.controller';

export const securityRouter = Router();

securityRouter.use(authenticate);

securityRouter.get('/guards', listGuards);
securityRouter.get('/access-controls', listAccessControls);
securityRouter.patch('/access-controls/:id', updateAccessControl);
securityRouter.get('/access-logs', listAccessLogs);
