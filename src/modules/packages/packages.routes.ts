import { Router } from 'express';

import { authenticate } from '../../middlewares/auth';
import { createPackage, deletePackage, listPackages, updatePackage } from './packages.controller';

export const packagesRouter = Router();

packagesRouter.use(authenticate);

packagesRouter.get('/', listPackages);
packagesRouter.post('/', createPackage);
packagesRouter.patch('/:id', updatePackage);
packagesRouter.delete('/:id', deletePackage);
