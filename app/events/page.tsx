// app/events/page.tsx

'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin } from 'lucide-react';
import Modal from '../../components/shared/Modal';

interface Event {
    id: number;
    name: string;
    date: string;
    location: string;
    attendees: number;
    status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([
        { id: 1, name: 'Annual Gala', date: '2024-08-15', location: 'Grand Hotel', attendees: 150, status: 'Upcoming' },
        { id: 2, name: 'Community Cleanup', date: '2024-07-20', location: 'City Park', attendees: 45, status: 'Upcoming' },
        { id: 3, name: 'Volunteer Training', date: '2024-06-10', location: 'Main Office', attendees: 25, status: 'Completed' }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        date: string;
        location: string;
        status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
    }>({
        name: '',
        date: '',
        location: '',
        status: 'Upcoming'
    });

    const openModal = (event: Event | null = null) => {
        setEditingEvent(event);
        if (event) {
            setFormData({
                name: event.name,
                date: event.date,
                location: event.location,
                status: event.status
            });
        } else {
            setFormData({
                name: '',
                date: '',
                location: '',
                status: 'Upcoming'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setFormData({ name: '', date: '', location: '', status: 'Upcoming' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingEvent) {
            setEvents(events.map(ev => 
                ev.id === editingEvent.id 
                    ? { ...ev, ...formData }
                    : ev
            ));
        } else {
            const newEvent: Event = {
                ...formData,
                id: Date.now(),
                attendees: 0
            };
            setEvents([...events, newEvent]);
        }
        
        closeModal();
    };

    const deleteEvent = (id: number) => {
        if (confirm('Are you sure you want to delete this event?')) {
            setEvents(events.filter(e => e.id !== id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Event Management</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Event
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.map(event => (
                            <tr key={event.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="font-medium">{event.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {event.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {event.location}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">
                                    {event.attendees}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => openModal(event)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => deleteEvent(event.id)}
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
                title={editingEvent ? 'Edit Event' : 'Add New Event'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                    />
                    
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                    />
                    
                    <input
                        type="text"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                    />
                    
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled'})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="Upcoming">Upcoming</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 rounded-lg text-white font-medium bg-purple-600 hover:bg-purple-700"
                        >
                            {editingEvent ? 'Update' : 'Add'}
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
