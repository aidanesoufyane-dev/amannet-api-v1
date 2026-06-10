import { Router } from 'express';

import { authenticate } from '../../middlewares/auth';
import { createAnnouncement, deleteAnnouncement, listAnnouncements } from './announcements.controller';

export const announcementsRouter = Router();

announcementsRouter.use(authenticate);

announcementsRouter.get('/', listAnnouncements);
announcementsRouter.post('/', createAnnouncement);
announcementsRouter.delete('/:id', deleteAnnouncement);
