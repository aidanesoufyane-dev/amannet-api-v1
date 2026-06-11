import { Router } from 'express';
import { getMyGroups, getChatHistory, createGroup, getResidentUsers, getOrCreateDirect, sendMessage } from './chat.controller';
import { authenticate } from '../../middlewares/auth';

export const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.get('/users', getResidentUsers);
chatRouter.get('/groups', getMyGroups);
chatRouter.post('/groups', createGroup);
chatRouter.post('/direct', getOrCreateDirect);
chatRouter.get('/:groupId/history', getChatHistory);
chatRouter.post('/:groupId/messages', sendMessage);
