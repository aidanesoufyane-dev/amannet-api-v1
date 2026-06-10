import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { BuildingModel } from './buildings.model';

export const listBuildings = asyncHandler(async (_req: Request, res: Response) => {
  const items = await BuildingModel.find().sort({ createdAt: -1 });
  res.json(items);
});

export const createBuilding = asyncHandler(async (req: Request, res: Response) => {
  const { name, zone, apartmentsCount } = req.body;

  if (!name || !zone || apartmentsCount === undefined) {
    res.status(400).json({ message: 'name, zone, and apartmentsCount are required' });
    return;
  }

  const item = await BuildingModel.create(req.body);
  res.status(201).json(item);
});

export const updateBuilding = asyncHandler(async (req: Request, res: Response) => {
  const item = await BuildingModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

export const deleteBuilding = asyncHandler(async (req: Request, res: Response) => {
  await BuildingModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
