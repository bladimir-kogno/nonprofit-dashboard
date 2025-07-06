// Database Models for Email Newsletter Management System

import { supabase } from './db';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  html_content: string;
  type: 'welcome' | 'donation_ack' | 'newsletter' | 'event_reminder' | 'thank_you';
  created_at: string;
  updated_at: string;
  created_by: string;
  is_active: boolean;
}

export interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  html_content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipients_count: number;
  opened_count: number;
  clicked_count: number;
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  tags?: string[];
}

export interface EmailAutomation {
  id: string;
  name: string;
  trigger_type: 'new_donor' | 'donation_received' | 'volunteer_signup' | 'event_registration';
  template_id: string;
  is_active: boolean;
  conditions?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface EmailRecipient {
  id: string;
  email: string;
  name: string;
  type: 'donor' | 'volunteer' | 'subscriber' | 'event_attendee';
  status: 'active' | 'unsubscribed' | 'bounced';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface EmailCampaign {
  id: string;
  newsletter_id: string;
  recipient_id: string;
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  error_message?: string;
  created_at: string;
}

// Database Operations
export class EmailTemplateService {
  static async getAll(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async create(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert([template])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }
}

export class NewsletterService {
  static async getAll(): Promise<Newsletter[]> {
    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async create(newsletter: Omit<Newsletter, 'id' | 'created_at' | 'updated_at'>): Promise<Newsletter> {
    const { data, error } = await supabase
      .from('newsletters')
      .insert([newsletter])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<Newsletter>): Promise<Newsletter> {
    const { data, error } = await supabase
      .from('newsletters')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('newsletters')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async getStats(): Promise<{
    total: number;
    draft: number;
    sent: number;
    scheduled: number;
    totalRecipients: number;
    totalOpens: number;
    totalClicks: number;
  }> {
    const { data, error } = await supabase
      .from('newsletters')
      .select('status, recipients_count, opened_count, clicked_count');
    
    if (error) throw error;
    
    const stats = {
      total: data?.length || 0,
      draft: data?.filter(n => n.status === 'draft').length || 0,
      sent: data?.filter(n => n.status === 'sent').length || 0,
      scheduled: data?.filter(n => n.status === 'scheduled').length || 0,
      totalRecipients: data?.reduce((sum, n) => sum + (n.recipients_count || 0), 0) || 0,
      totalOpens: data?.reduce((sum, n) => sum + (n.opened_count || 0), 0) || 0,
      totalClicks: data?.reduce((sum, n) => sum + (n.clicked_count || 0), 0) || 0,
    };
    
    return stats;
  }
}

export class EmailAutomationService {
  static async getAll(): Promise<EmailAutomation[]> {
    const { data, error } = await supabase
      .from('email_automations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async create(automation: Omit<EmailAutomation, 'id' | 'created_at' | 'updated_at'>): Promise<EmailAutomation> {
    const { data, error } = await supabase
      .from('email_automations')
      .insert([automation])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<EmailAutomation>): Promise<EmailAutomation> {
    const { data, error } = await supabase
      .from('email_automations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_automations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async toggleActive(id: string): Promise<EmailAutomation> {
    const { data: current, error: fetchError } = await supabase
      .from('email_automations')
      .select('is_active')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const { data, error } = await supabase
      .from('email_automations')
      .update({ 
        is_active: !current.is_active, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export class EmailRecipientService {
  static async getAll(): Promise<EmailRecipient[]> {
    const { data, error } = await supabase
      .from('email_recipients')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async create(recipient: Omit<EmailRecipient, 'id' | 'created_at' | 'updated_at'>): Promise<EmailRecipient> {
    const { data, error } = await supabase
      .from('email_recipients')
      .insert([recipient])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async bulkImport(recipients: Omit<EmailRecipient, 'id' | 'created_at' | 'updated_at'>[]): Promise<EmailRecipient[]> {
    const { data, error } = await supabase
      .from('email_recipients')
      .insert(recipients)
      .select();
    
    if (error) throw error;
    return data || [];
  }

  static async getByType(type: EmailRecipient['type']): Promise<EmailRecipient[]> {
    const { data, error } = await supabase
      .from('email_recipients')
      .select('*')
      .eq('type', type)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async unsubscribe(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_recipients')
      .update({ 
        status: 'unsubscribed', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    if (error) throw error;
  }
}

export class EmailCampaignService {
  static async create(campaign: Omit<EmailCampaign, 'id' | 'created_at'>): Promise<EmailCampaign> {
    const { data, error } = await supabase
      .from('email_campaigns')
      .insert([campaign])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async bulkCreate(campaigns: Omit<EmailCampaign, 'id' | 'created_at'>[]): Promise<EmailCampaign[]> {
    const { data, error } = await supabase
      .from('email_campaigns')
      .insert(campaigns)
      .select();
    
    if (error) throw error;
    return data || [];
  }

  static async updateStatus(id: string, status: EmailCampaign['status'], metadata?: Record<string, any>): Promise<void> {
    const updates: any = { status };
    
    if (status === 'sent' || status === 'delivered') {
      updates.sent_at = new Date().toISOString();
    } else if (status === 'opened') {
      updates.opened_at = new Date().toISOString();
    } else if (status === 'clicked') {
      updates.clicked_at = new Date().toISOString();
    }
    
    if (metadata) {
      updates.error_message = metadata.error;
    }
    
    const { error } = await supabase
      .from('email_campaigns')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  }

  static async getByNewsletter(newsletterId: string): Promise<EmailCampaign[]> {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('newsletter_id', newsletterId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getCampaignStats(newsletterId: string): Promise<{
    total: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    failed: number;
  }> {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('status')
      .eq('newsletter_id', newsletterId);
    
    if (error) throw error;
    
    const stats = {
      total: data?.length || 0,
      sent: data?.filter(c => c.status === 'sent').length || 0,
      delivered: data?.filter(c => c.status === 'delivered').length || 0,
      opened: data?.filter(c => c.status === 'opened').length || 0,
      clicked: data?.filter(c => c.status === 'clicked').length || 0,
      bounced: data?.filter(c => c.status === 'bounced').length || 0,
      failed: data?.filter(c => c.status === 'failed').length || 0,
    };
    
    return stats;
  }
}

// Utility functions
export const replaceTemplateVariables = (content: string, variables: Record<string, string>): string => {
  let result = content;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    result = result.replace(regex, value);
  });
  return result;
};

export const validateEmailAddress = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateUnsubscribeLink = (recipientId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/unsubscribe/${recipientId}`;
};

export const trackEmailOpen = async (campaignId: string): Promise<void> => {
  await EmailCampaignService.updateStatus(campaignId, 'opened');
};

export const trackEmailClick = async (campaignId: string): Promise<void> => {
  await EmailCampaignService.updateStatus(campaignId, 'clicked');
};