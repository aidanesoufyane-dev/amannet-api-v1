import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { BuildingModel } from '../buildings/buildings.model';
import { IncidentModel } from '../incidents/incidents.model';
import { ResidentModel } from '../residents/residents.model';
import { VisitorModel } from '../visitors/visitors.model';

export const getMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const [residents, visitors, incidents, buildings] = await Promise.all([
    ResidentModel.countDocuments(),
    VisitorModel.countDocuments({
      visitAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    IncidentModel.countDocuments({ status: { $ne: 'resolved' } }),
    BuildingModel.countDocuments(),
  ]);

  res.json({
    residents,
    visitors,
    incidents,
    buildings,
  });
});

export const getRecentActivity = asyncHandler(async (_req: Request, res: Response) => {
  const incidents = await IncidentModel.find().sort({ createdAt: -1 }).limit(5);

  const activity = incidents.map((incident) => ({
    title: incident.title,
    subtitle: incident.location ?? incident.type,
    status: incident.status,
    operator: incident.reportedBy ?? 'System',
    time: incident.createdAt,
  }));

  res.json(activity);
});
