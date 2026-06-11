import { Router } from 'express';
import { getMyGroups, getChatHistory, createGroup, getResidentUsers, getOrCreateDirect, sendMessage, setupConversations, getGroupInfo, setupAllBuildingGroups } from './chat.controller';
import { authenticate } from '../../middlewares/auth';

export const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.get('/users', getResidentUsers);
chatRouter.get('/groups', getMyGroups);
chatRouter.post('/groups', createGroup);
chatRouter.post('/direct', getOrCreateDirect);
chatRouter.post('/setup', setupConversations);
chatRouter.post('/admin/setup-buildings', setupAllBuildingGroups);
chatRouter.get('/:groupId/info', getGroupInfo);
chatRouter.get('/:groupId/history', getChatHistory);
chatRouter.post('/:groupId/messages', sendMessage);
