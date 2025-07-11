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
    // Validate environment variables
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Check for missing configuration
    const missingKeys = Object.entries(config)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingKeys.length > 0) {
      console.error('Missing Firebase configuration:', missingKeys);
      throw new Error(`Missing Firebase environment variables: ${missingKeys.join(', ')}`);
    }

    console.log('Initializing Firebase with project:', config.projectId);

    try {
      clientApp = initializeApp(config);
      clientAuth = getAuth(clientApp);
      clientDb = getFirestore(clientApp);
      console.log('Firebase client initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw new Error('Failed to initialize Firebase client');
    }
  }

  return { app: clientApp!, auth: clientAuth!, db: clientDb! };
}