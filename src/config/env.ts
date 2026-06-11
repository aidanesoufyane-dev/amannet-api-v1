import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  mongoUri: requireEnv('MONGO_URI'),
  baseUrl: process.env.BASE_URL ?? 'http://localhost:4000',
  storageDriver: process.env.STORAGE_DRIVER ?? 'local',
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
  s3: {
    bucket: process.env.S3_BUCKET ?? '',
    region: process.env.S3_REGION ?? '',
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
  },
  fcm: {
    projectId: process.env.FCM_PROJECT_ID ?? '',
    clientEmail: process.env.FCM_CLIENT_EMAIL ?? '',
    privateKey: (process.env.FCM_PRIVATE_KEY ?? '').replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
  },
  auth: {
    otpSenderId: process.env.OTP_SENDER_ID ?? '',
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    appleClientId: process.env.APPLE_CLIENT_ID ?? '',
    appleClientSecret: process.env.APPLE_CLIENT_SECRET ?? '',
  },
  jwt: {
    secret: requireEnv('JWT_SECRET', 'change-me'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
};
