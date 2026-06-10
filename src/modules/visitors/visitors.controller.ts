import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { VisitorModel } from './visitors.model';

export const listVisitors = asyncHandler(async (_req: Request, res: Response) => {
  const visitors = await VisitorModel.find().sort({ visitAt: -1 });
  res.json(visitors);
});

export const createVisitor = asyncHandler(async (req: Request, res: Response) => {
  const { name, invitedBy, visitAt, status } = req.body;

  if (!name || !invitedBy || !visitAt) {
    res.status(400).json({ message: 'name, invitedBy, and visitAt are required' });
    return;
  }

  const visitor = await VisitorModel.create({
    name,
    invitedBy,
    visitAt,
    status: status ?? 'pending',
  });

  res.status(201).json(visitor);
});

export const updateVisitor = asyncHandler(async (req: Request, res: Response) => {
  const visitor = await VisitorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(visitor);
});

export const deleteVisitor = asyncHandler(async (req: Request, res: Response) => {
  await VisitorModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
