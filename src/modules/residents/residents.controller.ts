import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { ResidentModel } from './residents.model';

export const listResidents = asyncHandler(async (_req: Request, res: Response) => {
  const residents = await ResidentModel.find().sort({ createdAt: -1 });
  res.json(residents);
});

export const createResident = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, apartmentNumber, status } = req.body;

  if (!fullName || !apartmentNumber) {
    res.status(400).json({ message: 'fullName and apartmentNumber are required' });
    return;
  }

  const resident = await ResidentModel.create({
    fullName,
    apartmentNumber,
    status: status ?? 'pending',
  });

  res.status(201).json(resident);
});

export const updateResident = asyncHandler(async (req: Request, res: Response) => {
  const resident = await ResidentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(resident);
});

export const deleteResident = asyncHandler(async (req: Request, res: Response) => {
  await ResidentModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
