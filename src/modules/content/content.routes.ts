import { Router } from 'express';

import { createContent, listContent } from './content.controller';

export const contentRouter = Router();

contentRouter.get('/', listContent);
contentRouter.post('/', createContent);
