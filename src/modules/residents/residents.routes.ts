import { Router } from 'express';

import { authenticate } from '../../middlewares/auth';
import { createResident, deleteResident, listResidents, updateResident } from './residents.controller';

export const residentsRouter = Router();

residentsRouter.use(authenticate);

residentsRouter.get('/', listResidents);
residentsRouter.post('/', createResident);
residentsRouter.patch('/:id', updateResident);
residentsRouter.delete('/:id', deleteResident);
