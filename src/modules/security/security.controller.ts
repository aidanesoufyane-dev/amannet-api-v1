import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';
import { AccessControlModel } from './access-control.model';
import { AccessLogModel } from './access-log.model';
import { GuardModel } from './guards.model';

export const listGuards = asyncHandler(async (_req: Request, res: Response) => {
  const guards = await GuardModel.find().sort({ createdAt: -1 });
  res.json(guards);
});

export const listAccessControls = asyncHandler(async (_req: Request, res: Response) => {
  const controls = await AccessControlModel.find().sort({ createdAt: -1 });
  res.json(controls);
});

export const updateAccessControl = asyncHandler(async (req: Request, res: Response) => {
  const control = await AccessControlModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(control);
});

export const listAccessLogs = asyncHandler(async (_req: Request, res: Response) => {
  const logs = await AccessLogModel.find().sort({ time: -1 });
  res.json(logs);
});
