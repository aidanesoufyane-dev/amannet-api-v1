import type { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { AuthRequest } from '../../middlewares/auth';
import { IncidentModel } from './incidents.model';

export const getAllIncidents = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const incidents = await IncidentModel.find().sort({ createdAt: -1 });
  res.json(incidents);
});

export const getMyIncidents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const incidents = await IncidentModel.find({ userId }).sort({ createdAt: -1 });
  res.json(incidents);
});

export const reportIncident = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { title, description, type, images } = req.body;

  if (!title || !description || !type) {
    res.status(400).json({ message: 'Title, description, and type are required' });
    return;
  }

  const incident = await IncidentModel.create({
    userId,
    title,
    reportedBy: req.user?.fullName,
    description,
    type,
    images: images || [],
    status: 'open',
  });

  res.status(201).json(incident);
});

export const updateIncident = asyncHandler(async (req: AuthRequest, res: Response) => {
  const incident = await IncidentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(incident);
});

export const deleteIncident = asyncHandler(async (req: AuthRequest, res: Response) => {
  await IncidentModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
