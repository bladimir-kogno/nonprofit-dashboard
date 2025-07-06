'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, User, Mail, Phone, Users } from 'lucide-react';
import Modal from '../../components/shared/Modal';

interface Volunteer {
    id: number;
    name: string;
    email: string;
    phone: string;
    skills: string;
    totalHours: number;
    status: 'Active' | 'Inactive' | 'On Hold';
}

export default function VolunteersPage() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([
        { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '555-0789', skills: 'Event Planning', totalHours: 120, status: 'Active' },
        { id: 2, name: 'Mike Chen', email: 'mike@email.com', phone: '555-0321', skills: 'Marketing, Design', totalHours: 85, status: 'Active' },
        { id: 3, name: 'Emily Davis', email: 'emily@email.com', phone: '555-0654', skills: 'Administration', totalHours: 65, status: 'On Hold' }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        phone: string;
        skills: string;
        status: 'Active' | 'Inactive' | 'On Hold';
    }>({
        name: '',
        email: '',
        phone: '',
        skills: '',
        status: 'Active'
    });

    const openModal = (volunteer: Volunteer | null = null) => {
        setEditingVolunteer(volunteer);
        if (volunteer) {
            setFormData({
                name: volunteer.name,
                email: volunteer.email,
                phone: volunteer.phone,
                skills: volunteer.skills,
                status: volunteer.status
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                skills: '',
                status: 'Active'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingVolunteer(null);
        setFormData({ name: '', email: '', phone: '', skills: '', status: 'Active' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingVolunteer) {
            setVolunteers(volunteers.map(v => 
                v.id === editingVolunteer.id 
                    ? { ...v, ...formData }
                    : v
            ));
        } else {
            const newVolunteer: Volunteer = {
                ...formData,
                id: Date.now(),
                totalHours: 0
            };
            setVolunteers([...volunteers, newVolunteer]);
        }
        
        closeModal();
    };

    const deleteVolunteer = (id: number) => {
        if (confirm('Are you sure you want to delete this volunteer?')) {
            setVolunteers(volunteers.filter(v => v.id !== id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Inactive':
                return 'bg-gray-100 text-gray-800';
            case 'On Hold':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Volunteer Management</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Volunteer
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {volunteers.map(volunteer => (
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
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {volunteer.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {volunteer.skills}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">
                                    {volunteer.totalHours}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(volunteer.status)}`}>
                                        {volunteer.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => openModal(volunteer)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => deleteVolunteer(volunteer.id)}
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
            </div>

            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingVolunteer ? 'Edit Volunteer' : 'Add New Volunteer'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                    />
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                    />
                    
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    
                    <input
                        type="text"
                        placeholder="Skills/Interests"
                        value={formData.skills}
                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive' | 'On Hold'})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700"
                        >
                            {editingVolunteer ? 'Update' : 'Add'}
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
