import { Router } from 'express';
import multer from 'multer';

import { env } from '../../config/env';
import { ensureLocalUploadDir } from '../../services/storage';
import { uploadFile } from './uploads.controller';

ensureLocalUploadDir().catch((error) => {
  console.error('Failed to prepare upload directory', error);
});

const upload = multer({ dest: env.uploadDir });

export const uploadsRouter = Router();

uploadsRouter.post('/', upload.single('file'), uploadFile);
