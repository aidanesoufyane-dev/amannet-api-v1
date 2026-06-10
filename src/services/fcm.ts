import admin from 'firebase-admin';

import { env } from '../config/env';

let isInitialized = false;

function initFirebase(): void {
  if (isInitialized) {
    return;
  }

  if (!env.fcm.projectId || !env.fcm.clientEmail || !env.fcm.privateKey) {
    console.warn('FCM is not configured. Skipping initialization.');
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.fcm.projectId,
      clientEmail: env.fcm.clientEmail,
      privateKey: env.fcm.privateKey,
    }),
  });

  isInitialized = true;
}

export async function sendPush(payload: {
  token: string;
  title: string;
  body: string;
}): Promise<void> {
  initFirebase();

  if (!isInitialized) {
    throw Object.assign(new Error('FCM not configured'), { statusCode: 400 });
  }

  await admin.messaging().send({
    token: payload.token,
    notification: {
      title: payload.title,
      body: payload.body,
    },
  });
}
