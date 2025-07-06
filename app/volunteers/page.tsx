'use client';

import { useState } from 'react';
import VolunteerForm from '../../components/forms/VolunteerForm';
import VolunteerTable from '../../components/tables/VolunteerTable';

export default function VolunteersPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <main className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Volunteers</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Add Volunteer
                </button>
            </div>

            <VolunteerTable />

            {showForm && (
                <VolunteerForm onClose={() => setShowForm(false)} />
            )}
        </main>
    );
}
