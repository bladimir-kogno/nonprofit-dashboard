// components/tables/EventTable.tsx

'use client';

import { useEffect, useState } from 'react';
import { Event } from '@/types/event';

export default function EventTable() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        // Placeholder for fetching events — replace with real API call
        setEvents([
            {
                id: 'e1',
                title: 'Community Clean-Up',
                date: '2025-07-15',
                location: 'River Park',
                description: 'Trash pickup and beautification',
                status: 'upcoming',
                attendees: ['v1', 'v2'],
                createdAt: '2025-06-01',
                updatedAt: '2025-07-01',
            },
            {
                id: 'e2',
                title: 'Fundraising Gala',
                date: '2025-06-10',
                location: 'City Hall',
                description: 'Annual donor event',
                status: 'completed',
                attendees: ['v3'],
                createdAt: '2025-04-20',
                updatedAt: '2025-06-11',
            },
        ]);
    }, []);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-700';
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="overflow-x-auto bg-white border rounded-md">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Attendees</th>
                </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                {events.map((event) => (
                    <tr key={event.id} className="border-t">
                        <td className="px-4 py-2">{event.title}</td>
                        <td className="px-4 py-2">{event.date}</td>
                        <td className="px-4 py-2">{event.location}</td>
                        <td className="px-4 py-2">
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(event.status)}`}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                        </td>
                        <td className="px-4 py-2">{event.attendees.length}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
