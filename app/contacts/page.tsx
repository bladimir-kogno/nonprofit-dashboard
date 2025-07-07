'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Search, Mail, Phone, Building, User, Download, Trash2, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';
import Modal from '../../components/shared/Modal';

interface Contact {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    dateAdded: string;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showAddContactModal, setShowAddContactModal] = useState(false);
    const [newContactData, setNewContactData] = useState({ name: '', company: '', email: '', phone: '' });

    // Load contacts from localStorage on component mount
    useEffect(() => {
        const savedContacts = localStorage.getItem('nonprofit-contacts');
        if (savedContacts) {
            const parsed = JSON.parse(savedContacts);
            setContacts(parsed);
            setFilteredContacts(parsed);
        }
    }, []);

    // Save contacts to localStorage whenever contacts change
    useEffect(() => {
        if (contacts.length > 0) {
            localStorage.setItem('nonprofit-contacts', JSON.stringify(contacts));
        }
    }, [contacts]);

    // Filter contacts based on search term
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredContacts(contacts);
        } else {
            const filtered = contacts.filter(contact =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.phone.includes(searchTerm)
            );
            setFilteredContacts(filtered);
        }
    }, [searchTerm, contacts]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus({ type: null, message: '' });

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // Skip the header row and process the data
                const processedContacts: Contact[] = [];
                const existingEmails = new Set(contacts.map(c => c.email.toLowerCase()));
                let duplicateCount = 0;

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i] as any[];
                    if (row.length >= 4) {
                        const email = String(row[2] || '').toLowerCase();
                        
                        // Skip if email already exists
                        if (existingEmails.has(email)) {
                            duplicateCount++;
                            continue;
                        }

                        const contact: Contact = {
                            id: crypto.randomUUID(),
                            name: String(row[0] || '').trim(),
                            company: String(row[1] || '').trim(),
                            email: String(row[2] || '').trim(),
                            phone: String(row[3] || '').trim(),
                            dateAdded: new Date().toISOString().split('T')[0]
                        };

                        if (contact.name && contact.email) {
                            processedContacts.push(contact);
                            existingEmails.add(email);
                        }
                    }
                }

                setContacts(prev => [...prev, ...processedContacts]);
                setUploadStatus({ 
                    type: 'success', 
                    message: `Successfully imported ${processedContacts.length} contacts${duplicateCount > 0 ? ` (${duplicateCount} duplicates skipped)` : ''}`
                });

            } catch (error) {
                setUploadStatus({ 
                    type: 'error', 
                    message: 'Error processing file. Please ensure it\'s a valid Excel file with columns: Name, Company, Email, Phone'
                });
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };

        reader.readAsBinaryString(file);
    };

    const handleExportContacts = () => {
        if (contacts.length === 0) {
            alert('No contacts to export');
            return;
        }

        const exportData = contacts.map(contact => ({
            Name: contact.name,
            Company: contact.company,
            Email: contact.email,
            Phone: contact.phone,
            'Date Added': contact.dateAdded
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
        XLSX.writeFile(workbook, `contacts-${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleDeleteContact = (id: string) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            setContacts(prev => prev.filter(contact => contact.id !== id));
        }
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to delete all contacts? This action cannot be undone.')) {
            setContacts([]);
            localStorage.removeItem('nonprofit-contacts');
        }
    };

    const handleAddContact = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check for duplicate email
        const existingContact = contacts.find(c => c.email.toLowerCase() === newContactData.email.toLowerCase());
        if (existingContact) {
            alert('A contact with this email already exists.');
            return;
        }

        const newContact: Contact = {
            id: crypto.randomUUID(),
            name: newContactData.name.trim(),
            company: newContactData.company.trim(),
            email: newContactData.email.trim(),
            phone: newContactData.phone.trim(),
            dateAdded: new Date().toISOString().split('T')[0]
        };

        setContacts(prev => [newContact, ...prev]);
        setShowAddContactModal(false);
        setNewContactData({ name: '', company: '', email: '', phone: '' });
        setUploadStatus({ type: 'success', message: `Successfully added ${newContact.name} to contacts.` });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddContactModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Contact
                    </button>
                    <button
                        onClick={handleExportContacts}
                        disabled={contacts.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="h-4 w-4" />
                        Export Excel
                    </button>
                    <button
                        onClick={handleClearAll}
                        disabled={contacts.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear All
                    </button>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Upload Excel File</h2>
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Upload an Excel file with columns: <strong>Name</strong>, <strong>Company</strong>, <strong>Email</strong>, <strong>Phone</strong>
                    </p>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Upload className="h-4 w-4" />
                            {isUploading ? 'Uploading...' : 'Choose File'}
                        </button>
                    </div>
                </div>

                {uploadStatus.message && (
                    <div className={`p-3 rounded-lg ${uploadStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {uploadStatus.message}
                    </div>
                )}
            </div>

            {/* Search and Stats */}
            <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="text-sm text-gray-600">
                    Showing {filteredContacts.length} of {contacts.length} contacts
                </div>
            </div>

            {/* Contacts Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filteredContacts.length === 0 ? (
                    <div className="p-8 text-center">
                        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                            {contacts.length === 0 ? 'No contacts yet. Upload an Excel file to get started.' : 'No contacts match your search.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredContacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-gray-400 mr-3" />
                                                <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Building className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{contact.company || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                                                    {contact.email}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{contact.phone || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {contact.dateAdded}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteContact(contact.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Usage Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Upload Excel files with columns: Name, Company, Email, Phone (in that order)</li>
                    <li>• Duplicate emails will be automatically skipped</li>
                    <li>• Use the search bar to find specific contacts</li>
                    <li>• Export your contacts to Excel format</li>
                    <li>• Click email addresses to send emails directly</li>
                </ul>
            </div>

            {/* Add Contact Modal */}
            <Modal
                isOpen={showAddContactModal}
                onClose={() => setShowAddContactModal(false)}
                title="Add New Contact"
            >
                <form onSubmit={handleAddContact} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            value={newContactData.name}
                            onChange={(e) => setNewContactData({...newContactData, name: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company/Organization
                        </label>
                        <input
                            type="text"
                            placeholder="Enter company or organization"
                            value={newContactData.company}
                            onChange={(e) => setNewContactData({...newContactData, company: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={newContactData.email}
                            onChange={(e) => setNewContactData({...newContactData, email: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            value={newContactData.phone}
                            onChange={(e) => setNewContactData({...newContactData, phone: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
                        >
                            Add Contact
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddContactModal(false)}
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