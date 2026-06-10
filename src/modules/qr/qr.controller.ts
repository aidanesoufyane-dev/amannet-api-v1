import type { Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { asyncHandler } from '../../utils/async-handler';
import { AuthRequest } from '../../middlewares/auth';
import { QrCodeModel, VisitorModel } from './qr.model';

export const getMyQrCodes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  
  const qrCodes = await QrCodeModel.find({ createdBy: userId })
    .populate('visitorId')
    .sort({ createdAt: -1 });

  res.json(qrCodes);
});

export const getActiveQrCodes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const now = new Date();

  const activeQrCodes = await QrCodeModel.find({ 
    createdBy: userId,
    active: true,
    expiry: { $gt: now }
  }).populate('visitorId');

  res.json(activeQrCodes);
});

export const generateVisitorQr = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, type, durationHours = 24 } = req.body;

  if (!name || !type) {
    res.status(400).json({ message: 'Visitor name and type are required' });
    return;
  }

  // Create Visitor
  const visitor = await VisitorModel.create({
    name,
    type,
    createdBy: userId,
  });

  // Generate unique token
  const token = crypto.randomBytes(16).toString('hex');
  
  // Set expiry
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + durationHours);

  // Create QR Code
  const qrCode = await QrCodeModel.create({
    token,
    visitorId: visitor.id,
    createdBy: userId,
    expiry,
    active: true,
  });

  res.status(201).json({
    visitor,
    qrCode,
  });
});

export const getMyAccessQr = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-development';

  const token = jwt.sign({ userId, purpose: 'access' }, JWT_SECRET, { expiresIn: '30s' });
  const expiry = new Date(Date.now() + 30 * 1000);

  res.json({
    id: userId,
    token,
    expiry: expiry.toISOString(),
  });
});
