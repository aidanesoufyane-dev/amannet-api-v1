import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { AnnouncementModel } from './announcements.model';

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

  res.status(201).json(announcement);
});

export const deleteAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  await AnnouncementModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
