// components/reports/DonationReport.tsx

'use client';

import { useEffect, useState } from 'react';
import { DonationSummary } from '@/types/report';
import { formatCurrency } from '@/lib/helpers';

export default function DonationReport() {
    const [data, setData] = useState<DonationSummary[]>([]);

    useEffect(() => {
        // Placeholder data — replace with real aggregation logic or API call
        setData([
            { month: 'January 2025', totalAmount: 2400 },
            { month: 'February 2025', totalAmount: 1800 },
            { month: 'March 2025', totalAmount: 1950 },
        ]);
    }, []);

    return (
        <div className="bg-white border rounded-md p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Monthly Donation Summary</h2>
            <table className="min-w-full table-auto text-sm text-gray-800">
                <thead className="bg-gray-100 text-left font-semibold text-gray-700">
                <tr>
                    <th className="px-4 py-2">Month</th>
                    <th className="px-4 py-2">Total Donations</th>
                </tr>
                </thead>
                <tbody>
                {data.map((entry, index) => (
                    <tr key={index} className="border-t">
                        <td className="px-4 py-2">{entry.month}</td>
                        <td className="px-4 py-2">{formatCurrency(entry.totalAmount)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
