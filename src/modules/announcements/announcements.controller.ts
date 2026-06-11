import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { AnnouncementModel } from './announcements.model';
import { UserModel } from '../users/users.model';
import { sendPushToMany } from '../../services/fcm';

export const listAnnouncements = asyncHandler(async (_req: Request, res: Response) => {
  const announcements = await AnnouncementModel.find().sort({ publishedAt: -1 });
  res.json(announcements);
});

export const createAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, publishedAt } = req.body;

  if (!title || !content) {
    res.status(400).json({ message: 'title and content are required' });
    return;
  }

  const announcement = await AnnouncementModel.create({
    title,
    content,
    publishedAt: publishedAt ?? new Date(),
  });

  // Push notification to all residents
  const residents = await UserModel.find({
    userType: { $in: ['Locataire', 'Propriétaire'] },
    fcmToken: { $exists: true, $ne: null },
  });
  const tokens = residents.map((u) => u.fcmToken as string).filter(Boolean);
  if (tokens.length > 0) {
    await sendPushToMany({
      tokens,
      title: `📢 ${title}`,
      body: content.length > 100 ? content.substring(0, 97) + '...' : content,
      data: { announcementId: String(announcement._id), type: 'announcement' },
    });
  }

  res.status(201).json(announcement);
});

export const deleteAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  await AnnouncementModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
