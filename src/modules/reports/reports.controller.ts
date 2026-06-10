import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { ReportModel } from './reports.model';

export const listReports = asyncHandler(async (_req: Request, res: Response) => {
  const reports = await ReportModel.find().sort({ createdAt: -1 });
  res.json(reports);
});

export const createReport = asyncHandler(async (req: Request, res: Response) => {
  const { title, status, author, period } = req.body;

  if (!title || !author || !period) {
    res.status(400).json({ message: 'title, author, and period are required' });
    return;
  }

  const report = await ReportModel.create({
    title,
    status: status ?? 'draft',
    author,
    period,
  });

  res.status(201).json(report);
});
