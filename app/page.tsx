'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, Heart, Clock, User, MapPin } from 'lucide-react';

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState({
        totalDonors: 0,
        activeVolunteers: 0,
        upcomingEvents: 0,
        totalVolunteerHours: 0,
        recentDonors: [],
        upcomingEventsData: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [donorsRes, volunteersRes, eventsRes] = await Promise.all([
                    fetch('/api/donors'),
                    fetch('/api/volunteers'),
                    fetch('/api/events')
                ]);

                if (!donorsRes.ok || !volunteersRes.ok || !eventsRes.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                
                const donors = await donorsRes.json();
                const volunteers = await volunteersRes.json();
                const events = await eventsRes.json();
                
                setDashboardData({
                    totalDonors: donors.length,
                    activeVolunteers: volunteers.filter((v: any) => v.active).length,
                    upcomingEvents: events.filter((e: any) => e.status === 'upcoming').length,
                    totalVolunteerHours: volunteers.reduce((sum: number, v: any) => sum + (v.hoursLogged || 0), 0),
                    recentDonors: donors.slice(-3).map((donor: any) => ({
                        id: donor.id,
                        name: donor.name,
                        type: 'Individual', // You might want to add a type field to your donor schema
                        totalGiven: donor.totalDonated || 0,
                        lastDonation: donor.created_at ? new Date(donor.created_at).toISOString().split('T')[0] : 'N/A'
                    })),
                    upcomingEventsData: events
                        .filter((e: any) => e.status === 'upcoming')
                        .slice(-3)
                        .map((event: any) => ({
                            id: event.id,
                            name: event.title,
                            date: event.date,
                            location: event.location,
                            attendees: event.attendees?.length || 0
                        }))
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-pulse">
                            <div className="h-8 bg-gray-200 rounded mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
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
                            <p className="text-purple-600 text-sm font-medium">Upcoming Events</p>
                            <p className="text-2xl font-bold text-purple-900">{dashboardData.upcomingEvents}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 text-sm font-medium">Total Vol. Hours</p>
                            <p className="text-2xl font-bold text-orange-900">{dashboardData.totalVolunteerHours}</p>
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
                        {dashboardData.recentDonors.length > 0 ? (
                            dashboardData.recentDonors.map(donor => (
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
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No donors yet</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                        {dashboardData.upcomingEventsData.length > 0 ? (
                            dashboardData.upcomingEventsData.map(event => (
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
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No upcoming events</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
