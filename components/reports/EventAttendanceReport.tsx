// components/reports/EventAttendanceReport.tsx

'use client';

import { useEffect, useState } from 'react';
import { EventAttendanceReport } from '@/types/report';

export default function EventAttendanceReport() {
    const [data, setData] = useState<EventAttendanceReport[]>([]);

    useEffect(() => {
        // Placeholder data — replace with real aggregation logic or API call
        setData([
            { eventId: 'e1', eventTitle: 'Community Clean-Up', totalAttendees: 12 },
            { eventId: 'e2', eventTitle: 'Fundraising Gala', totalAttendees: 8 },
            { eventId: 'e3', eventTitle: 'Workshop', totalAttendees: 15 },
        ]);
    }, []);

    return (
        <div className="bg-white border rounded-md p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Event Attendance</h2>
            <table className="min-w-full table-auto text-sm text-gray-800">
                <thead className="bg-gray-100 text-left font-semibold text-gray-700">
                <tr>
                    <th className="px-4 py-2">Event</th>
                    <th className="px-4 py-2">Total Attendees</th>
                </tr>
                </thead>
                <tbody>
                {data.map((entry) => (
                    <tr key={entry.eventId} className="border-t">
                        <td className="px-4 py-2">{entry.eventTitle}</td>
                        <td className="px-4 py-2">{entry.totalAttendees}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
