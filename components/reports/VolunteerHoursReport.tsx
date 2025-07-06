// components/reports/VolunteerHoursReport.tsx

'use client';

import { useEffect, useState } from 'react';
import type { VolunteerHoursReport as VolunteerHoursRow } from '@/types/report';

export default function VolunteerHoursReport() {
    const [data, setData] = useState<VolunteerHoursRow[]>([]);

    useEffect(() => {
        setData([
            { volunteerId: 'v1', volunteerName: 'Maria Gonzalez', totalHours: 42 },
            { volunteerId: 'v2', volunteerName: 'James Kim', totalHours: 18 },
            { volunteerId: 'v3', volunteerName: 'Lena Patel', totalHours: 36 },
        ]);
    }, []);

    return (
        <div className="bg-white border rounded-md p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Volunteer Hours</h2>
            <table className="min-w-full table-auto text-sm text-gray-800">
                <thead className="bg-gray-100 text-left font-semibold text-gray-700">
                <tr>
                    <th className="px-4 py-2">Volunteer</th>
                    <th className="px-4 py-2">Total Hours</th>
                </tr>
                </thead>
                <tbody>
                {data.map((entry) => (
                    <tr key={entry.volunteerId} className="border-t">
                        <td className="px-4 py-2">{entry.volunteerName}</td>
                        <td className="px-4 py-2">{entry.totalHours}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
