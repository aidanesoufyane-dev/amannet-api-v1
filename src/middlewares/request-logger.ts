import pinoHttp from 'pino-http';

import { env } from '../config/env';

export const requestLogger = pinoHttp({
  level: env.logLevel,
  autoLogging: true,
});
