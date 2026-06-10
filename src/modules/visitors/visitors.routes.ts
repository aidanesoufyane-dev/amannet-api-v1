import { Router } from 'express';

import { authenticate } from '../../middlewares/auth';
import { createVisitor, deleteVisitor, listVisitors, updateVisitor } from './visitors.controller';

export const visitorsRouter = Router();

visitorsRouter.use(authenticate);

visitorsRouter.get('/', listVisitors);
visitorsRouter.post('/', createVisitor);
visitorsRouter.patch('/:id', updateVisitor);
visitorsRouter.delete('/:id', deleteVisitor);
