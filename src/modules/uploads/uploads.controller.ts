import type { Request, Response } from 'express';

import { env } from '../../config/env';
import { asyncHandler } from '../../utils/async-handler';

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (env.storageDriver !== 'local') {
    res.status(501).json({ message: 'S3 uploads not implemented yet' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  res.status(201).json({
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
    },
  });
});
