import { Router } from 'express';
import { getMyQrCodes, getActiveQrCodes, generateVisitorQr, getMyAccessQr } from './qr.controller';
import { authenticate } from '../../middlewares/auth';

export const qrRouter = Router();

qrRouter.use(authenticate);

qrRouter.get('/my', getMyQrCodes);
qrRouter.get('/my-access', getMyAccessQr);
qrRouter.get('/active', getActiveQrCodes);
qrRouter.post('/generate-visitor', generateVisitorQr);
