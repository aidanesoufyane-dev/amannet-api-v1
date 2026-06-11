import admin from 'firebase-admin';
import { env } from '../config/env';

let isInitialized = false;

function initFirebase(): void {
  if (isInitialized) return;
  if (!env.fcm.projectId || !env.fcm.clientEmail || !env.fcm.privateKey) {
    console.warn('FCM is not configured. Skipping initialization.');
    return;
  }
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.fcm.projectId,
        clientEmail: env.fcm.clientEmail,
        privateKey: env.fcm.privateKey,
      }),
    });
    isInitialized = true;
    console.log('FCM initialized successfully.');
  } catch (err) {
    console.error('FCM initialization failed:', err);
  }
}

export async function sendPush(payload: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<void> {
  initFirebase();
  if (!isInitialized) return;
  try {
    await admin.messaging().send({
      token: payload.token,
      notification: { title: payload.title, body: payload.body },
      data: payload.data,
      android: { priority: 'high' },
    });
  } catch (err) {
    console.error('FCM send error:', err);
  }
}

export async function sendPushToMany(payload: {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<void> {
  initFirebase();
  if (!isInitialized || payload.tokens.length === 0) return;
  try {
    await admin.messaging().sendEachForMulticast({
      tokens: payload.tokens,
      notification: { title: payload.title, body: payload.body },
      data: payload.data,
      android: { priority: 'high' },
    });
  } catch (err) {
    console.error('FCM multicast error:', err);
  }
}
