'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Settings, Users } from 'lucide-react';
import NewsletterManager from '../../components/emails/NewsletterManager';
import { EmailTemplateService, NewsletterService, EmailAutomationService } from '../../lib/database-models';

export default function EmailsPage() {
    const [activeTab, setActiveTab] = useState<'newsletters' | 'templates' | 'automation'>('newsletters');

    // Summary stats - these would come from real API calls
    const summaryStats = {
        newslettersSent: 0,
        activeAutomations: 0,
        emailTemplates: 0,
        totalRecipients: 0
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
                            <p className="text-2xl font-bold text-blue-900">{summaryStats.newslettersSent}</p>
                        </div>
                        <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Active Automations</p>
                            <p className="text-2xl font-bold text-green-900">{summaryStats.activeAutomations}</p>
                        </div>
                        <Settings className="h-6 w-6 text-green-600" />
                    </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Email Templates</p>
                            <p className="text-2xl font-bold text-purple-900">{summaryStats.emailTemplates}</p>
                        </div>
                        <MessageCircle className="h-6 w-6 text-purple-600" />
                    </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 text-sm font-medium">Total Recipients</p>
                            <p className="text-2xl font-bold text-orange-900">{summaryStats.totalRecipients}</p>
                        </div>
                        <Users className="h-6 w-6 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'newsletters' && <NewsletterManager />}
            
            {activeTab === 'templates' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Email Templates</h3>
                    <p className="text-gray-600">Template management component coming soon...</p>
                </div>
            )}
            
            {activeTab === 'automation' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Email Automation</h3>
                    <p className="text-gray-600">Automation management component coming soon...</p>
                </div>
            )}
        </div>
    );
}