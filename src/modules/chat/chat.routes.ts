import { Router } from 'express';
import { getMyGroups, getChatHistory, createGroup } from './chat.controller';
import { authenticate } from '../../middlewares/auth';

export const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.get('/groups', getMyGroups);
chatRouter.post('/groups', createGroup);
chatRouter.get('/:groupId/history', getChatHistory);
