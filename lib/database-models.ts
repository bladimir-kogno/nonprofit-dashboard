// Database Models for Email Newsletter Management System

// Firebase / Firestore implementation (Client SDK) and Admin SDK types
import { collection as clientCollection, getDocs as clientGetDocs, query as clientQuery, where as clientWhere, addDoc, updateDoc as clientUpdateDoc, doc as clientDoc, writeBatch as clientWriteBatch, deleteDoc } from 'firebase/firestore';
import type { Firestore as ClientFirestore, CollectionReference as ClientCollectionReference, DocumentReference as ClientDocumentReference, WriteBatch as ClientWriteBatch } from 'firebase/firestore';
import { getFirebaseClient, getFirebaseAdmin } from './firebase';
import type { Firestore as AdminFirestore } from 'firebase-admin/firestore';

// Helper to get Firestore instance regardless of environment (client/server)
const getDb = (): ClientFirestore | AdminFirestore => {
  if (typeof window === 'undefined') {
    return getFirebaseAdmin().db as AdminFirestore;
  } else {
    return getFirebaseClient().db as ClientFirestore;
  }
};


export interface EmailRecipient {
  id: string;
  email: string;
  name: string;
  type: 'donor' | 'volunteer' | 'subscriber' | 'event_attendee';
  status: 'active' | 'unsubscribed' | 'bounced';
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
}

export class EmailRecipientService {
  static collectionName = 'email_recipients';

  // Helper to get the correct Firestore instance based on environment
  private static getFirestoreInstance(): ClientFirestore | AdminFirestore {
    return getDb();
  }

  static async getAll(): Promise<EmailRecipient[]> {
    const db = this.getFirestoreInstance();
    let snapshot;
    if (typeof window === 'undefined') {
      snapshot = await (db as AdminFirestore).collection(this.collectionName).get();
    } else {
      snapshot = await clientGetDocs(clientCollection(db as ClientFirestore, this.collectionName));
    }
    return snapshot.docs.map(d => ({ ...(d.data() as EmailRecipient) }));
  }

  static async getByType(type: EmailRecipient['type']): Promise<EmailRecipient[]> {
    const db = this.getFirestoreInstance();
    let snapshot;
    if (typeof window === 'undefined') {
      const collectionRef = (db as AdminFirestore).collection(this.collectionName);
      const q = collectionRef.where('type', '==', type);
      snapshot = await q.get();
    } else {
      const collectionRef = clientCollection(db as ClientFirestore, this.collectionName);
      const q = clientQuery(collectionRef as any, clientWhere('type', '==', type));
      snapshot = await clientGetDocs(q);
    }
    return snapshot.docs.map(d => ({ ...(d.data() as EmailRecipient) }));
  }

