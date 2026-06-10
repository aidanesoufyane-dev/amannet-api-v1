import { Router } from 'express';

import { authenticate } from '../../middlewares/auth';
import { createReport, listReports } from './reports.controller';

export const reportsRouter = Router();

reportsRouter.use(authenticate);

reportsRouter.get('/', listReports);
reportsRouter.post('/', createReport);
