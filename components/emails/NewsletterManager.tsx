'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Send, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { NewsletterService, Newsletter } from '../../lib/database-models';
import Modal from '../shared/Modal';
import HTMLEditor from '../shared/HTMLEditor';

export default function NewsletterManager() {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedNewsletter, setExpandedNewsletter] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        content: '',
        html_content: '',
        status: 'draft' as Newsletter['status']
    });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchNewsletters();
    }, []);

    const fetchNewsletters = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await NewsletterService.getAll();
            setNewsletters(data);
        } catch (err) {
            console.error('Error fetching newsletters:', err);
            setError('Failed to load newsletters');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (newsletter: Newsletter | null = null) => {
        setEditingNewsletter(newsletter);
        if (newsletter) {
            setFormData({
                title: newsletter.title,
                subject: newsletter.subject,
                content: newsletter.content,
                html_content: newsletter.html_content,
                status: newsletter.status
            });
        } else {
            setFormData({
                title: '',
                subject: '',
                content: '',
                html_content: '',
                status: 'draft'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingNewsletter(null);
        setFormData({
            title: '',
            subject: '',
            content: '',
            html_content: '',
            status: 'draft'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newsletterData = {
                ...formData,
                recipients_count: 0,
                opened_count: 0,
                clicked_count: 0,
                created_by: 'user' // Replace with actual user ID from auth
            };

            if (editingNewsletter) {
                await NewsletterService.update(editingNewsletter.id, newsletterData);
            } else {
                await NewsletterService.create(newsletterData);
            }

            await fetchNewsletters();
            closeModal();
        } catch (err) {
            console.error('Error saving newsletter:', err);
            setError('Failed to save newsletter');
        }
    };

    const deleteNewsletter = async (id: string) => {
        if (confirm('Are you sure you want to delete this newsletter?')) {
            try {
                await NewsletterService.delete(id);
                await fetchNewsletters();
            } catch (err) {
                console.error('Error deleting newsletter:', err);
                setError('Failed to delete newsletter');
            }
        }
    };

    const sendNewsletter = async (id: string) => {
        try {
            setSending(true);
            // Implementation for sending newsletter
            await NewsletterService.update(id, { status: 'sent' });
            await fetchNewsletters();
        } catch (err) {
            console.error('Error sending newsletter:', err);
            setError('Failed to send newsletter');
        } finally {
            setSending(false);
        }
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold">Newsletter Management</h3>
                <button 
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Create Newsletter
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}
            
            <div className="space-y-4">
                {newsletters.map(newsletter => (
                    <div key={newsletter.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-4">
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-lg text-gray-900 mb-2">{newsletter.title}</h4>
                                    <p className="text-gray-600 mb-2 font-medium">{newsletter.subject}</p>
                                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                                        {expandedNewsletter === newsletter.id 
                                            ? newsletter.content 
                                            : truncateText(newsletter.content, 150)
                                        }
                                    </p>
                                    {newsletter.content.length > 150 && (
                                        <button
                                            onClick={() => setExpandedNewsletter(expandedNewsletter === newsletter.id ? null : newsletter.id)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mb-3"
                                        >
                                            {expandedNewsletter === newsletter.id ? (
                                                <>Show Less <ChevronUp className="h-4 w-4" /></>
                                            ) : (
                                                <>Show More <ChevronDown className="h-4 w-4" /></>
                                            )}
                                        </button>
                                    )}
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Created: {new Date(newsletter.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            Recipients: {newsletter.recipients_count}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(newsletter.status)}`}>
                                        {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                                    </span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => openModal(newsletter)}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => deleteNewsletter(newsletter.id)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {newsletter.status === 'draft' && (
                            <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                                <button 
                                    onClick={() => sendNewsletter(newsletter.id)}
                                    disabled={sending}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="h-4 w-4" />
                                    {sending ? 'Sending...' : 'Send Now'}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal for Creating/Editing Newsletter */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingNewsletter ? 'Edit Newsletter' : 'Create Newsletter'}
                size="xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject Line
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <HTMLEditor
                            value={formData.html_content}
                            onChange={(value) => setFormData({...formData, html_content: value, content: value.replace(/<[^>]*>/g, '')})}
                            placeholder="Write your newsletter content here..."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {editingNewsletter ? 'Update' : 'Create'} Newsletter
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}