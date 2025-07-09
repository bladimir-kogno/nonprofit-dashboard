// app/api/donors/route.ts

import { NextResponse } from 'next/server';
import { donorSchema } from '@/lib/validators';
import { getFirebaseAdmin } from '@/lib/firebase';
import { getFirestore } from 'firebase-admin/firestore';

export async function GET() {
    const { app } = getFirebaseAdmin();
    const db = getFirestore(app);
    const snapshot = await db.collection('donors').get();
    const donors = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(donors);
}

export async function POST(request: Request) {
    const body = await request.json();
    const validation = donorSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { app } = getFirebaseAdmin();
    const db = getFirestore(app);
    const docRef = await db.collection('donors').add({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });
    const newDonor = { id: docRef.id, ...body };
    return NextResponse.json(newDonor, { status: 201 });
}
