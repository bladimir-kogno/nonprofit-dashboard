// app/page.tsx

'use client';

import SummaryCard from '../../components/cards/SummaryCard';

export default function DashboardPage() {
    return (
        <main className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard title="Donors" value={128} />
                <SummaryCard title="Volunteers" value={45} />
                <SummaryCard title="Upcoming Events" value={3} />
                <SummaryCard title="Hours Logged" value={312} />
            </div>
        </main>
    );
}
