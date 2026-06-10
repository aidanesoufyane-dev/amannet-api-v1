import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { ContributionModel } from './contributions.model';

export const listContributions = asyncHandler(async (_req: Request, res: Response) => {
  const items = await ContributionModel.find().sort({ year: -1, month: -1 });
  res.json(items);
});

export const createContribution = asyncHandler(async (req: Request, res: Response) => {
  const requiredFields = [
    'apartmentNumber',
    'residentName',
    'monthlyContribution',
    'remainingBalance',
    'month',
    'year',
  ];

  for (const field of requiredFields) {
    if (req.body[field] === undefined) {
      res.status(400).json({ message: `${field} is required` });
      return;
    }
  }

  const item = await ContributionModel.create(req.body);
  res.status(201).json(item);
});

export const updateContribution = asyncHandler(async (req: Request, res: Response) => {
  const item = await ContributionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

export const deleteContribution = asyncHandler(async (req: Request, res: Response) => {
  await ContributionModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
