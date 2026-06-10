import jwt from 'jsonwebtoken';

import { env } from '../config/env';

export type JwtPayload = {
  sub: string;
  email: string;
  role?: string;
};

export function signToken(payload: JwtPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn as any });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
}
