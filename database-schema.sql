-- Email Newsletter Management System Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    html_content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('welcome', 'donation_ack', 'newsletter', 'event_reminder', 'thank_you')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Newsletters Table
CREATE TABLE IF NOT EXISTS newsletters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    html_content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
    recipients_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    tags TEXT[] DEFAULT '{}'
);

-- Email Automations Table
CREATE TABLE IF NOT EXISTS email_automations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('new_donor', 'donation_received', 'volunteer_signup', 'event_registration')),
    template_id UUID REFERENCES email_templates(id),
    is_active BOOLEAN DEFAULT true,
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Email Recipients Table
CREATE TABLE IF NOT EXISTS email_recipients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('donor', 'volunteer', 'subscriber', 'event_attendee')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tags TEXT[] DEFAULT '{}'
);

-- Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    newsletter_id UUID REFERENCES newsletters(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES email_recipients(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at);
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_email_recipients_type ON email_recipients(type);
CREATE INDEX IF NOT EXISTS idx_email_recipients_status ON email_recipients(status);
CREATE INDEX IF NOT EXISTS idx_email_recipients_email ON email_recipients(email);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_newsletter_id ON email_campaigns(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_recipient_id ON email_campaigns(recipient_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_automations_trigger_type ON email_automations(trigger_type);
CREATE INDEX IF NOT EXISTS idx_email_automations_active ON email_automations(is_active);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON newsletters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_automations_updated_at BEFORE UPDATE ON email_automations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_recipients_updated_at BEFORE UPDATE ON email_recipients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Users can view email templates" ON email_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create email templates" ON email_templates FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update own email templates" ON email_templates FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Users can delete own email templates" ON email_templates FOR DELETE TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Users can view newsletters" ON newsletters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create newsletters" ON newsletters FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update own newsletters" ON newsletters FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Users can delete own newsletters" ON newsletters FOR DELETE TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Users can view email automations" ON email_automations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create email automations" ON email_automations FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update own email automations" ON email_automations FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Users can delete own email automations" ON email_automations FOR DELETE TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Users can view email recipients" ON email_recipients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create email recipients" ON email_recipients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update email recipients" ON email_recipients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete email recipients" ON email_recipients FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view email campaigns" ON email_campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create email campaigns" ON email_campaigns FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update email campaigns" ON email_campaigns FOR UPDATE TO authenticated USING (true);

-- Insert sample data
INSERT INTO email_templates (name, subject, content, html_content, type, created_by) VALUES
('Welcome New Donor', 'Welcome to Our Nonprofit Family!', 'Dear [DONOR_NAME], Welcome to our community! We are thrilled to have you join our mission to create positive change.', '<h2>Welcome to Our Nonprofit Family!</h2><p>Dear <strong>[DONOR_NAME]</strong>,</p><p>Welcome to our community! We are thrilled to have you join our mission to create positive change.</p>', 'welcome', (SELECT id FROM auth.users LIMIT 1)),
('Donation Thank You', 'Thank you for your generous donation!', 'Dear [DONOR_NAME], Thank you so much for your generous donation of $[AMOUNT]. Your support means the world to us.', '<h2>Thank You for Your Generous Donation!</h2><p>Dear <strong>[DONOR_NAME]</strong>,</p><p>Thank you so much for your generous donation of <strong>$[AMOUNT]</strong>.</p>', 'donation_ack', (SELECT id FROM auth.users LIMIT 1)),
('Event Reminder', 'Don''t Forget - [EVENT_NAME] is Tomorrow!', 'Hello [NAME], This is a friendly reminder about [EVENT_NAME] happening tomorrow at [TIME].', '<h2>Event Reminder: [EVENT_NAME]</h2><p>Hello <strong>[NAME]</strong>,</p><p>This is a friendly reminder about <strong>[EVENT_NAME]</strong> happening tomorrow!</p>', 'event_reminder', (SELECT id FROM auth.users LIMIT 1));

INSERT INTO email_recipients (email, name, type) VALUES
('donor1@example.com', 'John Doe', 'donor'),
('volunteer1@example.com', 'Jane Smith', 'volunteer'),
('subscriber1@example.com', 'Bob Johnson', 'subscriber'),
('attendee1@example.com', 'Alice Brown', 'event_attendee');

-- Views for analytics
CREATE OR REPLACE VIEW newsletter_analytics AS
SELECT 
    n.id,
    n.title,
    n.status,
    n.recipients_count,
    n.opened_count,
    n.clicked_count,
    n.created_at,
    n.sent_at,
    CASE 
        WHEN n.recipients_count > 0 THEN ROUND((n.opened_count::numeric / n.recipients_count::numeric) * 100, 2)
        ELSE 0
    END as open_rate,
    CASE 
        WHEN n.recipients_count > 0 THEN ROUND((n.clicked_count::numeric / n.recipients_count::numeric) * 100, 2)
        ELSE 0
    END as click_rate
FROM newsletters n;

-- Function to get campaign statistics
CREATE OR REPLACE FUNCTION get_campaign_stats(newsletter_uuid UUID)
RETURNS TABLE (
    status VARCHAR(50),
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT ec.status, COUNT(*)
    FROM email_campaigns ec
    WHERE ec.newsletter_id = newsletter_uuid
    GROUP BY ec.status;
END;
$$ LANGUAGE plpgsql;

-- Function to track email opens
CREATE OR REPLACE FUNCTION track_email_open(campaign_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE email_campaigns 
    SET status = 'opened', opened_at = NOW()
    WHERE id = campaign_uuid AND status IN ('sent', 'delivered');
    
    -- Update newsletter open count
    UPDATE newsletters
    SET opened_count = opened_count + 1
    WHERE id = (SELECT newsletter_id FROM email_campaigns WHERE id = campaign_uuid);
END;
$$ LANGUAGE plpgsql;

-- Function to track email clicks
CREATE OR REPLACE FUNCTION track_email_click(campaign_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE email_campaigns 
    SET status = 'clicked', clicked_at = NOW()
    WHERE id = campaign_uuid AND status IN ('sent', 'delivered', 'opened');
    
    -- Update newsletter click count
    UPDATE newsletters
    SET clicked_count = clicked_count + 1
    WHERE id = (SELECT newsletter_id FROM email_campaigns WHERE id = campaign_uuid);
END;
$$ LANGUAGE plpgsql;