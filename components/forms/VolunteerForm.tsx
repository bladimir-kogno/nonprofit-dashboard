// components/forms/VolunteerForm.tsx

'use client';

import { useState } from 'react';
import { volunteerSchema } from '@lib/validators';

type VolunteerFormProps = {
    onClose: () => void;
};

export default function VolunteerForm({ onClose }: VolunteerFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        skills: '',
        hoursLogged: 0,
        active: true,
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'hoursLogged') {
            setFormData(prev => ({ ...prev, [name]: Number(value) }));
        } else if (name === 'active') {
            setFormData(prev => ({ ...prev, active: value === 'true' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const preparedData = {
            ...formData,
            skills: formData.skills
                .split(',')
                .map(skill => skill.trim())
                .filter(Boolean),
        };

        const result = volunteerSchema.safeParse(preparedData);
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
                <h2 className="text-lg font-semibold">Add Volunteer</h2>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <div>
                    <label className="block text-sm">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm">Skills (comma separated)</label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm">Hours Logged</label>
                    <input
                        type="number"
                        name="hoursLogged"
                        value={formData.hoursLogged}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        min="0"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Status</label>
                    <select
                        name="active"
                        value={String(formData.active)}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
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
