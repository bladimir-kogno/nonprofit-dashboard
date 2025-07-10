// app/reports/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Heart, Users, Calendar, TrendingUp, BarChart3, Download, FileText } from 'lucide-react';

export default function ReportsPage() {
    const [donors, setDonors] = useState<any[]>([]);
    const [volunteers, setVolunteers] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [donorsRes, volunteersRes, eventsRes] = await Promise.all([
                    fetch('/api/donors'),
                    fetch('/api/volunteers'),
                    fetch('/api/events')
                ]);

                if (!donorsRes.ok || !volunteersRes.ok || !eventsRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const donorsData = await donorsRes.json();
                const volunteersData = await volunteersRes.json();
                const eventsData = await eventsRes.json();

                setDonors(donorsData);
                setVolunteers(volunteersData);
                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleExportDonationReport = () => {
        if (donors.length === 0) {
            alert('No donor data to export');
            return;
        }

        const csvContent = [
            ['Name', 'Email', 'Phone', 'Total Donated', 'Last Donation'],
            ...donors.map(donor => [
                donor.name,
                donor.email,
                donor.phone,
                donor.totalDonated,
                donor.created_at ? new Date(donor.created_at).toLocaleDateString() : 'N/A'
            ])
        ].map(row => row.join(',')).join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donor-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleExportVolunteerReport = () => {
        if (volunteers.length === 0) {
            alert('No volunteer data to export');
            return;
        }

        const csvContent = [
            ['Name', 'Email', 'Phone', 'Skills', 'Hours Logged', 'Status'],
            ...volunteers.map(volunteer => [
                volunteer.name,
                volunteer.email,
                volunteer.phone,
                Array.isArray(volunteer.skills) ? volunteer.skills.join(', ') : volunteer.skills,
                volunteer.hoursLogged,
                volunteer.active ? 'Active' : 'Inactive'
            ])
        ].map(row => row.join(',')).join('\n');
        
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
        if (events.length === 0) {
            alert('No event data to export');
            return;
        }

        const csvContent = [
            ['Title', 'Date', 'Location', 'Status', 'Description'],
            ...events.map(event => [
                event.title,
                event.date,
                event.location,
                event.status,
                event.description
            ])
        ].map(row => row.join(',')).join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Reports & Analytics</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="flex justify-between">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Reports & Analytics</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 text-red-600 underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

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
                            <span>Total Raised:</span>
                            <span className="font-bold text-green-600">
                                ${donors.reduce((sum: number, d: any) => sum + (d.totalDonated || 0), 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-medium">Avg Donation:</span>
                            <span className="font-bold text-blue-600">
                                ${donors.length > 0 ? Math.round(donors.reduce((sum: number, d: any) => sum + (d.totalDonated || 0), 0) / donors.length).toLocaleString() : 0}
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
                            <span className="font-semibold">{volunteers.filter((v: any) => v.active).length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Hours Logged:</span>
                            <span className="font-semibold">{volunteers.reduce((sum: number, v: any) => sum + (v.hoursLogged || 0), 0)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-medium">Avg Hours per Volunteer:</span>
                            <span className="font-bold text-blue-600">
                                {volunteers.length > 0 ? Math.round(volunteers.reduce((sum: number, v: any) => sum + (v.hoursLogged || 0), 0) / volunteers.length) : 0}
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
                            <span className="font-semibold">{events.filter((e: any) => e.status === 'upcoming').length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Completed Events:</span>
                            <span className="font-semibold">{events.filter((e: any) => e.status === 'completed').length}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-medium">Cancelled Events:</span>
                            <span className="font-bold text-red-600">
                                {events.filter((e: any) => e.status === 'cancelled').length}
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
                                ${donors.length > 0 ? Math.round(donors.reduce((sum: number, d: any) => sum + (d.totalDonated || 0), 0) / donors.length).toLocaleString() : 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Volunteer Retention:</span>
                            <span className="font-semibold">
                                {volunteers.length > 0 ? Math.round((volunteers.filter((v: any) => v.active).length / volunteers.length) * 100) : 0}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Event Completion Rate:</span>
                            <span className="font-semibold">
                                {events.length > 0 ? Math.round((events.filter((e: any) => e.status === 'completed').length / events.length) * 100) : 0}%
                            </span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-medium">Total Revenue:</span>
                            <span className="font-bold text-green-600">
                                ${donors.reduce((sum: number, d: any) => sum + (d.totalDonated || 0), 0).toLocaleString()}
                            </span>
                        </div>
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
                        <p className="font-medium text-green-900">Export Volunteer Report</p>
                        <p className="text-sm text-green-600">Download volunteer activity data</p>
                    </button>
                    
                    <button 
                        onClick={handleExportEventReport}
                        className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-left hover:bg-purple-100 transition-colors"
                    >
                        <Calendar className="h-8 w-8 text-purple-600 mb-2" />
                        <p className="font-medium text-purple-900">Export Event Report</p>
                        <p className="text-sm text-purple-600">Download event attendance data</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
