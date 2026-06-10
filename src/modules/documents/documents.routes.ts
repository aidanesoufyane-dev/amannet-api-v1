import { Router } from 'express';

import { authenticate } from '../../middlewares/auth';
import { createDocument, deleteDocument, listDocuments } from './documents.controller';

export const documentsRouter = Router();

documentsRouter.use(authenticate);

documentsRouter.get('/', listDocuments);
documentsRouter.post('/', createDocument);
documentsRouter.delete('/:id', deleteDocument);
