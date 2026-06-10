import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';

export const listContent = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ items: [] });
});

export const createContent = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ item: req.body });
});
