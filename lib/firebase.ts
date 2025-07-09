/*
 * lib/firebase.ts
 *
 * Centralised Firebase SDK initialisation that works in both the browser (client) and Node.js (server).
 * - On the browser we use the regular Firebase JS SDK (firebase/app).  
 * - In server-side / API routes we use the Firebase Admin SDK so we can execute privileged operations.
 *
 * All credentials & config values are read from environment variables so nothing sensitive is committed.
 *
 * Environment variables required (update your .env.local):
 *   NEXT_PUBLIC_FIREBASE_API_KEY=<api-key>
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<project-id>
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<project-id>.appspot.com
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
 *   NEXT_PUBLIC_FIREBASE_APP_ID=<app-id>
 *   (optional) FIREBASE_SERVICE_ACCOUNT_KEY (JSON string) – only required for server side
 */

// ---------- Client-side SDK ---------- //
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let clientApp: FirebaseApp | null = null;
let clientAuth: Auth | null = null;
let clientDb: Firestore | null = null;

export function getFirebaseClient() {
  if (typeof window === 'undefined') {
    throw new Error('getFirebaseClient() should only be called in the browser');
  }

  if (!clientApp) {
    clientApp = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
    clientAuth = getAuth(clientApp);
    clientDb = getFirestore(clientApp);
  }

  return { app: clientApp!, auth: clientAuth!, db: clientDb! };
}

// ---------- Server-side SDK ---------- //
import { getApps as getAdminApps, initializeApp as initializeAdminApp, cert, ServiceAccount, App as AdminApp } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from 'firebase-admin/firestore';

let adminApp: AdminApp | null = null;
let adminDb: AdminFirestore | null = null;

export function getFirebaseAdmin() {
  if (!adminApp) {
    const existingApps = getAdminApps();
    if (existingApps.length) {
      adminApp = existingApps[0];
    } else {
      // Parse service account JSON from environment variable
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (!serviceAccountJson) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required for server-side Firebase Admin SDK');
      }

      const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
      adminApp = initializeAdminApp({ credential: cert(serviceAccount) });
    }
    adminDb = getAdminFirestore(adminApp);
  }

  return { app: adminApp!, db: adminDb! };
}