// app/reports/page.tsx

'use client';

import { useState } from 'react';
import { BarChart3, Users, Heart, Calendar, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
    const handleExportDonationReport = () => {
        // Create CSV content
        const headers = ['Name', 'Type', 'Total Given', 'Date'];
        const rows = donors.map(donor => [
            donor.name,
            donor.type,
            `$${donor.totalGiven}`,
            new Date().toISOString().split('T')[0]
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.join(','))
            .join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donation-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleExportVolunteerReport = () => {
        // Create CSV content
        const headers = ['Name', 'Status', 'Total Hours', 'Date'];
        const rows = volunteers.map(volunteer => [
            volunteer.name,
            volunteer.status,
            volunteer.totalHours,
            new Date().toISOString().split('T')[0]
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.join(','))
            .join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `volunteer-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleExportEventReport = () => {
        // Create CSV content
        const headers = ['Event Name', 'Status', 'Attendees', 'Date'];
        const rows = events.map(event => [
            event.name,
            event.status,
            event.attendees,
            new Date().toISOString().split('T')[0]
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.join(','))
            .join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Mock data - replace with real API calls
    const donors = [
        { id: 1, name: 'John Smith', type: 'Individual', totalGiven: 2500 },
        { id: 2, name: 'ABC Foundation', type: 'Foundation', totalGiven: 10000 },
        { id: 3, name: 'Tech Corp', type: 'Corporate', totalGiven: 5000 }
    ];
    
    const volunteers = [
        { id: 1, name: 'Sarah Johnson', status: 'Active', totalHours: 120 },
        { id: 2, name: 'Mike Chen', status: 'Active', totalHours: 85 },
        { id: 3, name: 'Emily Davis', status: 'On Hold', totalHours: 65 }
    ];

    const events = [
        { id: 1, name: 'Annual Gala', status: 'Upcoming', attendees: 150 },
        { id: 2, name: 'Community Cleanup', status: 'Upcoming', attendees: 45 },
        { id: 3, name: 'Volunteer Training', status: 'Completed', attendees: 25 }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Reports & Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donor Summary */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="h-6 w-6 text-blue-600" />
                        <h3 className="text-lg font-semibold">Donor Summary</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Total Donors:</span>
                            <span className="font-semibold">{donors.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Individual Donors:</span>
                            <span className="font-semibold">{donors.filter(d => d.type === 'Individual').length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Foundation Donors:</span>
                            <span className="font-semibold">{donors.filter(d => d.type === 'Foundation').length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Corporate Donors:</span>
                            <span className="font-semibold">{donors.filter(d => d.type === 'Corporate').length}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-medium">Total Raised:</span>
                            <span className="font-bold text-green-600">
                                ${donors.reduce((sum, d) => sum + d.totalGiven, 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Volunteer Summary */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="h-6 w-6 text-green-600" />
                        <h3 className="text-lg font-semibold">Volunteer Summary</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Total Volunteers:</span>
                            <span className="font-semibold">{volunteers.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Active Volunteers:</span>
                            <span className="font-semibold">{volunteers.filter(v => v.status === 'Active').length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Hours Logged:</span>
                            <span className="font-semibold">{volunteers.reduce((sum, v) => sum + v.totalHours, 0)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-medium">Avg Hours per Volunteer:</span>
                            <span className="font-bold text-blue-600">
                                {Math.round(volunteers.reduce((sum, v) => sum + v.totalHours, 0) / volunteers.length)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Event Summary */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="h-6 w-6 text-purple-600" />
                        <h3 className="text-lg font-semibold">Event Summary</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Total Events:</span>
                            <span className="font-semibold">{events.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Upcoming Events:</span>
                            <span className="font-semibold">{events.filter(e => e.status === 'Upcoming').length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Completed Events:</span>
                            <span className="font-semibold">{events.filter(e => e.status === 'Completed').length}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-medium">Total Attendees:</span>
                            <span className="font-bold text-purple-600">
                                {events.reduce((sum, e) => sum + e.attendees, 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                        <h3 className="text-lg font-semibold">Performance Metrics</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Avg Donation Amount:</span>
                            <span className="font-semibold">
                                ${Math.round(donors.reduce((sum, d) => sum + d.totalGiven, 0) / donors.length).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Volunteer Retention:</span>
                            <span className="font-semibold">
                                {Math.round((volunteers.filter(v => v.status === 'Active').length / volunteers.length) * 100)}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Event Attendance Rate:</span>
                            <span className="font-semibold">89%</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-medium">Growth Rate:</span>
                            <span className="font-bold text-green-600">+12.5%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Progress */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Monthly Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="bg-blue-50 p-4 rounded-lg mb-3">
                            <p className="text-3xl font-bold text-blue-600">$17,500</p>
                            <p className="text-sm text-blue-600">This Month</p>
                        </div>
                        <p className="text-sm text-gray-600">Donations Received</p>
                        <p className="text-xs text-green-600">+8.2% from last month</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="bg-green-50 p-4 rounded-lg mb-3">
                            <p className="text-3xl font-bold text-green-600">270</p>
                            <p className="text-sm text-green-600">This Month</p>
                        </div>
                        <p className="text-sm text-gray-600">Volunteer Hours</p>
                        <p className="text-xs text-green-600">+15.3% from last month</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="bg-purple-50 p-4 rounded-lg mb-3">
                            <p className="text-3xl font-bold text-purple-600">220</p>
                            <p className="text-sm text-purple-600">This Month</p>
                        </div>
                        <p className="text-sm text-gray-600">Event Attendees</p>
                        <p className="text-xs text-green-600">+22.1% from last month</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                        onClick={handleExportDonationReport}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors"
                    >
                        <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
                        <p className="font-medium text-blue-900">Export Donation Report</p>
                        <p className="text-sm text-blue-600">Download detailed donation analytics</p>
                    </button>
                    
                    <button 
                        onClick={handleExportVolunteerReport}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg text-left hover:bg-green-100 transition-colors"
                    >
                        <Users className="h-8 w-8 text-green-600 mb-2" />
                        <p className="font-medium text-green-900">Volunteer Hours Report</p>
                        <p className="text-sm text-green-600">Generate volunteer time tracking</p>
                    </button>
                    
                    <button 
                        onClick={handleExportEventReport}
                        className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-left hover:bg-purple-100 transition-colors"
                    >
                        <Calendar className="h-8 w-8 text-purple-600 mb-2" />
                        <p className="font-medium text-purple-900">Event Analytics</p>
                        <p className="text-sm text-purple-600">View event performance metrics</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
