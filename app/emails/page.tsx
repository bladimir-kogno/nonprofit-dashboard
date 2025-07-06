'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Send, Mail, MessageCircle, Settings, Users, Calendar, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '../../components/shared/Modal';
import HTMLEditor from '../../components/shared/HTMLEditor';

interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    content: string;
    htmlContent: string;
    type: 'welcome' | 'donation_ack' | 'newsletter' | 'event_reminder' | 'thank_you';
}

interface Newsletter {
    id: number;
    title: string;
    subject: string;
    content: string;
    htmlContent: string;
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
    const [expandedNewsletter, setExpandedNewsletter] = useState<number | null>(null);
    
    // Sample data
    const [newsletters, setNewsletters] = useState<Newsletter[]>([
        { 
            id: 1, 
            title: 'July 2024 Newsletter', 
            subject: 'Summer Updates & Upcoming Events', 
            content: 'Summer has been busy for us with amazing community outreach projects and successful fundraising events. We\'ve reached over 500 families this month with our food assistance program, and our youth mentorship program has expanded to include 50 new participants. Thank you to all our dedicated volunteers who make this possible!', 
            htmlContent: '<h1>Summer Updates & Upcoming Events</h1><p>Summer has been busy for us with amazing community outreach projects and successful fundraising events. We\'ve reached over 500 families this month with our food assistance program, and our youth mentorship program has expanded to include 50 new participants.</p><h2>Upcoming Events</h2><ul><li>Community BBQ - August 15th</li><li>Volunteer Training - August 20th</li><li>Fundraising Gala - September 10th</li></ul><p>Thank you to all our dedicated volunteers who make this possible!</p>', 
            status: 'Draft', 
            recipients: 0, 
            created: '2024-07-01' 
        },
        { 
            id: 2, 
            title: 'June 2024 Newsletter', 
            subject: 'Community Impact Report', 
            content: 'We are proud to share our impact from this past month. With your support, we were able to provide meals to 300 families, offer educational support to 75 children, and connect 40 individuals with job training opportunities. Your generosity continues to transform lives in our community.', 
            htmlContent: '<h1>Community Impact Report</h1><p>We are proud to share our impact from this past month. With your support, we were able to:</p><ul><li>Provide meals to 300 families</li><li>Offer educational support to 75 children</li><li>Connect 40 individuals with job training opportunities</li></ul><p>Your generosity continues to transform lives in our community.</p>', 
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
            htmlContent: '<h2>Thank You for Your Generous Donation!</h2><p>Dear <strong>[DONOR_NAME]</strong>,</p><p>Thank you so much for your generous donation of <strong>$[AMOUNT]</strong>. Your support means the world to us and helps us continue our mission to make a positive impact in our community.</p><p>With gratitude,<br>The Nonprofit Team</p>', 
            type: 'donation_ack' 
        },
        { 
            id: 2, 
            name: 'Welcome New Donor', 
            subject: 'Welcome to Our Nonprofit Family!', 
            content: 'Dear [DONOR_NAME], Welcome to our community! We are thrilled to have you join our mission...', 
            htmlContent: '<h2>Welcome to Our Nonprofit Family!</h2><p>Dear <strong>[DONOR_NAME]</strong>,</p><p>Welcome to our community! We are thrilled to have you join our mission to create positive change. Your support helps us reach more people and make a greater impact.</p><ul><li>Stay updated with our monthly newsletter</li><li>Join our volunteer opportunities</li><li>Attend our community events</li></ul><p>Thank you for being part of our journey!</p>', 
            type: 'welcome' 
        },
        { 
            id: 3, 
            name: 'Event Reminder', 
            subject: 'Don\'t Forget - [EVENT_NAME] is Tomorrow!', 
            content: 'Hello [NAME], This is a friendly reminder about [EVENT_NAME] happening tomorrow at [TIME]...', 
            htmlContent: '<h2>Event Reminder: [EVENT_NAME]</h2><p>Hello <strong>[NAME]</strong>,</p><p>This is a friendly reminder about <strong>[EVENT_NAME]</strong> happening tomorrow!</p><div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;"><p><strong>When:</strong> [DATE] at [TIME]</p><p><strong>Where:</strong> [LOCATION]</p></div><p>We look forward to seeing you there!</p>', 
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
    const [sending, setSending] = useState(false);

    // Email sending function
    const sendEmail = async (emailData: any) => {
        try {
            setSending(true);
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });

            const result = await response.json();
            
            if (result.success) {
                alert(`Email sent successfully! ${result.preview ? `Preview: ${result.preview}` : ''}`);
                return true;
            } else {
                alert(`Failed to send email: ${result.error}`);
                return false;
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email. Please try again.');
            return false;
        } finally {
            setSending(false);
        }
    };

    const openModal = (type: 'newsletter' | 'template' | 'automation', item: any = null) => {
        setModalType(type);
        setEditingItem(item);
        if (item) {
            setFormData(item);
        } else {
            if (type === 'newsletter') {
                setFormData({ title: '', subject: '', content: '', htmlContent: '', status: 'Draft' });
            } else if (type === 'template') {
                setFormData({ name: '', subject: '', content: '', htmlContent: '', type: 'welcome' });
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

    const sendNewsletter = async (newsletterId: number) => {
        const newsletter = newsletters.find(n => n.id === newsletterId);
        if (!newsletter) return;

        // Mock recipient emails - in production, get from database
        const recipients = [
            'donor1@example.com',
            'donor2@example.com',
            'volunteer1@example.com'
        ];

        const emailData = {
            to: recipients,
            subject: newsletter.subject,
            htmlContent: newsletter.htmlContent,
            type: 'newsletter'
        };

        const success = await sendEmail(emailData);
        
        if (success) {
            const totalRecipients = recipients.length;
            setNewsletters(newsletters.map(n => 
                n.id === newsletterId 
                    ? { ...n, status: 'Sent' as const, recipients: totalRecipients }
                    : n
            ));
        }
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

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Email & Newsletter Management</h2>
                
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="text-lg font-semibold">Newsletter Management</h3>
                        <button 
                            onClick={() => openModal('newsletter')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create Newsletter
                        </button>
                    </div>
                    
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
                                                    Created: {newsletter.created}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    Recipients: {newsletter.recipients}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(newsletter.status)}`}>
                                                {newsletter.status}
                                            </span>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => openModal('newsletter', newsletter)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => deleteItem('newsletter', newsletter.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {newsletter.status === 'Draft' && (
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
                </div>
            )}

            {activeTab === 'templates' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="text-lg font-semibold">Email Templates</h3>
                        <button 
                            onClick={() => openModal('template')}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create Template
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {emailTemplates.map(template => (
                            <div key={template.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => openModal('template', template)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                title="Edit"
                                            >
                                                <Edit2 className="h-3 w-3" />
                                            </button>
                                            <button 
                                                onClick={() => deleteItem('template', template.id)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 font-medium">{template.subject}</p>
                                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                        {truncateText(template.content, 120)}
                                    </p>
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.type)}`}>
                                        {template.type.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'automation' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="text-lg font-semibold">Email Automation Rules</h3>
                        <button 
                            onClick={() => openModal('automation')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create Automation
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {automatedEmails.map(automation => (
                            <div key={automation.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                <div className="p-4">
                                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 mb-2">{automation.name}</h4>
                                            <p className="text-sm text-gray-600 mb-1">
                                                <span className="font-medium">Trigger:</span> {automation.trigger.replace('_', ' ').toLowerCase()}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Template:</span> {automation.template}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <button
                                                onClick={() => toggleAutomation(automation.id)}
                                                className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                                                    automation.active 
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                }`}
                                            >
                                                {automation.active ? 'Active' : 'Inactive'}
                                            </button>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => openModal('automation', automation)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => deleteItem('automation', automation.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
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
                size="xl"
                title={
                    modalType === 'newsletter' ? (editingItem ? 'Edit Newsletter' : 'Create Newsletter') :
                    modalType === 'template' ? (editingItem ? 'Edit Template' : 'Create Template') :
                    (editingItem ? 'Edit Automation' : 'Create Automation')
                }
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {modalType === 'newsletter' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Newsletter Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter newsletter title"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Subject
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter email subject"
                                        value={formData.subject || ''}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Newsletter Content
                                </label>
                                <HTMLEditor
                                    content={formData.htmlContent || ''}
                                    onChange={(html) => setFormData({...formData, htmlContent: html, content: html.replace(/<[^>]*>/g, '')})}
                                    placeholder="Write your newsletter content here..."
                                />
                            </div>
                        </div>
                    )}

                    {modalType === 'template' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Template Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter template name"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Template Type
                                    </label>
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
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Subject
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter email subject"
                                        value={formData.subject || ''}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Template Content
                                </label>
                                <HTMLEditor
                                    content={formData.htmlContent || ''}
                                    onChange={(html) => setFormData({...formData, htmlContent: html, content: html.replace(/<[^>]*>/g, '')})}
                                    placeholder="Write your email template here... Use variables like [DONOR_NAME], [AMOUNT], etc."
                                />
                            </div>
                        </div>
                    )}

                    {modalType === 'automation' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Automation Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter automation name"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trigger Event
                                </label>
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
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Template
                                </label>
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
                            </div>
                        </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={sending}
                            className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                modalType === 'newsletter' ? 'bg-blue-600 hover:bg-blue-700' :
                                modalType === 'template' ? 'bg-purple-600 hover:bg-purple-700' :
                                'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {sending ? 'Processing...' : (editingItem ? 'Update' : 'Create')}
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}