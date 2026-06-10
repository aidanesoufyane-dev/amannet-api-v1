import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { DocumentModel } from './documents.model';

export const listDocuments = asyncHandler(async (_req: Request, res: Response) => {
  const documents = await DocumentModel.find().sort({ createdAt: -1 });
  res.json(documents);
});

export const createDocument = asyncHandler(async (req: Request, res: Response) => {
  const { name, size, fileUrl } = req.body;

  if (!name || !size) {
    res.status(400).json({ message: 'name and size are required' });
    return;
  }

  const document = await DocumentModel.create({
    name,
    size,
    fileUrl,
  });

  res.status(201).json(document);
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  await DocumentModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
