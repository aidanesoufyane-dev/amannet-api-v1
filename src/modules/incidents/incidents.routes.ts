import { Router } from 'express';
import {
	deleteIncident,
	getAllIncidents,
	getMyIncidents,
	reportIncident,
	updateIncident,
} from './incidents.controller';
import { authenticate } from '../../middlewares/auth';

export const incidentsRouter = Router();

incidentsRouter.use(authenticate);

incidentsRouter.get('/', getAllIncidents);
incidentsRouter.get('/me', getMyIncidents);
incidentsRouter.post('/', reportIncident);
incidentsRouter.patch('/:id', updateIncident);
incidentsRouter.delete('/:id', deleteIncident);
