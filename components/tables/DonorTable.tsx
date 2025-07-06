// components/tables/DonorTable.tsx

'use client';

import { useState, useEffect } from 'react';
import { Donor } from '@/types/donor';
import { formatCurrency } from '@/lib/helpers';

export default function DonorTable() {
    const [donors, setDonors] = useState<Donor[]>([]);

    useEffect(() => {
        // Placeholder for fetching donors — replace with real API call
        setDonors([
            {
                id: '1',
                name: 'Alice Morgan',
                email: 'alice@example.com',
                phone: '555-1234',
                totalDonated: 1200,
                lastDonationDate: '2024-10-15',
                createdAt: '2024-01-01',
                updatedAt: '2024-10-15',
            },
            {
                id: '2',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '555-5678',
                totalDonated: 850,
                lastDonationDate: '2024-12-10',
                createdAt: '2024-02-10',
                updatedAt: '2024-12-10',
            },
        ]);
    }, []);

    return (
        <div className="overflow-x-auto bg-white border rounded-md">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Total Donated</th>
                    <th className="px-4 py-2">Last Donation</th>
                </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                {donors.map((donor) => (
                    <tr key={donor.id} className="border-t">
                        <td className="px-4 py-2">{donor.name}</td>
                        <td className="px-4 py-2">{donor.email}</td>
                        <td className="px-4 py-2">{donor.phone || '-'}</td>
                        <td className="px-4 py-2">{formatCurrency(donor.totalDonated)}</td>
                        <td className="px-4 py-2">{donor.lastDonationDate || '-'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
