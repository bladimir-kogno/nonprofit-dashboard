/*
 * lib/firebase-client.ts
 * 
 * Client-only Firebase SDK initialization for static export compatibility.
 * This file ONLY imports the client Firebase SDK to avoid Node.js dependencies.
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let clientApp: FirebaseApp | null = null;
let clientAuth: Auth | null = null;
let clientDb: Firestore | null = null;

export function getFirebaseClient(): { app: FirebaseApp, auth: Auth, db: Firestore } {
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