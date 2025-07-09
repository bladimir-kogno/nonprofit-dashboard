// app/api/volunteers/route.ts

import { NextResponse } from 'next/server';
import { volunteerSchema } from '@/lib/validators';
import { getFirebaseAdmin } from '@/lib/firebase';
import { getFirestore } from 'firebase-admin/firestore';

export async function GET() {
    const { app } = getFirebaseAdmin();
    const db = getFirestore(app);
    const snapshot = await db.collection('volunteers').get();
    const volunteers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(volunteers);
}

export async function POST(request: Request) {
    const body = await request.json();
    const validation = volunteerSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { app } = getFirebaseAdmin();
    const db = getFirestore(app);
    const docRef = await db.collection('volunteers').add({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });
    const newVolunteer = { id: docRef.id, ...body };
    return NextResponse.json(newVolunteer, { status: 201 });
}
