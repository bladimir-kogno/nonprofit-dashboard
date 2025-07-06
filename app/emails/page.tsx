'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Send, Mail, MessageCircle, Settings, Users, Calendar } from 'lucide-react';
import Modal from '../../components/shared/Modal';

interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    content: string;
    type: 'welcome' | 'donation_ack' | 'newsletter' | 'event_reminder' | 'thank_you';
}

interface Newsletter {
    id: number;
    title: string;
    subject: string;
    content: string;
    status: 'Draft' | 'Scheduled' | 'Sent';
    recipients: number;
    created: string;
    scheduledFor?: string;
}

interface AutomatedEmail {
    id: number;
    name: string;
    trigger: 'new_donor' | 'donation_received' | 'volunteer_signup' | 'event_registration';
    template: string;
    active: boolean;
}

export default function EmailsPage() {
    const [activeTab, setActiveTab] = useState<'newsletters' | 'templates' | 'automation'>('newsletters');
    
    // Sample data
    const [newsletters, setNewsletters] = useState<Newsletter[]>([
        { 
            id: 1, 
            title: 'July 2024 Newsletter', 
            subject: 'Summer Updates & Upcoming Events', 
            content: 'Summer has been busy for us with amazing community outreach...', 
            status: 'Draft', 
            recipients: 0, 
            created: '2024-07-01' 
        },
        { 
            id: 2, 
            title: 'June 2024 Newsletter', 
            subject: 'Community Impact Report', 
            content: 'We are proud to share our impact from this past month...', 
            status: 'Sent', 
            recipients: 156, 
            created: '2024-06-01' 
        }
    ]);

    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
        { 
            id: 1, 
            name: 'Donation Thank You', 
            subject: 'Thank you for your generous donation!', 
            content: 'Dear [DONOR_NAME], Thank you so much for your generous donation of $[AMOUNT]. Your support means the world to us...', 
            type: 'donation_ack' 
        },
        { 
            id: 2, 
            name: 'Welcome New Donor', 
            subject: 'Welcome to Our Nonprofit Family!', 
            content: 'Dear [DONOR_NAME], Welcome to our community! We are thrilled to have you join our mission...', 
            type: 'welcome' 
        },
        { 
            id: 3, 
            name: 'Event Reminder', 
            subject: 'Don\'t Forget - [EVENT_NAME] is Tomorrow!', 
            content: 'Hello [NAME], This is a friendly reminder about [EVENT_NAME] happening tomorrow at [TIME]...', 
            type: 'event_reminder' 
        }
    ]);

    const [automatedEmails, setAutomatedEmails] = useState<AutomatedEmail[]>([
        { 
            id: 1, 
            name: 'Donation Acknowledgment', 
            trigger: 'donation_received', 
            template: 'Donation Thank You', 
            active: true 
        },
        { 
            id: 2, 
            name: 'New Donor Welcome', 
            trigger: 'new_donor', 
            template: 'Welcome New Donor', 
            active: true 
        },
        { 
            id: 3, 
            name: 'Volunteer Welcome', 
            trigger: 'volunteer_signup', 
            template: 'Welcome New Donor', 
            active: false 
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'newsletter' | 'template' | 'automation'>('newsletter');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    const openModal = (type: 'newsletter' | 'template' | 'automation', item: any = null) => {
        setModalType(type);
        setEditingItem(item);
        if (item) {
            setFormData(item);
        } else {
            if (type === 'newsletter') {
                setFormData({ title: '', subject: '', content: '', status: 'Draft' });
            } else if (type === 'template') {
                setFormData({ name: '', subject: '', content: '', type: 'welcome' });
            } else if (type === 'automation') {
                setFormData({ name: '', trigger: 'new_donor', template: '', active: true });
            }
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (modalType === 'newsletter') {
            if (editingItem) {
                setNewsletters(newsletters.map(n => 
                    n.id === editingItem.id ? { ...n, ...formData } : n
                ));
            } else {
                const newNewsletter: Newsletter = {
                    ...formData,
                    id: Date.now(),
                    recipients: 0,
                    created: new Date().toISOString().split('T')[0]
                };
                setNewsletters([...newsletters, newNewsletter]);
            }
        } else if (modalType === 'template') {
            if (editingItem) {
                setEmailTemplates(emailTemplates.map(t => 
                    t.id === editingItem.id ? { ...t, ...formData } : t
                ));
            } else {
                const newTemplate: EmailTemplate = {
                    ...formData,
                    id: Date.now()
                };
                setEmailTemplates([...emailTemplates, newTemplate]);
            }
        } else if (modalType === 'automation') {
            if (editingItem) {
                setAutomatedEmails(automatedEmails.map(a => 
                    a.id === editingItem.id ? { ...a, ...formData } : a
                ));
            } else {
                const newAutomation: AutomatedEmail = {
                    ...formData,
                    id: Date.now()
                };
                setAutomatedEmails([...automatedEmails, newAutomation]);
            }
        }
        
        closeModal();
    };

    const deleteItem = (type: string, id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            if (type === 'newsletter') setNewsletters(newsletters.filter(n => n.id !== id));
            else if (type === 'template') setEmailTemplates(emailTemplates.filter(t => t.id !== id));
            else if (type === 'automation') setAutomatedEmails(automatedEmails.filter(a => a.id !== id));
        }
    };

    const sendNewsletter = (newsletterId: number) => {
        const totalRecipients = 156; // Mock number - would come from donor + volunteer count
        setNewsletters(newsletters.map(n => 
            n.id === newsletterId 
                ? { ...n, status: 'Sent' as const, recipients: totalRecipients }
                : n
        ));
        alert(`Newsletter sent to ${totalRecipients} recipients!`);
    };

    const toggleAutomation = (id: number) => {
        setAutomatedEmails(automatedEmails.map(a => 
            a.id === id ? { ...a, active: !a.active } : a
        ));
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'welcome': return 'bg-blue-100 text-blue-800';
            case 'donation_ack': return 'bg-green-100 text-green-800';
            case 'newsletter': return 'bg-purple-100 text-purple-800';
            case 'event_reminder': return 'bg-orange-100 text-orange-800';
            case 'thank_you': return 'bg-pink-100 text-pink-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Sent': return 'bg-green-100 text-green-800';
            case 'Draft': return 'bg-yellow-100 text-yellow-800';
            case 'Scheduled': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Email & Newsletter Management</h2>
                
                {/* Tab Navigation */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('newsletters')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'newsletters' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Mail className="h-4 w-4 inline mr-2" />
                        Newsletters
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'templates' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <MessageCircle className="h-4 w-4 inline mr-2" />
                        Templates
                    </button>
                    <button
                        onClick={() => setActiveTab('automation')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'automation' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Settings className="h-4 w-4 inline mr-2" />
                        Automation
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Newsletters Sent</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {newsletters.filter(n => n.status === 'Sent').length}
                            </p>
                        </div>
                        <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Active Automations</p>
                            <p className="text-2xl font-bold text-green-900">
                                {automatedEmails.filter(a => a.active).length}
                            </p>
                        </div>
                        <Settings className="h-6 w-6 text-green-600" />
                    </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Email Templates</p>
                            <p className="text-2xl font-bold text-purple-900">{emailTemplates.length}</p>
                        </div>
                        <MessageCircle className="h-6 w-6 text-purple-600" />
                    </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 text-sm font-medium">Total Recipients</p>
                            <p className="text-2xl font-bold text-orange-900">
                                {newsletters.reduce((sum, n) => sum + n.recipients, 0)}
                            </p>
                        </div>
                        <Users className="h-6 w-6 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'newsletters' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Newsletter Management</h3>
                        <button 
                            onClick={() => openModal('newsletter')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Create Newsletter
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {newsletters.map(newsletter => (
                            <div key={newsletter.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-lg">{newsletter.title}</h4>
                                        <p className="text-gray-600 mt-1">{newsletter.subject}</p>
                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{newsletter.content}</p>
                                        <div className="flex gap-4 mt-3 text-sm text-gray-500">
                                            <span>Created: {newsletter.created}</span>
                                            <span>Recipients: {newsletter.recipients}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(newsletter.status)}`}>
                                            {newsletter.status}
                                        </span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => openModal('newsletter', newsletter)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => deleteItem('newsletter', newsletter.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {newsletter.status === 'Draft' && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <button 
                                            onClick={() => sendNewsletter(newsletter.id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                                        >
                                            <Send className="h-4 w-4" />
                                            Send Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'templates' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Email Templates</h3>
                        <button 
                            onClick={() => openModal('template')}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
                        >
                            <Plus className="h-4 w-4" />
                            Create Template
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {emailTemplates.map(template => (
                            <div key={template.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-medium">{template.name}</h4>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => openModal('template', template)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </button>
                                        <button 
                                            onClick={() => deleteItem('template', template.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-3">{template.content}</p>
                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.type)}`}>
                                    {template.type.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'automation' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Email Automation Rules</h3>
                        <button 
                            onClick={() => openModal('automation')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4" />
                            Create Automation
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {automatedEmails.map(automation => (
                            <div key={automation.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium">{automation.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Trigger: {automation.trigger.replace('_', ' ').toLowerCase()}
                                        </p>
                                        <p className="text-sm text-gray-600">Template: {automation.template}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleAutomation(automation.id)}
                                            className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer ${
                                                automation.active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {automation.active ? 'Active' : 'Inactive'}
                                        </button>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => openModal('automation', automation)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => deleteItem('automation', automation.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal for forms */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={
                    modalType === 'newsletter' ? (editingItem ? 'Edit Newsletter' : 'Create Newsletter') :
                    modalType === 'template' ? (editingItem ? 'Edit Template' : 'Create Template') :
                    (editingItem ? 'Edit Automation' : 'Create Automation')
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {modalType === 'newsletter' && (
                        <>
                            <input
                                type="text"
                                placeholder="Newsletter Title"
                                value={formData.title || ''}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Email Subject"
                                value={formData.subject || ''}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <textarea
                                placeholder="Newsletter Content"
                                value={formData.content || ''}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                rows={6}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </>
                    )}

                    {modalType === 'template' && (
                        <>
                            <input
                                type="text"
                                placeholder="Template Name"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                            />
                            <select
                                value={formData.type || ''}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                            >
                                <option value="">Select Template Type</option>
                                <option value="welcome">Welcome</option>
                                <option value="donation_ack">Donation Acknowledgment</option>
                                <option value="newsletter">Newsletter</option>
                                <option value="event_reminder">Event Reminder</option>
                                <option value="thank_you">Thank You</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Email Subject"
                                value={formData.subject || ''}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                            />
                            <textarea
                                placeholder="Email Content (use [DONOR_NAME], [AMOUNT], etc. for variables)"
                                value={formData.content || ''}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                rows={6}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                            />
                        </>
                    )}

                    {modalType === 'automation' && (
                        <>
                            <input
                                type="text"
                                placeholder="Automation Name"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                            />
                            <select
                                value={formData.trigger || ''}
                                onChange={(e) => setFormData({...formData, trigger: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                            >
                                <option value="">Select Trigger</option>
                                <option value="new_donor">New Donor Registration</option>
                                <option value="donation_received">Donation Received</option>
                                <option value="volunteer_signup">Volunteer Signup</option>
                                <option value="event_registration">Event Registration</option>
                            </select>
                            <select
                                value={formData.template || ''}
                                onChange={(e) => setFormData({...formData, template: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                            >
                                <option value="">Select Email Template</option>
                                {emailTemplates.map(template => (
                                    <option key={template.id} value={template.name}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${
                                modalType === 'newsletter' ? 'bg-blue-600 hover:bg-blue-700' :
                                modalType === 'template' ? 'bg-purple-600 hover:bg-purple-700' :
                                'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {editingItem ? 'Update' : 'Create'}
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