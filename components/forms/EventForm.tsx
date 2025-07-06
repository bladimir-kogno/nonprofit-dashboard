// components/forms/EventForm.tsx

'use client';

import { useState } from 'react';
import { eventSchema } from '@/lib/validators';

type EventFormProps = {
    onClose: () => void;
};

export default function EventForm({ onClose }: EventFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        status: 'upcoming',
        attendees: [],
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = eventSchema.safeParse({
            ...formData,
            attendees: [],
        });

        if (!result.success) {
            setError('Please fill all required fields correctly.');
            return;
        }

        setError(null);

        // Submit logic goes here (e.g., call API)
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-md w-full max-w-md shadow-md space-y-4"
            >
                <h2 className="text-lg font-semibold">Add Event</h2>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <div>
                    <label className="block text-sm">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
