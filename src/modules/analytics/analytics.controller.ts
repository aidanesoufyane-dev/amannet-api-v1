import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler';

export const trackEvent = asyncHandler(async (req: Request, res: Response) => {
  res.status(202).json({ received: true, event: req.body });
});
