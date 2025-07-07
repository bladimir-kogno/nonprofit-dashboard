'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, Heart, Clock, User, MapPin } from 'lucide-react';
import { NewsletterService } from '../lib/database-models';

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState({
        totalDonors: 0,
        activeVolunteers: 0,
        upcomingEvents: 0,
        totalVolunteerHours: 0,
        newsletterStats: {
            total: 0,
            sent: 0,
            draft: 0,
            scheduled: 0,
            totalOpens: 0,
            totalClicks: 0
        },
        recentDonors: [
            { id: 1, name: 'John Smith', type: 'Individual', totalGiven: 2500, lastDonation: '2024-06-15' },
            { id: 2, name: 'ABC Foundation', type: 'Foundation', totalGiven: 10000, lastDonation: '2024-07-01' },
            { id: 3, name: 'Sarah Johnson', type: 'Individual', totalGiven: 750, lastDonation: '2024-07-10' }
        ],
        upcomingEventsData: [
            { id: 1, name: 'Annual Gala', date: '2024-08-15', location: 'Grand Hotel', attendees: 150 },
            { id: 2, name: 'Community Cleanup', date: '2024-07-20', location: 'City Park', attendees: 45 },
            { id: 3, name: 'Volunteer Training', date: '2024-07-25', location: 'Main Office', attendees: 25 }
        ]
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch newsletter stats from database
                const newsletterStats = await NewsletterService.getStats();
                
                setDashboardData(prev => ({
                    ...prev,
                    newsletterStats,
                    // Mock data for other stats - replace with real database calls
                    totalDonors: 128,
                    activeVolunteers: 45,
                    upcomingEvents: 3,
                    totalVolunteerHours: 312
                }));
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Donors</p>
                            <p className="text-2xl font-bold text-blue-900">{dashboardData.totalDonors}</p>
                        </div>
                        <Heart className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Active Volunteers</p>
                            <p className="text-2xl font-bold text-green-900">{dashboardData.activeVolunteers}</p>
                        </div>
                        <Users className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Newsletters Sent</p>
                            <p className="text-2xl font-bold text-purple-900">{dashboardData.newsletterStats.sent}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 text-sm font-medium">Total Opens</p>
                            <p className="text-2xl font-bold text-orange-900">{dashboardData.newsletterStats.totalOpens}</p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Recent Donors</h3>
                    <div className="space-y-3">
                        {dashboardData.recentDonors.map(donor => (
                            <div key={donor.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium">{donor.name}</p>
                                        <p className="text-sm text-gray-600">{donor.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${donor.totalGiven.toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">{donor.lastDonation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                        {dashboardData.upcomingEventsData.map(event => (
                            <div key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium">{event.name}</p>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <MapPin className="h-3 w-3" />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{event.date}</p>
                                    <p className="text-sm text-gray-600">{event.attendees} attendees</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
