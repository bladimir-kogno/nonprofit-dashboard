'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, Heart, Clock, User, MapPin } from 'lucide-react';

export default function DashboardPage() {
    // Mock data - replace with real API calls
    const [dashboardData, setDashboardData] = useState({
        totalDonors: 128,
        activeVolunteers: 45,
        upcomingEvents: 3,
        totalVolunteerHours: 312,
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
