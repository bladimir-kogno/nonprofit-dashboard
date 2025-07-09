'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, Heart, Clock, User, MapPin, AlertCircle } from 'lucide-react';
import { EmailRecipientService, NewsletterService } from '../lib/database-models';

interface DashboardData {
    totalDonors: number;
    activeVolunteers: number;
    upcomingEvents: number;
    totalVolunteerHours: number;
    recentDonors: Array<{
        id: string;
        name: string;
        type: string;
        totalGiven: number;
        lastDonation: string;
    }>;
    upcomingEventsData: Array<{
        id: number;
        name: string;
        date: string;
        location: string;
        attendees: number;
    }>;
}

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        totalDonors: 0,
        activeVolunteers: 0,
        upcomingEvents: 3, // Keep static for now until events table is implemented
        totalVolunteerHours: 312, // Keep static for now until volunteer hours tracking is implemented
        recentDonors: [],
        upcomingEventsData: [
            { id: 1, name: 'Annual Gala', date: '2024-08-15', location: 'Grand Hotel', attendees: 150 },
            { id: 2, name: 'Community Cleanup', date: '2024-07-20', location: 'City Park', attendees: 45 },
            { id: 3, name: 'Volunteer Training', date: '2024-07-25', location: 'Main Office', attendees: 25 }
        ]
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [databaseError, setDatabaseError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                setDatabaseError(null);
                
                // Get real donor data from database
                const donors = await EmailRecipientService.getByType('donor');
                
                // Get real volunteer data from database  
                const volunteers = await EmailRecipientService.getByType('volunteer');
                
                // Get newsletter stats
                const newsletterStats = await NewsletterService.getStats();
                
                // Transform donor data for recent donors display
                const recentDonorsData = donors
                    .filter(donor => donor.metadata?.lastDonation)
                    .sort((a, b) => new Date(b.metadata?.lastDonation || 0).getTime() - new Date(a.metadata?.lastDonation || 0).getTime())
                    .slice(0, 3)
                    .map(donor => ({
                        id: donor.id,
                        name: donor.name,
                        type: donor.metadata?.donorType || 'Individual',
                        totalGiven: donor.metadata?.totalGiven || 0,
                        lastDonation: donor.metadata?.lastDonation || 'Never'
                    }));

                setDashboardData((prev: DashboardData) => ({
                    ...prev,
                    totalDonors: donors.length,
                    activeVolunteers: volunteers.length,
                    recentDonors: recentDonorsData
                }));
                
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                setDatabaseError('Unable to connect to database. Using placeholder data.');
                
                // Fallback to mock data if database is not configured
                setDashboardData((prev: DashboardData) => ({
                    ...prev,
                    totalDonors: 128,
                    activeVolunteers: 45,
                    recentDonors: [
                        { id: '1', name: 'John Smith', type: 'Individual', totalGiven: 2500, lastDonation: '2024-06-15' },
                        { id: '2', name: 'ABC Foundation', type: 'Foundation', totalGiven: 10000, lastDonation: '2024-07-01' },
                        { id: '3', name: 'Sarah Johnson', type: 'Individual', totalGiven: 750, lastDonation: '2024-07-10' }
                    ]
                }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Database Connection Status */}
            {databaseError && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <div>
                            <h3 className="text-amber-800 font-medium">Database Connection Issue</h3>
                            <p className="text-amber-700 text-sm">{databaseError}</p>
                            <p className="text-amber-600 text-xs mt-1">
                                Please check your Supabase configuration in .env.local
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Donors</p>
                            <p className="text-2xl font-bold text-blue-900">{dashboardData.totalDonors}</p>
                            {!databaseError && (
                                <p className="text-xs text-blue-600 mt-1">Real-time data</p>
                            )}
                        </div>
                        <Heart className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Active Volunteers</p>
                            <p className="text-2xl font-bold text-green-900">{dashboardData.activeVolunteers}</p>
                            {!databaseError && (
                                <p className="text-xs text-green-600 mt-1">Real-time data</p>
                            )}
                        </div>
                        <Users className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Upcoming Events</p>
                            <p className="text-2xl font-bold text-purple-900">{dashboardData.upcomingEvents}</p>
                            <p className="text-xs text-purple-600 mt-1">Static data</p>
                        </div>
                        <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 text-sm font-medium">Total Vol. Hours</p>
                            <p className="text-2xl font-bold text-orange-900">{dashboardData.totalVolunteerHours}</p>
                            <p className="text-xs text-orange-600 mt-1">Static data</p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                        Recent Donors
                        {!databaseError && (
                            <span className="text-sm font-normal text-green-600 ml-2">● Live data</span>
                        )}
                    </h3>
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
                            <div className="text-center py-4 text-gray-500">
                                <p>No recent donors found</p>
                                <p className="text-sm">Add donors in the Donors section</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                        Upcoming Events
                        <span className="text-sm font-normal text-amber-600 ml-2">● Static data</span>
                    </h3>
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
