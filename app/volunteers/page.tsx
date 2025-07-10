'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Mail, Phone, Users } from 'lucide-react';
import VolunteerForm from '../../components/forms/VolunteerForm';

interface Volunteer {
    id: string;
    name: string;
    email: string;
    phone: string;
    skills: string[];
    hoursLogged: number;
    active: boolean;
    created_at: string;
}

export default function VolunteersPage() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Load volunteers from API
    useEffect(() => {
        const loadVolunteers = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('/api/volunteers');
                if (!response.ok) {
                    throw new Error('Failed to load volunteers');
                }
                
                const data = await response.json();
                setVolunteers(data);
            } catch (error) {
                console.error('Error loading volunteers:', error);
                setError('Failed to load volunteers');
            } finally {
                setLoading(false);
            }
        };

        loadVolunteers();
    }, []);

    const handleVolunteerAdded = () => {
        // Reload volunteers after adding a new one
        const loadVolunteers = async () => {
            try {
                const response = await fetch('/api/volunteers');
                if (response.ok) {
                    const data = await response.json();
                    setVolunteers(data);
                }
            } catch (error) {
                console.error('Error reloading volunteers:', error);
            }
        };
        loadVolunteers();
    };

    const deleteVolunteer = async (id: string) => {
        if (confirm('Are you sure you want to delete this volunteer?')) {
            try {
                const response = await fetch(`/api/volunteers/${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    setVolunteers(volunteers.filter(v => v.id !== id));
                } else {
                    alert('Failed to delete volunteer');
                }
            } catch (error) {
                console.error('Error deleting volunteer:', error);
                alert('Failed to delete volunteer');
            }
        }
    };

    const getStatusColor = (active: boolean) => {
        return active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Volunteer Management</h2>
                    <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Volunteer Management</h2>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Volunteer
                    </button>
                </div>
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
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Volunteer Management</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Volunteer
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Logged</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {volunteers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-lg font-medium">No volunteers yet</p>
                                        <p className="text-sm">Add your first volunteer to get started</p>
                                    </td>
                                </tr>
                            ) : (
                                volunteers.map(volunteer => (
                                    <tr key={volunteer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-gray-400 mr-2" />
                                                <span className="font-medium">{volunteer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {volunteer.email}
                                                </div>
                                                {volunteer.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {volunteer.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {Array.isArray(volunteer.skills) ? volunteer.skills.join(', ') : volunteer.skills}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                                            {volunteer.hoursLogged || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(volunteer.active)}`}>
                                                {volunteer.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => deleteVolunteer(volunteer.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete volunteer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddForm && (
                <VolunteerForm 
                    onClose={() => setShowAddForm(false)}
                    onSuccess={handleVolunteerAdded}
                />
            )}
        </div>
    );
}
