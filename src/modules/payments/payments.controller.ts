import type { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { AuthRequest } from '../../middlewares/auth';
import { BillModel } from './bills.model';

export const getMyBills = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  
  const bills = await BillModel.find({ userId }).sort({ dueDate: 1 });

  res.json(bills);
});

export const payBill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { paymentMethod, transactionId } = req.body;

  const bill = await BillModel.findOne({ _id: id, userId: req.user?.id });
  if (!bill) {
    res.status(404).json({ message: 'Bill not found' });
    return;
  }

  if (bill.status === 'paid') {
    res.status(400).json({ message: 'Bill is already paid' });
    return;
  }

  bill.status = 'paid';
  bill.paymentDate = new Date();
  bill.paymentMethod = paymentMethod || 'card';
  bill.transactionId = transactionId || `txn_${Date.now()}`;
  
  await bill.save();

  res.json(bill);
});
