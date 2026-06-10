import { Router } from 'express';

import { authenticate } from '../../middlewares/auth';
import { createContribution, deleteContribution, listContributions, updateContribution } from './contributions.controller';

export const contributionsRouter = Router();

contributionsRouter.use(authenticate);

contributionsRouter.get('/', listContributions);
contributionsRouter.post('/', createContribution);
contributionsRouter.patch('/:id', updateContribution);
contributionsRouter.delete('/:id', deleteContribution);
