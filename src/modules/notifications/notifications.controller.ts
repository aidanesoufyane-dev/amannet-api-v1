import type { Request, Response } from 'express';

import { sendPush } from '../../services/fcm';
import { asyncHandler } from '../../utils/async-handler';
import { NotificationModel } from './notifications.model';

export const listNotifications = asyncHandler(async (_req: Request, res: Response) => {
  const notifications = await NotificationModel.find().sort({ sentAt: -1 });
  res.json(notifications);
});

export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  const { title, message, type, sentAt } = req.body;

  if (!title || !message || !type) {
    res.status(400).json({ message: 'title, message, and type are required' });
    return;
  }

  const notification = await NotificationModel.create({
    title,
    message,
    type,
    sentAt: sentAt ?? new Date(),
  });

  res.status(201).json(notification);
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await NotificationModel.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true },
  );
  res.json(notification);
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  await NotificationModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export const sendTestNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, title, body } = req.body as {
      token?: string;
      title?: string;
      body?: string;
    };

    if (!token) {
      res.status(400).json({ error: 'token is required' });
      return;
    }

    await sendPush({
      token,
      title: title ?? 'Setnence',
      body: body ?? 'Test notification',
    });

    res.json({ status: 'sent' });
  },
);
