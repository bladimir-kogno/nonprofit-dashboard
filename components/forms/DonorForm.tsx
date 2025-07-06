// components/forms/DonorForm.tsx

'use client';

import { useState } from 'react';
import { donorSchema } from '@/lib/validators';
import { z } from 'zod';

type DonorFormProps = {
    onClose: () => void;
};

export default function DonorForm({ onClose }: DonorFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        totalDonated: 0,
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'totalDonated' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = donorSchema.safeParse(formData);
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
                <h2 className="text-lg font-semibold">Add Donor</h2>

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
                    <label className="block text-sm">Total Donated</label>
                    <input
                        type="number"
                        name="totalDonated"
                        value={formData.totalDonated}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        min="0"
                        required
                    />
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
