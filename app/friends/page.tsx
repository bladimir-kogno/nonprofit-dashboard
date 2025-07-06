'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, User, Mail, Phone, Send, Eye } from 'lucide-react';
import Modal from '../../components/shared/Modal';
import HTMLEditor from '../../components/shared/HTMLEditor';

interface Friend {
    id: number;
    name: string;
    email: string;
    phone: string;
    category: 'Community' | 'Business' | 'Media' | 'Government' | 'Partner';
    interests: string[];
    notes: string;
    joined: string;
}

export default function FriendsPage() {
    const [friends, setFriends] = useState<Friend[]>([
        { 
            id: 1, 
            name: 'Sarah Johnson', 
            email: 'sarah@email.com', 
            phone: '555-0123', 
            category: 'Community',
            interests: ['Newsletter', 'Events', 'Volunteering'],
            notes: 'Local community leader, very engaged',
            joined: '2024-01-15'
        },
        { 
            id: 2, 
            name: 'Mike Chen', 
            email: 'mike@email.com', 
            phone: '555-0456', 
            category: 'Business',
            interests: ['Newsletter', 'Partnerships'],
            notes: 'Owns local restaurant, potential sponsor',
            joined: '2024-02-20'
        },
        { 
            id: 3, 
            name: 'Lisa Rodriguez', 
            email: 'lisa@localnews.com', 
            phone: '555-0789', 
            category: 'Media',
            interests: ['Newsletter', 'Press Releases'],
            notes: 'Journalist for local newspaper',
            joined: '2024-03-10'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showSampleModal, setShowSampleModal] = useState(false);
    const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        phone: string;
        category: 'Community' | 'Business' | 'Media' | 'Government' | 'Partner';
        interests: string[];
        notes: string;
    }>({
        name: '',
        email: '',
        phone: '',
        category: 'Community',
        interests: [],
        notes: ''
    });

    const [emailData, setEmailData] = useState({
        subject: '',
        htmlContent: '',
        recipients: [] as number[]
    });

    const [sampleEmailData, setSampleEmailData] = useState({
        testEmail: '',
        subject: '',
        htmlContent: ''
    });

    const [sending, setSending] = useState(false);

    const availableInterests = ['Newsletter', 'Events', 'Volunteering', 'Donations', 'Partnerships', 'Press Releases'];

    const openModal = (friend: Friend | null = null) => {
        setEditingFriend(friend);
        if (friend) {
            setFormData({
                name: friend.name,
                email: friend.email,
                phone: friend.phone,
                category: friend.category,
                interests: friend.interests,
                notes: friend.notes
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                category: 'Community',
                interests: [],
                notes: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingFriend(null);
        setFormData({ name: '', email: '', phone: '', category: 'Community', interests: [], notes: '' });
    };

    const openEmailModal = () => {
        setEmailData({
            subject: '',
            htmlContent: '',
            recipients: []
        });
        setShowEmailModal(true);
    };

    const openSampleModal = () => {
        setSampleEmailData({
            testEmail: '',
            subject: 'Sample Email Test',
            htmlContent: '<h2>This is a sample email</h2><p>This email is being sent to test how it will look for recipients.</p>'
        });
        setShowSampleModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingFriend) {
            setFriends(friends.map(f => 
                f.id === editingFriend.id 
                    ? { ...f, ...formData }
                    : f
            ));
        } else {
            const newFriend: Friend = {
                ...formData,
                id: Date.now(),
                joined: new Date().toISOString().split('T')[0]
            };
            setFriends([...friends, newFriend]);
        }
        
        closeModal();
    };

    const deleteFriend = (id: number) => {
        if (confirm('Are you sure you want to remove this friend?')) {
            setFriends(friends.filter(f => f.id !== id));
        }
    };

    const toggleInterest = (interest: string) => {
        setFormData({
            ...formData,
            interests: formData.interests.includes(interest)
                ? formData.interests.filter(i => i !== interest)
                : [...formData.interests, interest]
        });
    };

    const toggleRecipient = (friendId: number) => {
        setEmailData({
            ...emailData,
            recipients: emailData.recipients.includes(friendId)
                ? emailData.recipients.filter(id => id !== friendId)
                : [...emailData.recipients, friendId]
        });
    };

    const sendEmailToFriends = async () => {
        if (emailData.recipients.length === 0) {
            alert('Please select at least one recipient.');
            return;
        }

        setSending(true);
        
        try {
            const recipientEmails = friends
                .filter(f => emailData.recipients.includes(f.id))
                .map(f => f.email);

            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: recipientEmails,
                    subject: emailData.subject,
                    htmlContent: emailData.htmlContent,
                    type: 'friends_email'
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                alert(`✅ Email sent successfully to ${recipientEmails.length} friends!\n\n${result.preview ? `Preview: ${result.preview}` : ''}`);
                setShowEmailModal(false);
                setEmailData({ subject: '', htmlContent: '', recipients: [] });
            } else {
                alert(`❌ Failed to send email: ${result.error}`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('❌ Failed to send email due to network error.');
        } finally {
            setSending(false);
        }
    };

    const sendSampleEmail = async () => {
        if (!sampleEmailData.testEmail) {
            alert('Please enter a test email address.');
            return;
        }

        setSending(true);
        
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: sampleEmailData.testEmail,
                    subject: `[TEST] ${sampleEmailData.subject}`,
                    htmlContent: sampleEmailData.htmlContent,
                    type: 'sample_test'
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                alert(`✅ Sample email sent successfully to ${sampleEmailData.testEmail}!\n\n${result.preview ? `Preview: ${result.preview}` : ''}`);
                setShowSampleModal(false);
            } else {
                alert(`❌ Failed to send sample email: ${result.error}`);
            }
        } catch (error) {
            console.error('Error sending sample email:', error);
            alert('❌ Failed to send sample email due to network error.');
        } finally {
            setSending(false);
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Community': return 'bg-blue-100 text-blue-800';
            case 'Business': return 'bg-green-100 text-green-800';
            case 'Media': return 'bg-purple-100 text-purple-800';
            case 'Government': return 'bg-red-100 text-red-800';
            case 'Partner': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-xl font-semibold">Friends & Supporters</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={openSampleModal}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
                    >
                        <Eye className="h-4 w-4" />
                        Send Sample Email
                    </button>
                    <button
                        onClick={openEmailModal}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                    >
                        <Send className="h-4 w-4" />
                        Send Email to Friends
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Friend
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Friends</p>
                            <p className="text-2xl font-bold text-blue-900">{friends.length}</p>
                        </div>
                        <User className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Newsletter Subscribers</p>
                            <p className="text-2xl font-bold text-green-900">
                                {friends.filter(f => f.interests.includes('Newsletter')).length}
                            </p>
                        </div>
                        <Mail className="h-6 w-6 text-green-600" />
                    </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Business Contacts</p>
                            <p className="text-2xl font-bold text-purple-900">
                                {friends.filter(f => f.category === 'Business').length}
                            </p>
                        </div>
                        <User className="h-6 w-6 text-purple-600" />
                    </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 text-sm font-medium">Event Interested</p>
                            <p className="text-2xl font-bold text-orange-900">
                                {friends.filter(f => f.interests.includes('Events')).length}
                            </p>
                        </div>
                        <User className="h-6 w-6 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Friends Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interests</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {friends.map(friend => (
                                <tr key={friend.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <User className="h-5 w-5 text-gray-400 mr-2" />
                                            <div>
                                                <span className="font-medium">{friend.name}</span>
                                                {friend.notes && (
                                                    <p className="text-xs text-gray-500 mt-1">{friend.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(friend.category)}`}>
                                            {friend.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                <span className="truncate max-w-[150px]">{friend.email}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {friend.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {friend.interests.map(interest => (
                                                <span key={interest} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {friend.joined}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => openModal(friend)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Edit Friend"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => deleteFriend(friend.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Remove Friend"
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

            {/* Add/Edit Friend Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingFriend ? 'Edit Friend' : 'Add New Friend'}
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
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as Friend['category']})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="Community">Community</option>
                        <option value="Business">Business</option>
                        <option value="Media">Media</option>
                        <option value="Government">Government</option>
                        <option value="Partner">Partner</option>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                        <div className="flex flex-wrap gap-2">
                            {availableInterests.map(interest => (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                        formData.interests.includes(interest)
                                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                    }`}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <textarea
                        placeholder="Notes (optional)"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
                        >
                            {editingFriend ? 'Update' : 'Add'}
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

            {/* Send Email Modal */}
            <Modal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                title="Send Email to Friends"
            >
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Email Subject"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Recipients</label>
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                            {friends.map(friend => (
                                <label key={friend.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={emailData.recipients.includes(friend.id)}
                                        onChange={() => toggleRecipient(friend.id)}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm">{friend.name} ({friend.email})</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {emailData.recipients.length} recipients selected
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
                        <HTMLEditor
                            content={emailData.htmlContent}
                            onChange={(html) => setEmailData({...emailData, htmlContent: html})}
                            placeholder="Write your email content here..."
                        />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={sendEmailToFriends}
                            disabled={sending || emailData.recipients.length === 0}
                            className="flex-1 py-2 px-4 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? 'Sending...' : `Send to ${emailData.recipients.length} Friends`}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowEmailModal(false)}
                            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Send Sample Email Modal */}
            <Modal
                isOpen={showSampleModal}
                onClose={() => setShowSampleModal(false)}
                title="Send Sample Email"
            >
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Test Email Address"
                        value={sampleEmailData.testEmail}
                        onChange={(e) => setSampleEmailData({...sampleEmailData, testEmail: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Email Subject"
                        value={sampleEmailData.subject}
                        onChange={(e) => setSampleEmailData({...sampleEmailData, subject: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sample Email Content</label>
                        <HTMLEditor
                            content={sampleEmailData.htmlContent}
                            onChange={(html) => setSampleEmailData({...sampleEmailData, htmlContent: html})}
                            placeholder="Create your sample email content here..."
                        />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={sendSampleEmail}
                            disabled={sending || !sampleEmailData.testEmail}
                            className="flex-1 py-2 px-4 rounded-lg text-white font-medium bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? 'Sending...' : 'Send Sample Email'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowSampleModal(false)}
                            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}