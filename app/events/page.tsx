// app/events/page.tsx

'use client';

import { useState } from 'react';
import EventTable from '@/components/tables/EventTable';
import EventForm from '@/components/forms/EventForm';

export default function EventsPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <main className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Events</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Add Event
                </button>
            </div>

            <EventTable />

            {showForm && (
                <EventForm onClose={() => setShowForm(false)} />
            )}
        </main>
    );
}
