import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { errorHandler } from './middlewares/error-handler';
import { requestLogger } from './middlewares/request-logger';
import { router } from './routes';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api', router);

app.use(errorHandler);
