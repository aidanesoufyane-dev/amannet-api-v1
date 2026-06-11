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

export const addApartment = asyncHandler(async (req: Request, res: Response) => {
  const { number, surface, rentAmount, isRented } = req.body;
  if (!number || surface === undefined) {
    res.status(400).json({ message: 'number and surface are required' });
    return;
  }
  const building = await BuildingModel.findByIdAndUpdate(
    req.params.id,
    { $push: { apartments: { number, surface, rentAmount, isRented: isRented ?? false, residents: [] } } },
    { new: true },
  );
  if (!building) {
    res.status(404).json({ message: 'Building not found' });
    return;
  }
  res.json(building);
});

export const removeApartment = asyncHandler(async (req: Request, res: Response) => {
  const building = await BuildingModel.findByIdAndUpdate(
    req.params.id,
    { $pull: { apartments: { number: req.params.aptNumber } } },
    { new: true },
  );
  if (!building) {
    res.status(404).json({ message: 'Building not found' });
    return;
  }
  res.json(building);
});
