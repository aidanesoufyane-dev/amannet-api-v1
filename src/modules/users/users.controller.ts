import type { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { AuthRequest } from '../../middlewares/auth';
import { UserModel } from './users.model';

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  // req.user is populated by authenticate middleware
  res.json(req.user);
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const updates = req.body;

  // Prevent password or restricted fields update through this route
  delete updates.password;
  delete updates.userType;
  delete updates._id;

  const user = await UserModel.findByIdAndUpdate(userId, updates, { new: true });
  res.json(user);
});

export const saveFcmToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ message: 'token is required' });
    return;
  }
  await UserModel.findByIdAndUpdate(userId, { fcmToken: token });
  res.json({ message: 'ok' });
});

export const getApartment = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Dummy implementation for apartment info based on user's apartment number
  res.json({
    apartmentNumber: req.user?.apartmentNumber,
    floor: 1, // Mocked
    building: "A", // Mocked
  });
});
