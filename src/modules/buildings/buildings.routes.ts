import { Router } from 'express';

import { authenticate } from '../../middlewares/auth';
import { addApartment, createBuilding, deleteBuilding, listBuildings, removeApartment, updateBuilding } from './buildings.controller';

export const buildingsRouter = Router();

buildingsRouter.use(authenticate);

buildingsRouter.get('/', listBuildings);
buildingsRouter.post('/', createBuilding);
buildingsRouter.patch('/:id', updateBuilding);
buildingsRouter.delete('/:id', deleteBuilding);
buildingsRouter.post('/:id/apartments', addApartment);
buildingsRouter.delete('/:id/apartments/:aptNumber', removeApartment);
