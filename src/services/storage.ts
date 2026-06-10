import { promises as fs } from 'fs';

import { env } from '../config/env';

export async function ensureLocalUploadDir(): Promise<void> {
  if (env.storageDriver !== 'local') {
    return;
  }

  await fs.mkdir(env.uploadDir, { recursive: true });
}
