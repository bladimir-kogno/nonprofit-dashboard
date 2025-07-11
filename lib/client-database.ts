// Client-side only database models for static export compatibility
// This file only uses Firebase Client SDK to avoid Node.js dependencies

import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  doc, 
  writeBatch, 
  deleteDoc 
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getFirebaseClient } from './firebase-client';

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

  private static getDb(): Firestore {
    return getFirebaseClient().db;
  }

  static async getAll(): Promise<EmailRecipient[]> {
    const db = this.getDb();
    const snapshot = await getDocs(collection(db, this.collectionName));
    return snapshot.docs.map(d => ({ 
      id: d.id,
      ...(d.data() as Omit<EmailRecipient, 'id'>)
    }));
  }

  static async getByType(type: EmailRecipient['type']): Promise<EmailRecipient[]> {
    const db = this.getDb();
    const collectionRef = collection(db, this.collectionName);
    const q = query(collectionRef, where('type', '==', type));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ 
      id: d.id,
      ...(d.data() as Omit<EmailRecipient, 'id'>)
    }));
  }

  static async create(recipient: Omit<EmailRecipient, 'id'>): Promise<EmailRecipient> {
    const db = this.getDb();
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...recipient,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return { 
      ...recipient,
      id: docRef.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  static async bulkImport(recipients: Omit<EmailRecipient, 'id'>[]): Promise<EmailRecipient[]> {
    const db = this.getDb();
    const batch = writeBatch(db);
    const collectionRef = collection(db, this.collectionName);

    const created: EmailRecipient[] = [];
    for (const r of recipients) {
      const ref = doc(collectionRef);
      batch.set(ref, {
        ...r,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      created.push({ 
        ...r,
        id: ref.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    await batch.commit();
    return created;
  }

  static async unsubscribe(id: string): Promise<void> {
    const db = this.getDb();
    await updateDoc(doc(db, this.collectionName, id), {
      status: 'unsubscribed',
      updated_at: new Date().toISOString(),
    });
  }

  static async bulkUnsubscribe(ids: string[]): Promise<void> {
    const db = this.getDb();
    const batch = writeBatch(db);
    
    for (const id of ids) {
      const docRef = doc(db, this.collectionName, id);
      batch.update(docRef, {
        status: 'unsubscribed',
        updated_at: new Date().toISOString(),
      });
    }
    await batch.commit();
  }

  static async delete(id: string): Promise<void> {
    const db = this.getDb();
    await deleteDoc(doc(db, this.collectionName, id));
  }

  static async bulkDelete(ids: string[]): Promise<void> {
    const db = this.getDb();
    const batch = writeBatch(db);
    
    for (const id of ids) {
      const docRef = doc(db, this.collectionName, id);
      batch.delete(docRef);
    }
    await batch.commit();
  }

  static async update(id: string, updates: Partial<Omit<EmailRecipient, 'id'>>): Promise<void> {
    const db = this.getDb();
    await updateDoc(doc(db, this.collectionName, id), {
      ...updates,
      updated_at: new Date().toISOString(),
    });
  }
}

// Helper functions
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