import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { PackageModel } from './packages.model';

export const listPackages = asyncHandler(async (_req: Request, res: Response) => {
  const packages = await PackageModel.find().sort({ dateReceived: -1 });
  res.json(packages);
});

export const createPackage = asyncHandler(async (req: Request, res: Response) => {
  const requiredFields = [
    'residentName',
    'apartmentNumber',
    'buildingName',
    'deliveryCompany',
    'description',
    'price',
    'dateReceived',
    'timeReceived',
  ];

  for (const field of requiredFields) {
    if (req.body[field] === undefined) {
      res.status(400).json({ message: `${field} is required` });
      return;
    }
  }

  const item = await PackageModel.create(req.body);
  res.status(201).json(item);
});

export const updatePackage = asyncHandler(async (req: Request, res: Response) => {
  const item = await PackageModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

export const deletePackage = asyncHandler(async (req: Request, res: Response) => {
  await PackageModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
