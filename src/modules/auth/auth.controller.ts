import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { asyncHandler } from '../../utils/async-handler';
import { UserModel } from '../users/users.model';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-development';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone, apartmentNumber, password, userType } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: 'User already exists with this email' });
    return;
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const user = await UserModel.create({
    fullName,
    email,
    phone,
    apartmentNumber,
    password: hashedPassword,
    userType: userType || 'Locataire',
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    user,
    token,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user || !user.password) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    user,
    token,
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  // In a real app, verify the refresh token and issue a new access token
  res.status(501).json({ message: 'Refresh token not fully implemented' });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Client-side logout usually suffices for JWT, but can invalidate tokens here
  res.status(200).json({ message: 'Logged out successfully' });
});
