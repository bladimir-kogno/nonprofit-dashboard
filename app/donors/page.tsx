// app/donors/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Mail, Phone, Heart } from 'lucide-react';
import DonorForm from '../../components/forms/DonorForm';

interface Donor {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalDonated: number;
    created_at: string;
}

export default function DonorsPage() {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Load donors from API
    useEffect(() => {
        const loadDonors = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('/api/donors');
                if (!response.ok) {
                    throw new Error('Failed to load donors');
                }
                
                const data = await response.json();
                setDonors(data);
            } catch (error) {
                console.error('Error loading donors:', error);
                setError('Failed to load donors');
            } finally {
                setLoading(false);
            }
        };

        loadDonors();
    }, []);

    const handleDonorAdded = () => {
        // Reload donors after adding a new one
        const loadDonors = async () => {
            try {
                const response = await fetch('/api/donors');
                if (response.ok) {
                    const data = await response.json();
                    setDonors(data);
                }
            } catch (error) {
                console.error('Error reloading donors:', error);
            }
        };
        loadDonors();
    };

    const deleteDonor = async (id: string) => {
        if (confirm('Are you sure you want to delete this donor?')) {
            try {
                const response = await fetch(`/api/donors/${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    setDonors(donors.filter(d => d.id !== id));
                } else {
                    alert('Failed to delete donor');
                }
            } catch (error) {
                console.error('Error deleting donor:', error);
                alert('Failed to delete donor');
            }
        }
    };

    const getTypeColor = (amount: number) => {
        if (amount >= 10000) return 'bg-purple-100 text-purple-800';
        if (amount >= 5000) return 'bg-green-100 text-green-800';
        if (amount >= 1000) return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Donor Management</h2>
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
                    <h2 className="text-xl font-semibold">Donor Management</h2>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Donor
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
                <h2 className="text-xl font-semibold">Donor Management</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Donor
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Donated</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-lg font-medium">No donors yet</p>
                                        <p className="text-sm">Add your first donor to get started</p>
                                    </td>
                                </tr>
                            ) : (
                                donors.map(donor => (
                                    <tr key={donor.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-gray-400 mr-2" />
                                                <span className="font-medium">{donor.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {donor.email}
                                                </div>
                                                {donor.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {donor.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(donor.totalDonated)}`}>
                                                ${donor.totalDonated.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {donor.created_at ? new Date(donor.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => deleteDonor(donor.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete donor"
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
                <DonorForm 
                    onClose={() => setShowAddForm(false)}
                    onSuccess={handleDonorAdded}
                />
            )}
        </div>
    );
}
