import { Router } from 'express';
import { getProfile, updateProfile, getApartment, saveFcmToken } from './users.controller';
import { authenticate } from '../../middlewares/auth';

export const profileRouter = Router();

profileRouter.use(authenticate);

profileRouter.get('/profile', getProfile);
profileRouter.put('/profile', updateProfile);
profileRouter.get('/apartment', getApartment);
profileRouter.post('/fcm-token', saveFcmToken);
