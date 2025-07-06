// app/donors/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Mail, Phone, Heart } from 'lucide-react';
import Modal from '../../components/shared/Modal';

interface Donor {
    id: number;
    name: string;
    email: string;
    phone: string;
    type: 'Individual' | 'Foundation' | 'Corporate';
    totalGiven: number;
    lastDonation: string;
}

export default function DonorsPage() {
    const [donors, setDonors] = useState<Donor[]>([
        { id: 1, name: 'John Smith', email: 'john@email.com', phone: '555-0123', totalGiven: 2500, lastDonation: '2024-06-15', type: 'Individual' },
        { id: 2, name: 'ABC Foundation', email: 'grants@abc.org', phone: '555-0456', totalGiven: 10000, lastDonation: '2024-07-01', type: 'Foundation' },
        { id: 3, name: 'Tech Corp', email: 'giving@techcorp.com', phone: '555-0789', totalGiven: 5000, lastDonation: '2024-06-20', type: 'Corporate' }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        phone: string;
        type: 'Individual' | 'Foundation' | 'Corporate';
    }>({
        name: '',
        email: '',
        phone: '',
        type: 'Individual'
    });

    const openModal = (donor: Donor | null = null) => {
        setEditingDonor(donor);
        if (donor) {
            setFormData({
                name: donor.name,
                email: donor.email,
                phone: donor.phone,
                type: donor.type
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                type: 'Individual'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingDonor(null);
        setFormData({ name: '', email: '', phone: '', type: 'Individual' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingDonor) {
            setDonors(donors.map(d => 
                d.id === editingDonor.id 
                    ? { ...d, ...formData }
                    : d
            ));
        } else {
            const newDonor: Donor = {
                ...formData,
                id: Date.now(),
                totalGiven: 0,
                lastDonation: 'Never'
            };
            setDonors([...donors, newDonor]);
        }
        
        closeModal();
    };

    const deleteDonor = (id: number) => {
        if (confirm('Are you sure you want to delete this donor?')) {
            setDonors(donors.filter(d => d.id !== id));
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Individual':
                return 'bg-blue-100 text-blue-800';
            case 'Foundation':
                return 'bg-green-100 text-green-800';
            case 'Corporate':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Donor Management</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Donor
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Given</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Donation</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {donors.map(donor => (
                            <tr key={donor.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <User className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="font-medium">{donor.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(donor.type)}`}>
                                        {donor.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {donor.email}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {donor.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">
                                    ${donor.totalGiven.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {donor.lastDonation}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => openModal(donor)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => deleteDonor(donor.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingDonor ? 'Edit Donor' : 'Add New Donor'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as 'Individual' | 'Foundation' | 'Corporate'})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="Individual">Individual</option>
                        <option value="Foundation">Foundation</option>
                        <option value="Corporate">Corporate</option>
                    </select>
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
                        >
                            {editingDonor ? 'Update' : 'Add'}
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
