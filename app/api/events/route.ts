// app/api/events/route.ts

import { NextResponse } from 'next/server';
import { eventSchema } from '@/lib/validators';
import { getFirebaseAdmin } from '@/lib/firebase';
import { getFirestore } from 'firebase-admin/firestore';

export async function GET() {
    const { app } = getFirebaseAdmin();
    const db = getFirestore(app);
    const snapshot = await db.collection('events').get();
    const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(events);
}

export async function POST(request: Request) {
    const body = await request.json();
    const validation = eventSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { app } = getFirebaseAdmin();
    const db = getFirestore(app);
    const docRef = await db.collection('events').add({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });
    const newEvent = { id: docRef.id, ...body };
    return NextResponse.json(newEvent, { status: 201 });
}
