'use client';

import { useState } from 'react';

export default function TestFormPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        totalDonated: 0,
    });
    const [result, setResult] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Test form submitted:', formData);
        
        try {
            const response = await fetch('/api/donors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            console.log('Response:', data);
            setResult(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error:', error);
            setResult('Error: ' + error);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-4">Test Form</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm">Phone</label>
                    <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                
                <div>
                    <label className="block text-sm">Total Donated</label>
                    <input
                        type="number"
                        value={formData.totalDonated}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalDonated: Number(e.target.value) }))}
                        className="w-full border rounded px-3 py-2"
                        min="0"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Submit Test
                </button>
            </form>
            
            {result && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Result:</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {result}
                    </pre>
                </div>
            )}
        </div>
    );
}