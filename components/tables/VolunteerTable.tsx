// components/tables/VolunteerTable.tsx

'use client';

import { useState, useEffect } from 'react';
import { Volunteer } from '@/types/volunteer';

export default function VolunteerTable() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

    useEffect(() => {
        // Placeholder for fetching volunteers — replace with real API call
        setVolunteers([
            {
                id: 'v1',
                name: 'Maria Gonzalez',
                email: 'maria@example.com',
                phone: '555-9876',
                skills: ['Outreach', 'Fundraising'],
                hoursLogged: 42,
                active: true,
                createdAt: '2024-03-01',
                updatedAt: '2024-07-01',
            },
            {
                id: 'v2',
                name: 'James Kim',
                email: 'james@example.com',
                phone: '',
                skills: ['Logistics'],
                hoursLogged: 18,
                active: false,
                createdAt: '2024-05-10',
                updatedAt: '2024-06-22',
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
                    <th className="px-4 py-2">Skills</th>
                    <th className="px-4 py-2">Hours</th>
                    <th className="px-4 py-2">Status</th>
                </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                {volunteers.map((v) => (
                    <tr key={v.id} className="border-t">
                        <td className="px-4 py-2">{v.name}</td>
                        <td className="px-4 py-2">{v.email}</td>
                        <td className="px-4 py-2">{v.phone || '-'}</td>
                        <td className="px-4 py-2">{v.skills.join(', ')}</td>
                        <td className="px-4 py-2">{v.hoursLogged}</td>
                        <td className="px-4 py-2">
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        v.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {v.active ? 'Active' : 'Inactive'}
                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
