import { App, cert, getApps, initializeApp } from 'firebase-admin/app';

/**
 * Initializes the Firebase Admin app only when all credentials are present.
 * Returns the app, or null when Firebase is not configured (push notifications disabled).
 */
export function initFirebaseApp(env: NodeJS.ProcessEnv = process.env): App | null {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}
