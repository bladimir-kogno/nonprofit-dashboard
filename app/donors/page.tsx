// app/donors/page.tsx

'use client';

import { useState } from 'react';
import DonorTable from '@/components/tables/DonorTable';
import DonorForm from '@/components/forms/DonorForm';

export default function DonorsPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <main className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Donors</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Add Donor
                </button>
            </div>

            <DonorTable />

            {showForm && (
                <DonorForm onClose={() => setShowForm(false)} />
            )}
        </main>
    );
}