  static async create(recipient: Omit<EmailRecipient, 'id'>): Promise<EmailRecipient> {
    const db = this.getFirestoreInstance();
    if (typeof window === 'undefined') {
      // Server-side with Admin SDK
      const docRef = await (db as AdminFirestore).collection(this.collectionName).add({
        ...recipient,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { ...(recipient as EmailRecipient), id: docRef.id };
    } else {
      // Client-side with Client SDK
      const docRef = await addDoc(clientCollection(db as ClientFirestore, this.collectionName), {
        ...recipient,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { ...(recipient as EmailRecipient), id: docRef.id };
    }
  }

  static async bulkImport(recipients: Omit<EmailRecipient, 'id'>[]): Promise<EmailRecipient[]> {
    const db = this.getFirestoreInstance();
    let batch: ClientWriteBatch | import('firebase-admin/firestore').WriteBatch;
    let collectionRef: ClientCollectionReference | import('firebase-admin/firestore').CollectionReference;

    if (typeof window === 'undefined') {
      batch = (db as AdminFirestore).batch();
      collectionRef = (db as AdminFirestore).collection(this.collectionName);
      const adminBatch = batch as import('firebase-admin/firestore').WriteBatch;
      const adminCollectionRef = collectionRef as import('firebase-admin/firestore').CollectionReference;

      const created: EmailRecipient[] = [];
      for (const r of recipients) {
        const ref = adminCollectionRef.doc();
        adminBatch.set(ref, {
          ...r,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        created.push({ ...(r as EmailRecipient) });
      }
      await adminBatch.commit();
      return created;

    } else {
      batch = clientWriteBatch(db as ClientFirestore);
      collectionRef = clientCollection(db as ClientFirestore, this.collectionName);
      const clientBatch = batch as ClientWriteBatch;
      const clientCollectionRef = collectionRef as ClientCollectionReference;

      const created: EmailRecipient[] = [];
      for (const r of recipients) {
        const ref = clientDoc(clientCollectionRef);
        clientBatch.set(ref, {
          ...r,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        created.push({ ...(r as EmailRecipient) });
      }
      await clientBatch.commit();
      return created;
    }
  }


  static async unsubscribe(id: string): Promise<void> {
    const db = this.getFirestoreInstance();
    if (typeof window === 'undefined') {
      await (db as AdminFirestore).collection(this.collectionName).doc(id).update({
        status: 'unsubscribed',
        updated_at: new Date().toISOString(),
      });
    } else {
      await clientUpdateDoc(clientDoc(db as ClientFirestore, this.collectionName, id), {
        status: 'unsubscribed',
        updated_at: new Date().toISOString(),
      });
    }
  }

  static async bulkUnsubscribe(ids: string[]): Promise<void> {
    const db = this.getFirestoreInstance();
    let batch: ClientWriteBatch | import('firebase-admin/firestore').WriteBatch;

    if (typeof window === 'undefined') {
      batch = (db as AdminFirestore).batch();
      const adminBatch = batch as import('firebase-admin/firestore').WriteBatch;
      for (const id of ids) {
        const docRef = (db as AdminFirestore).collection(this.collectionName).doc(id);
        adminBatch.update(docRef, {
          status: 'unsubscribed',
          updated_at: new Date().toISOString(),
        });
      }
      await adminBatch.commit();
    } else {
      batch = clientWriteBatch(db as ClientFirestore);
      const clientBatch = batch as ClientWriteBatch;
      for (const id of ids) {
        const docRef = clientDoc(db as ClientFirestore, this.collectionName, id);
        clientBatch.update(docRef, {
          status: 'unsubscribed',
          updated_at: new Date().toISOString(),
        });
      }
      await clientBatch.commit();
    }
  }

  static async delete(id: string): Promise<void> {
    const db = this.getFirestoreInstance();
    if (typeof window === 'undefined') {
      await (db as AdminFirestore).collection(this.collectionName).doc(id).delete();
    } else {
      // Note: Deleting directly from client is often restricted by security rules
      // This might be better handled via a Cloud Function if not allowed
      console.warn('Client-side delete might be restricted by security rules.');
      await deleteDoc(clientDoc(db as ClientFirestore, this.collectionName, id));
    }
  }

  static async bulkDelete(ids: string[]): Promise<void> {
    const db = this.getFirestoreInstance();
    let batch: ClientWriteBatch | import('firebase-admin/firestore').WriteBatch;

    if (typeof window === 'undefined') {
      batch = (db as AdminFirestore).batch();
      const adminBatch = batch as import('firebase-admin/firestore').WriteBatch;
      for (const id of ids) {
        const docRef = (db as AdminFirestore).collection(this.collectionName).doc(id);
        adminBatch.delete(docRef);
      }
      await adminBatch.commit();
    } else {
      batch = clientWriteBatch(db as ClientFirestore);
      const clientBatch = batch as ClientWriteBatch;
      console.warn('Client-side bulk delete might be restricted by security rules.');
      for (const id of ids) {
        const docRef = clientDoc(db as ClientFirestore, this.collectionName, id);
        clientBatch.delete(docRef);
      }
      await clientBatch.commit();
    }
  }

  static async update(id: string, updates: Partial<Omit<EmailRecipient, 'id'>>): Promise<void> {
    const db = this.getFirestoreInstance();
    if (typeof window === 'undefined') {
      await (db as AdminFirestore).collection(this.collectionName).doc(id).update({
        ...updates,
        updated_at: new Date().toISOString(),
      });
    } else {
      await clientUpdateDoc(clientDoc(db as ClientFirestore, this.collectionName, id), {
        ...updates,
        updated_at: new Date().toISOString(),
      });
    }
  }
}


// Helper functions previously exported
export const replaceTemplateVariables = (content: string, variables: Record<string, string>): string => {
  let result = content;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    result = result.replace(regex, value);
  });
  return result;
};

export const validateEmailAddress = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateUnsubscribeLink = (recipientId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/unsubscribe/${recipientId}`;
};

export const trackEmailOpen = async (campaignId: string): Promise<void> => {
  // TODO: Implement tracking collection in Firestore if needed
  console.warn('trackEmailOpen() not implemented for Firebase');
};

export const trackEmailClick = async (campaignId: string): Promise<void> => {
  // TODO: Implement tracking collection in Firestore if needed
  console.warn('trackEmailClick() not implemented for Firebase');
};