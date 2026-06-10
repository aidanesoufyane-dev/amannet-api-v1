import { Router } from 'express';
import { getProfile, updateProfile, getApartment } from './users.controller';
import { authenticate } from '../../middlewares/auth';

export const profileRouter = Router();

profileRouter.use(authenticate);

profileRouter.get('/profile', getProfile);
profileRouter.put('/profile', updateProfile);
profileRouter.get('/apartment', getApartment);
