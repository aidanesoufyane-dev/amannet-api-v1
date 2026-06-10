import { Router } from 'express';
import { login, register, refreshToken, logout } from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/refresh', refreshToken);
authRouter.post('/logout', logout);
