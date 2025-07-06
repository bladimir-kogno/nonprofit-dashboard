// app/api/volunteers/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { volunteerSchema } from '@/lib/validators';

export async function GET() {
    const { data, error } = await supabase.from('volunteers').select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const validation = volunteerSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { data, error } = await supabase.from('volunteers').insert([body]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
