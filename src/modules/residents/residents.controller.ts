import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { asyncHandler } from '../../utils/async-handler';
import { ResidentModel } from './residents.model';
import { UserModel } from '../users/users.model';

export const listResidents = asyncHandler(async (_req: Request, res: Response) => {
  const residents = await ResidentModel.find().sort({ createdAt: -1 });
  res.json(residents);
});

export const createResident = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, apartmentNumber, status, email, phone, password, userType } = req.body;

  if (!fullName || !apartmentNumber) {
    res.status(400).json({ message: 'fullName and apartmentNumber are required' });
    return;
  }

  let hasAccount = false;

  if (email && password) {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      fullName,
      email,
      phone: phone || '',
      apartmentNumber,
      password: hashedPassword,
      userType: userType || 'Locataire',
    });
    hasAccount = true;
  }

  const resident = await ResidentModel.create({
    fullName,
    apartmentNumber,
    status: status ?? 'pending',
    ...(email && { email }),
    ...(phone && { phone }),
    ...(userType && { userType }),
    hasAccount,
  });

  res.status(201).json(resident);
});

export const updateResident = asyncHandler(async (req: Request, res: Response) => {
  const { password, ...rest } = req.body;

  // If a new password is provided, update it on the linked User account too
  if (password && rest.email) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.findOneAndUpdate({ email: rest.email }, { password: hashedPassword });
  }

  const resident = await ResidentModel.findByIdAndUpdate(req.params.id, rest, { new: true });
  res.json(resident);
});

export const deleteResident = asyncHandler(async (req: Request, res: Response) => {
  const resident = await ResidentModel.findById(req.params.id);
  if (resident?.email) {
    // Also delete the linked User account so they can no longer log in
    await UserModel.findOneAndDelete({ email: resident.email });
  }
  await ResidentModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
