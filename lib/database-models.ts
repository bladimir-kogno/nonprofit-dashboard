// Database Models for Email Newsletter Management System

// Firebase / Firestore implementation
import { collection, getDocs, query, where, addDoc, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { getFirebaseClient, getFirebaseAdmin } from './firebase';

// Helper to get Firestore instance regardless of environment (client/server)
const getDb = () => {
  try {
    // Browser
    return getFirebaseClient().db;
  } catch {
    // Server
    return getFirebaseAdmin().db;
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

  static async getAll(): Promise<EmailRecipient[]> {
    const db = getDb();
    const snapshot = await getDocs(collection(db, this.collectionName));
    return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as EmailRecipient) }));
  }

  static async getByType(type: EmailRecipient['type']): Promise<EmailRecipient[]> {
    const db = getDb();
    const q = query(collection(db, this.collectionName), where('type', '==', type));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as EmailRecipient) }));
  }

  static async create(recipient: Omit<EmailRecipient, 'id'>): Promise<EmailRecipient> {
    const db = getDb();
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...recipient,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return { id: docRef.id, ...(recipient as any) } as EmailRecipient;
  }

  static async bulkImport(recipients: Omit<EmailRecipient, 'id'>[]): Promise<EmailRecipient[]> {
    const db = getDb();
    const batch = writeBatch(db);
    const created: EmailRecipient[] = [];

    for (const r of recipients) {
      const ref = doc(collection(db, this.collectionName));
      batch.set(ref, {
        ...r,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      created.push({ id: ref.id, ...(r as any) });
    }

    await batch.commit();
    return created;
  }

  static async unsubscribe(id: string): Promise<void> {
    const db = getDb();
    await updateDoc(doc(db, this.collectionName, id), {
      status: 'unsubscribed',
      updated_at: new Date().toISOString(),
    });
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