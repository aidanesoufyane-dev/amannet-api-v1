import { Router } from 'express';
import { getMyBills, payBill } from './payments.controller';
import { authenticate } from '../../middlewares/auth';

export const paymentsRouter = Router();

paymentsRouter.use(authenticate);

paymentsRouter.get('/', getMyBills);
paymentsRouter.post('/:id/pay', payBill);
