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
    scheduledDate?: string;
    scheduledTime?: string;
    recipientList?: string;
    useTemplate?: boolean;
    templateData?: {
        title?: string;
        subtitle?: string;
        imageUrl?: string;
        bodyText?: string;
        ctaText?: string;
        ctaUrl?: string;
        accentColor?: string;
    };
}

interface AutomatedEmail {
    id: number;
    name: string;
    trigger: 'new_donor' | 'donation_received' | 'volunteer_signup' | 'event_registration' | 'scheduled';
    template: string;
    active: boolean;
    scheduledDate?: string;
    scheduledTime?: string;
    contactList?: string;
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
            created: '2024-07-01',
            recipientList: 'All Contacts'
        },
        { 
            id: 2, 
            title: 'June 2024 Newsletter', 
            subject: 'Community Impact Report', 
            content: 'We are proud to share our impact from this past month. With your support, we were able to provide meals to 300 families, offer educational support to 75 children, and connect 40 individuals with job training opportunities. Your generosity continues to transform lives in our community.', 
            htmlContent: '<h1>Community Impact Report</h1><p>We are proud to share our impact from this past month. With your support, we were able to:</p><ul><li>Provide meals to 300 families</li><li>Offer educational support to 75 children</li><li>Connect 40 individuals with job training opportunities</li></ul><p>Your generosity continues to transform lives in our community.</p>', 
            status: 'Sent', 
            recipients: 156, 
            created: '2024-06-01',
            recipientList: 'All Donors'
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
        },
        { 
            id: 4, 
            name: 'Monthly Newsletter', 
            trigger: 'scheduled', 
            template: 'Welcome New Donor', 
            active: true,
            scheduledDate: '2024-08-01',
            scheduledTime: '09:00',
            contactList: 'All Donors'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'newsletter' | 'template' | 'automation'>('newsletter');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [sending, setSending] = useState(false);
    const [showSampleEmailModal, setShowSampleEmailModal] = useState(false);
    const [sampleEmailData, setSampleEmailData] = useState({ email: '', templateId: 0 });
    const [showSendModal, setShowSendModal] = useState(false);
    const [sendingNewsletter, setSendingNewsletter] = useState<Newsletter | null>(null);
    const [sendLaterData, setSendLaterData] = useState({ date: '', time: '' });
    const [showSampleModal, setShowSampleModal] = useState(false);
    const [sampleEmail, setSampleEmail] = useState('');
    const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(null);

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

    const generateTemplateHTML = (templateData: any) => {
        const { title, subtitle, imageUrl, bodyText, ctaText, ctaUrl, accentColor } = templateData;
        const finalAccentColor = accentColor || '#DC4444';
        
        return `
            <div style="max-width: 600px; margin: 0 auto; background: white; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; border: 2px solid #a855f7; border-radius: 8px;">
                <!-- Header Section with improved logo -->
                <div style="text-align: center; padding: 40px 24px 20px 24px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
                    <!-- Logo Triangle -->
                    <div style="margin-bottom: 20px;">
                        <div style="display: inline-block; width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-bottom: 35px solid ${finalAccentColor}; margin-bottom: 12px;"></div>
                    </div>
                    
                    <!-- Company Name -->
                    <div style="font-size: 13px; font-weight: 700; letter-spacing: 3px; color: #64748b; text-transform: uppercase; margin-bottom: 20px;">
                        RISE FOR HOPE FOUNDATION
                    </div>
                </div>

                <!-- Main Content Section -->
                <div style="padding: 40px 32px; text-align: center; background: white;">
                    <!-- Main Headline -->
                    <h1 style="font-size: 36px; font-weight: 800; color: #1e293b; line-height: 1.1; margin: 0 0 16px 0; letter-spacing: -0.5px;">
                        ${title || 'Get All Your Tech Fixin\'s In One Spot.'}
                    </h1>
                    
                    ${subtitle ? `<p style="font-size: 18px; color: #64748b; margin: 0 0 32px 0; font-weight: 500;">${subtitle}</p>` : ''}
                </div>

                <!-- Geometric Art Section -->
                <div style="position: relative; padding: 60px 32px; overflow: hidden; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);">
                    <!-- Background Shapes -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.4;">
                        <!-- Large circles -->
                        <div style="position: absolute; width: 200px; height: 200px; background: radial-gradient(circle, #e2e8f0 0%, transparent 70%); border-radius: 50%; top: -100px; left: -100px;"></div>
                        <div style="position: absolute; width: 150px; height: 150px; background: radial-gradient(circle, #cbd5e1 0%, transparent 70%); border-radius: 50%; top: 50px; right: -75px;"></div>
                        <div style="position: absolute; width: 120px; height: 120px; background: radial-gradient(circle, #e2e8f0 0%, transparent 70%); border-radius: 50%; bottom: -60px; left: 40px;"></div>
                        
                        <!-- Geometric lines -->
                        <div style="position: absolute; width: 100px; height: 2px; background: linear-gradient(90deg, transparent 0%, #cbd5e1 50%, transparent 100%); top: 80px; left: 50px; transform: rotate(45deg);"></div>
                        <div style="position: absolute; width: 80px; height: 2px; background: linear-gradient(90deg, transparent 0%, #cbd5e1 50%, transparent 100%); bottom: 100px; right: 60px; transform: rotate(-30deg);"></div>
                        
                        <!-- Small shapes -->
                        <div style="position: absolute; width: 20px; height: 20px; background: #cbd5e1; top: 120px; left: 50px; transform: rotate(45deg);"></div>
                        <div style="position: absolute; width: 16px; height: 16px; background: #e2e8f0; bottom: 140px; right: 100px; border-radius: 50%;"></div>
                        <div style="position: absolute; width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-bottom: 20px solid #cbd5e1; bottom: 120px; left: 80px;"></div>
                    </div>
                    
                    <!-- Central Hexagon -->
                    <div style="position: relative; z-index: 10; text-align: center; margin-bottom: 40px;">
                        <div style="display: inline-block; width: 100px; height: 100px; background: ${finalAccentColor}; position: relative; margin: 0 auto;" 
                             ${/* Hexagon shape using CSS clip-path */''}
                             style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px; width: 100%; height: 100%;">
                                    <div style="background: white; border-radius: 2px;"></div>
                                    <div style="background: white; border-radius: 2px;"></div>
                                    <div style="background: white; border-radius: 2px;"></div>
                                    <div style="background: white; border-radius: 2px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Content Area -->
                    <div style="position: relative; z-index: 10; text-align: center; max-width: 480px; margin: 0 auto;">
                        ${imageUrl ? `
                            <div style="margin: 30px 0;">
                                <img src="${imageUrl}" alt="Newsletter Image" style="max-width: 100%; height: auto; border-radius: 12px;">
                            </div>
                        ` : ''}
                        
                        ${bodyText ? `
                            <p style="color: #475569; line-height: 1.7; margin: 32px auto; font-size: 16px; font-weight: 400;">
                                ${bodyText.replace(/\n/g, '<br>')}
                            </p>
                        ` : ''}
                        
                        ${ctaText && ctaUrl ? `
                            <div style="margin: 40px 0;">
                                <a href="${ctaUrl}" style="display: inline-block; padding: 16px 40px; color: white; font-weight: 600; background-color: #1e293b; text-decoration: none; border-radius: 0; font-size: 16px; letter-spacing: 0.5px;">${ctaText}</a>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Footer Section with Rise for Hope Foundation details -->
                <div style="text-align: center; padding: 40px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
                    <!-- Social Icons (Twitter, Facebook, Instagram style) -->
                    <div style="margin-bottom: 24px;">
                        <div style="display: inline-flex; gap: 16px;">
                            <!-- Twitter Icon -->
                            <div style="width: 40px; height: 40px; background-color: #94a3b8; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <div style="width: 20px; height: 16px; background-color: white; mask: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyMCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDEuOTJDMTkuMjYgMi4yNiAxOC40NiAyLjQ5IDE3LjY0IDIuNkMxOC41IDIuMDQgMTkuMTMgMS4xOSAxOS40NCAwLjE5QzE4LjY0IDAuNzEgMTcuNzMgMS4wOSAxNi43NiAxLjMxQzE2IDAuNDggMTQuOTUgMCAxMy43OSAwQzExLjU0IDAgOS43NCAxLjc5IDkuNzQgNC4wMUM5Ljc0IDQuNDEgOS43OCA0LjggOS44NiA1LjE4QzYuNDQgNSA0LjQxIDMuNjggMS44MiAwLjg2QzEuNDEgMS41NyAxLjE4IDIuMzcgMS4xOCAzLjIxQzEuMTggNC44NyAyLjEyIDYuMyAzLjUyIDcuMTFDMi43IDcuMDkgMS45NCA2Ljg3IDEuMjggNi41VjYuNTdDMS4yOCA4LjYgMi43MyAxMC4yOSA0LjY2IDEwLjc0QzQuMjggMTAuODMgMy44NyAxMC44OCAzLjQ2IDEwLjg4QzMuMTYgMTAuODggMi44OCAxMC44NSAyLjYxIDEwLjhDMy4xNiAxMi41IDQuNzMgMTMuNzQgNi42IDE0LjA3QzUuMTYgMTUuMjIgMy4zMiAxNS45IDEuMzMgMTUuOUM5LjE0IDE1LjkgMTEuODggMTUuOSAxMS44OCAxNUMxMS44OCAxNC43OSAxMS44NyAxNC41OCAxMS44NSAxNC4zOEMxMi42MSAxMy44NyAxMy4yOCAxMy4yMyAxMy44MyAxMi40OUMxMy4wNyAxMi44IDEyLjI0IDEzIDExLjM3IDEzLjA4QzEyLjI0IDEyLjU0IDEyLjkgMTEuNzEgMTMuMiAxMC43M0MxMi40MyAxMS4zMSAxMS41NSAxMS43NCAxMC42IDEyQzEwLjYgMTIgOS43OCAyMCA5Ljc4IDEyIi8+Cjwvc3ZnPgo=') center/contain no-repeat;"></div>
                            </div>
                            <!-- Facebook Icon -->
                            <div style="width: 40px; height: 40px; background-color: #94a3b8; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <div style="width: 20px; height: 20px; background-color: white; border-radius: 50%;"></div>
                            </div>
                            <!-- Instagram Icon -->
                            <div style="width: 40px; height: 40px; background-color: #94a3b8; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <div style="width: 16px; height: 16px; background-color: white; border-radius: 3px;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer Links -->
                    <div style="margin-bottom: 24px;">
                        <div style="display: inline-flex; gap: 24px; font-size: 14px;">
                            <a href="#" style="color: #64748b; text-decoration: none; font-weight: 500;">Our Blog</a>
                            <a href="#" style="color: #64748b; text-decoration: none; font-weight: 500;">Unsubscribe</a>
                            <a href="#" style="color: #64748b; text-decoration: none; font-weight: 500;">Policies</a>
                        </div>
                    </div>
                    
                    <!-- Rise for Hope Foundation Details -->
                    <div style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px;">
                        <p style="margin: 0; font-weight: 600; color: #64748b;">Rise for Hope Foundation</p>
                        <p style="margin: 4px 0 0 0;">568 3rd Street, East Greenville, PA 18041</p>
                        <p style="margin: 4px 0 0 0;">EIN: 33-4151218</p>
                    </div>
                    
                    <!-- Unsubscribe Text -->
                    <div style="font-size: 12px; color: #94a3b8; line-height: 1.5; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0;">You're receiving this email because you opted in. To update your preferences or unsubscribe, <a href="#" style="color: #a855f7; text-decoration: none;">click here</a>.</p>
                    </div>
                </div>
            </div>
        `;
    };

    const sendSampleNewsletter = async () => {
        if (!sampleEmail || !currentNewsletter) {
            alert('Please enter an email address');
            return;
        }

        const emailData = {
            to: sampleEmail,
            subject: `[SAMPLE] ${currentNewsletter.subject}`,
            htmlContent: `
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 2px solid #f59e0b;">
                    <h3 style="color: #92400e; margin: 0;">📧 Sample Newsletter</h3>
                    <p style="color: #78350f; margin: 5px 0 0 0; font-size: 14px;">This is a preview of your newsletter</p>
                </div>
                ${currentNewsletter.htmlContent}
            `,
            type: 'sample_newsletter'
        };

        const success = await sendEmail(emailData);
        if (success) {
            setShowSampleModal(false);
            setSampleEmail('');
            setCurrentNewsletter(null);
        }
    };

    const openModal = (type: 'newsletter' | 'template' | 'automation', item: any = null) => {
        setModalType(type);
        setEditingItem(item);
        if (item) {
            setFormData(item);
        } else {
            if (type === 'newsletter') {
                setFormData({ 
                    title: '', 
                    subject: '', 
                    content: '', 
                    htmlContent: '', 
                    status: 'Draft', 
                    scheduledDate: '', 
                    scheduledTime: '',
                    recipientList: 'All Contacts',
                    useTemplate: false,
                    templateData: {
                        title: '',
                        subtitle: '',
                        imageUrl: '',
                        bodyText: '',
                        ctaText: '',
                        ctaUrl: '',
                        accentColor: '#DC4444'
                    }
                });
            } else if (type === 'template') {
                setFormData({ name: '', subject: '', content: '', htmlContent: '', type: 'welcome' });
            } else if (type === 'automation') {
                setFormData({ name: '', trigger: 'new_donor', template: '', active: true, scheduledDate: '', scheduledTime: '', contactList: '' });
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
            let processedFormData = { ...formData };
            
            // If using template, generate HTML from template data
            if (formData.useTemplate && formData.templateData) {
                processedFormData.htmlContent = generateTemplateHTML(formData.templateData);
                processedFormData.content = `${formData.templateData.title || ''}\n${formData.templateData.subtitle || ''}\n${formData.templateData.bodyText || ''}`.trim();
            }
            
            if (editingItem) {
                setNewsletters(newsletters.map(n => 
                    n.id === editingItem.id ? { ...n, ...processedFormData } : n
                ));
            } else {
                const newNewsletter: Newsletter = {
                    ...processedFormData,
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

        // Mock recipient emails based on selected list - in production, get from database
        const getRecipientsByList = (listName: string) => {
            switch (listName) {
                case 'All Donors':
                    return ['donor1@example.com', 'donor2@example.com', 'donor3@example.com'];
                case 'All Volunteers':
                    return ['volunteer1@example.com', 'volunteer2@example.com'];
                case 'Active Volunteers':
                    return ['volunteer1@example.com'];
                case 'Individual Donors':
                    return ['donor1@example.com', 'donor2@example.com'];
                case 'Corporate Donors':
                    return ['corporate@company.com'];
                case 'Foundation Donors':
                    return ['grants@foundation.org'];
                case 'Monthly Donors':
                    return ['donor1@example.com'];
                default: // All Contacts
                    return ['donor1@example.com', 'donor2@example.com', 'volunteer1@example.com', 'contact1@example.com'];
            }
        };

        const recipients = getRecipientsByList(newsletter.recipientList || 'All Contacts');

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

    const openSendModal = (newsletter: Newsletter) => {
        setSendingNewsletter(newsletter);
        setShowSendModal(true);
        setSendLaterData({ date: '', time: '' });
    };

    const handleSendNow = async () => {
        if (!sendingNewsletter) return;
        
        await sendNewsletter(sendingNewsletter.id);
        setShowSendModal(false);
        setSendingNewsletter(null);
    };

    const handleSendLater = async () => {
        if (!sendingNewsletter || !sendLaterData.date || !sendLaterData.time) {
            alert('Please select both date and time for scheduled sending');
            return;
        }

        // Update newsletter with scheduled info
        setNewsletters(newsletters.map(n => 
            n.id === sendingNewsletter.id 
                ? { 
                    ...n, 
                    status: 'Scheduled' as const, 
                    scheduledDate: sendLaterData.date,
                    scheduledTime: sendLaterData.time 
                }
                : n
        ));

        alert(`Newsletter "${sendingNewsletter.title}" scheduled for ${sendLaterData.date} at ${sendLaterData.time}`);
        setShowSendModal(false);
        setSendingNewsletter(null);
        setSendLaterData({ date: '', time: '' });
    };

    const sendSampleEmail = async () => {
        if (!sampleEmailData.email) {
            alert('Please enter an email address');
            return;
        }

        let template;
        if (sampleEmailData.templateId > 0) {
            template = emailTemplates.find(t => t.id === sampleEmailData.templateId);
            if (!template) {
                alert('Template not found');
                return;
            }
        }

        const emailData = {
            to: sampleEmailData.email,
            subject: template ? `[SAMPLE] ${template.subject}` : '[SAMPLE] Test Email',
            htmlContent: template ? 
                `<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                    <h3 style="color: #1f2937; margin: 0;">🧪 This is a Sample Email</h3>
                    <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Sent for testing purposes</p>
                </div>
                ${template.htmlContent.replace(/\[DONOR_NAME\]/g, 'Sample Recipient').replace(/\[AMOUNT\]/g, '100').replace(/\[EVENT_NAME\]/g, 'Sample Event').replace(/\[DATE\]/g, 'Today').replace(/\[TIME\]/g, '2:00 PM').replace(/\[LOCATION\]/g, 'Sample Location').replace(/\[NAME\]/g, 'Sample Recipient')}` :
                `<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                    <h3 style="color: #1f2937; margin: 0;">🧪 This is a Sample Email</h3>
                    <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Your email system is working correctly!</p>
                </div>
                <h2>Email System Test</h2>
                <p>Hello! This is a test email to verify that your nonprofit email system is working correctly.</p>
                <p>If you received this email, everything is set up properly.</p>
                <p>Best regards,<br>Your Nonprofit Management System</p>`,
            type: 'sample_test'
        };

        const success = await sendEmail(emailData);
        if (success) {
            setShowSampleEmailModal(false);
            setSampleEmailData({ email: '', templateId: 0 });
        }
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
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Sample Email Button */}
                    <button
                        onClick={() => setShowSampleEmailModal(true)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors text-sm"
                    >
                        <Mail className="h-4 w-4" />
                        Send Sample Email
                    </button>
                    
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
                                {newsletter.recipientList && (
                                    <span className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        List: {newsletter.recipientList}
                                    </span>
                                )}
                                {newsletter.status === 'Scheduled' && newsletter.scheduledDate && newsletter.scheduledTime && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Scheduled: {newsletter.scheduledDate} at {newsletter.scheduledTime}
                                    </span>
                                )}
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
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => openSendModal(newsletter)}
                                disabled={sending}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-4 w-4" />
                                Send Newsletter
                            </button>
                            <button 
                                onClick={() => {
                                    setCurrentNewsletter(newsletter);
                                    setShowSampleModal(true);
                                }}
                                disabled={sending}
                                className="bg-orange-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                <Mail className="h-4 w-4" />
                                Send Sample
                            </button>
                        </div>
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
                                            <p className="text-sm text-gray-600 mb-1">
                                                <span className="font-medium">Template:</span> {automation.template}
                                            </p>
                                            {automation.trigger === 'scheduled' && (
                                                <div className="text-sm text-gray-600 space-y-1 mt-2">
                                                    <p><span className="font-medium">Scheduled:</span> {automation.scheduledDate} at {automation.scheduledTime}</p>
                                                    <p><span className="font-medium">Contact List:</span> {automation.contactList}</p>
                                                </div>
                                            )}
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
                        <div className="space-y-6">
                            {/* Basic Info and Recipients */}
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Recipient List
                                        </label>
                                        <select
                                            value={formData.recipientList || 'All Contacts'}
                                            onChange={(e) => setFormData({...formData, recipientList: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="All Contacts">All Contacts</option>
                                            <option value="All Donors">All Donors</option>
                                            <option value="All Volunteers">All Volunteers</option>
                                            <option value="Active Volunteers">Active Volunteers</option>
                                            <option value="Individual Donors">Individual Donors</option>
                                            <option value="Corporate Donors">Corporate Donors</option>
                                            <option value="Foundation Donors">Foundation Donors</option>
                                            <option value="Monthly Donors">Monthly Donors</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={formData.status || 'Draft'}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Scheduled">Schedule for Later</option>
                                        </select>
                                    </div>
                                    {formData.status === 'Scheduled' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Send Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.scheduledDate || ''}
                                                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Send Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={formData.scheduledTime || ''}
                                                    onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {/* Template Toggle */}
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.useTemplate || false}
                                                onChange={(e) => setFormData({...formData, useTemplate: e.target.checked})}
                                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">Use Template Builder</span>
                                                <p className="text-xs text-gray-500">Create a structured newsletter with predefined sections</p>
                                            </div>
                                        </label>
                                    </div>

                                    {!formData.useTemplate && (
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
                                    )}
                                </div>
                            </div>

                            {/* Template Builder */}
                            {formData.useTemplate && (
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Newsletter Template Builder</h4>
                                <p className="text-sm text-gray-500 mb-4">Create beautiful newsletters with custom content and styling</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Main Title
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Newsletter main title"
                                                    value={formData.templateData?.title || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData, 
                                                        templateData: {...formData.templateData, title: e.target.value}
                                                    })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Subtitle
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Newsletter subtitle (optional)"
                                                    value={formData.templateData?.subtitle || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData, 
                                                        templateData: {...formData.templateData, subtitle: e.target.value}
                                                    })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Brand Color
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="color"
                                                        value={formData.templateData?.accentColor || '#DC4444'}
                                                        onChange={(e) => setFormData({
                                                            ...formData, 
                                                            templateData: {...formData.templateData, accentColor: e.target.value}
                                                        })}
                                                        className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="#DC4444"
                                                        value={formData.templateData?.accentColor || '#DC4444'}
                                                        onChange={(e) => setFormData({
                                                            ...formData, 
                                                            templateData: {...formData.templateData, accentColor: e.target.value}
                                                        })}
                                                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Choose your organization's primary color for the template</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Header Image URL
                                                </label>
                                                <input
                                                    type="url"
                                                    placeholder="https://example.com/image.jpg"
                                                    value={formData.templateData?.imageUrl || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData, 
                                                        templateData: {...formData.templateData, imageUrl: e.target.value}
                                                    })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Optional: Add a header image to your newsletter</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Main Content
                                                </label>
                                                <textarea
                                                    placeholder="Write your main newsletter content here..."
                                                    value={formData.templateData?.bodyText || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData, 
                                                        templateData: {...formData.templateData, bodyText: e.target.value}
                                                    })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows={8}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Call-to-Action Button Text
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Donate Now, Learn More"
                                                    value={formData.templateData?.ctaText || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData, 
                                                        templateData: {...formData.templateData, ctaText: e.target.value}
                                                    })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Call-to-Action URL
                                                </label>
                                                <input
                                                    type="url"
                                                    placeholder="https://your-website.com/action"
                                                    value={formData.templateData?.ctaUrl || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData, 
                                                        templateData: {...formData.templateData, ctaUrl: e.target.value}
                                                    })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                        <div className="space-y-6">
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
                                        <option value="scheduled">Scheduled Send</option>
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

                            {/* Scheduling Fields - only show when trigger is 'scheduled' */}
                            {formData.trigger === 'scheduled' && (
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Schedule Settings</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Send Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.scheduledDate || ''}
                                                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Send Time
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.scheduledTime || ''}
                                                onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contact List
                                            </label>
                                            <select
                                                value={formData.contactList || ''}
                                                onChange={(e) => setFormData({...formData, contactList: e.target.value})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                required
                                            >
                                                <option value="">Select Contact List</option>
                                                <option value="All Donors">All Donors</option>
                                                <option value="All Volunteers">All Volunteers</option>
                                                <option value="All Contacts">All Contacts</option>
                                                <option value="Active Volunteers">Active Volunteers</option>
                                                <option value="Individual Donors">Individual Donors</option>
                                                <option value="Corporate Donors">Corporate Donors</option>
                                                <option value="Foundation Donors">Foundation Donors</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                        {modalType === 'newsletter' && formData.useTemplate && (
                            <button
                                type="button"
                                onClick={() => {
                                    const previewHTML = generateTemplateHTML(formData.templateData || {});
                                    const newWindow = window.open();
                                    if (newWindow) {
                                        newWindow.document.write(`
                                            <html>
                                                <head><title>Newsletter Preview</title></head>
                                                <body style="margin: 0; padding: 20px; background-color: #f5f5f5;">
                                                    ${previewHTML}
                                                </body>
                                            </html>
                                        `);
                                        newWindow.document.close();
                                    }
                                }}
                                className="py-3 px-6 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
                            >
                                Preview
                            </button>
                        )}
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

            {/* Sample Email Modal */}
            <Modal
                isOpen={showSampleEmailModal}
                onClose={() => setShowSampleEmailModal(false)}
                title="Send Sample Email"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recipient Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email address to test"
                            value={sampleEmailData.email}
                            onChange={(e) => setSampleEmailData({...sampleEmailData, email: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Template (Optional)
                        </label>
                        <select
                            value={sampleEmailData.templateId}
                            onChange={(e) => setSampleEmailData({...sampleEmailData, templateId: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value={0}>Basic Test Email</option>
                            {emailTemplates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Choose a template to test, or use basic test email to verify connectivity
                        </p>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={sendSampleEmail}
                            disabled={sending}
                            className="flex-1 py-2 px-4 rounded-lg text-white font-medium bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? 'Sending...' : 'Send Sample'}
                        </button>
                        <button
                            onClick={() => setShowSampleEmailModal(false)}
                            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Send Newsletter Modal */}
            <Modal
                isOpen={showSendModal}
                onClose={() => setShowSendModal(false)}
                title={sendingNewsletter ? `Send Newsletter: ${sendingNewsletter.title}` : 'Send Newsletter'}
                size="lg"
            >
                <div className="space-y-6">
                    {/* Newsletter Preview Section */}
                    {sendingNewsletter && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2">{sendingNewsletter.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Subject:</span> {sendingNewsletter.subject}
                            </p>
                            <p className="text-sm text-gray-500">
                                {sendingNewsletter.content ? sendingNewsletter.content.substring(0, 150) + '...' : 'No content preview available'}
                            </p>
                        </div>
                    )}

                    {/* Recipient Selection Section */}
                    <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="h-5 w-5 text-orange-600" />
                            <h3 className="font-semibold text-gray-900">Who will receive this newsletter?</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Contact List
                                </label>
                                <select
                                    value={sendingNewsletter?.recipientList || 'All Contacts'}
                                    onChange={(e) => {
                                        if (sendingNewsletter) {
                                            // Update the newsletter's recipient list
                                            setNewsletters(newsletters.map(n => 
                                                n.id === sendingNewsletter.id 
                                                    ? { ...n, recipientList: e.target.value }
                                                    : n
                                            ));
                                            setSendingNewsletter({ ...sendingNewsletter, recipientList: e.target.value });
                                        }
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                                >
                                    <option value="All Contacts">All Contacts</option>
                                    <option value="All Donors">All Donors</option>
                                    <option value="All Volunteers">All Volunteers</option>
                                    <option value="Active Volunteers">Active Volunteers</option>
                                    <option value="Individual Donors">Individual Donors</option>
                                    <option value="Corporate Donors">Corporate Donors</option>
                                    <option value="Foundation Donors">Foundation Donors</option>
                                    <option value="Monthly Donors">Monthly Donors</option>
                                </select>
                            </div>
                            
                            {/* Estimated Recipients Count */}
                            <div className="bg-white p-3 rounded border border-orange-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Estimated Recipients:</span>
                                    <span className="text-lg font-bold text-orange-600">
                                        {(() => {
                                            const listName = sendingNewsletter?.recipientList || 'All Contacts';
                                            switch (listName) {
                                                case 'All Donors': return '45';
                                                case 'All Volunteers': return '23';
                                                case 'Active Volunteers': return '18';
                                                case 'Individual Donors': return '38';
                                                case 'Corporate Donors': return '7';
                                                case 'Foundation Donors': return '3';
                                                case 'Monthly Donors': return '22';
                                                default: return '78'; // All Contacts
                                            }
                                        })()}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    This is an estimate based on your current contact lists
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Send Options */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-center">Choose when to send</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleSendNow}
                                disabled={sending}
                                className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="text-center">
                                    <Send className="h-8 w-8 text-green-600 mx-auto mb-3" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Send Now</h3>
                                    <p className="text-sm text-gray-600">
                                        Send immediately to selected recipients
                                    </p>
                                </div>
                            </button>
                            
                            <div className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                <div className="text-center mb-4">
                                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Send Later</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Schedule for a specific date and time
                                    </p>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <input
                                            type="date"
                                            value={sendLaterData.date}
                                            onChange={(e) => setSendLaterData({...sendLaterData, date: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="time"
                                            value={sendLaterData.time}
                                            onChange={(e) => setSendLaterData({...sendLaterData, time: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendLater}
                                        disabled={!sendLaterData.date || !sendLaterData.time}
                                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Schedule Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Send Sample Button */}
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    if (sendingNewsletter) {
                                        setCurrentNewsletter(sendingNewsletter);
                                        setShowSampleModal(true);
                                        setShowSendModal(false);
                                    }
                                }}
                                className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-200 transition-colors text-sm"
                            >
                                <Eye className="h-4 w-4" />
                                Send Test Email First
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={() => setShowSendModal(false)}
                            className="py-2 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Sample Newsletter Modal */}
            <Modal
                isOpen={showSampleModal}
                onClose={() => setShowSampleModal(false)}
                title="Send Sample Newsletter"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recipient Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email address to test"
                            value={sampleEmail}
                            onChange={(e) => setSampleEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                    </div>
                    
                    {currentNewsletter && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">{currentNewsletter.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">Subject: {currentNewsletter.subject}</p>
                            <p className="text-sm text-gray-500">
                                Recipient List: {currentNewsletter.recipientList || 'All Contacts'}
                            </p>
                        </div>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={sendSampleNewsletter}
                            disabled={sending}
                            className="flex-1 py-2 px-4 rounded-lg text-white font-medium bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? 'Sending...' : 'Send Sample'}
                        </button>
                        <button
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