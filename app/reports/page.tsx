// app/reports/page.tsx

'use client';

import { useState } from 'react';
import DonationReport from '@/components/reports/DonationReport';
import VolunteerHoursReport from '@/components/reports/VolunteerHoursReport';
import EventAttendanceReport from '@/components/reports/EventAttendanceReport';

export default function ReportsPage() {
    const [selected, setSelected] = useState<'donations' | 'volunteer-hours' | 'event-attendance'>('donations');

    return (
        <main className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Reports</h1>

            <div className="flex gap-4">
                <button
                    onClick={() => setSelected('donations')}
                    className={`px-4 py-2 rounded-md text-sm ${
                        selected === 'donations' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                >
                    Donations
                </button>
                <button
                    onClick={() => setSelected('volunteer-hours')}
                    className={`px-4 py-2 rounded-md text-sm ${
                        selected === 'volunteer-hours' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                >
                    Volunteer Hours
                </button>
                <button
                    onClick={() => setSelected('event-attendance')}
                    className={`px-4 py-2 rounded-md text-sm ${
                        selected === 'event-attendance' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                >
                    Event Attendance
                </button>
            </div>

            <div>
                {selected === 'donations' && <DonationReport />}
                {selected === 'volunteer-hours' && <VolunteerHoursReport />}
                {selected === 'event-attendance' && <EventAttendanceReport />}
            </div>
        </main>
    );
}
