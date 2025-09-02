-- Webinar System Database Migration (UUID Compatible)
-- This migration creates all necessary tables for the upcoming webinars functionality
-- Compatible with existing UUID-based users table

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories table for webinar categorization
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    color VARCHAR(7) DEFAULT '#f59e0b', -- amber-500 default
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Webinars table (enhanced from existing, using UUIDs)
CREATE TABLE IF NOT EXISTS webinars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    long_description TEXT,
    category_id UUID REFERENCES categories(id),
    host_id UUID REFERENCES users(id) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
    
    -- Scheduling
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    timezone VARCHAR(50) DEFAULT 'America/Los_Angeles',
    duration_minutes INTEGER DEFAULT 60,
    
    -- Capacity and registration
    max_participants INTEGER,
    current_registrants INTEGER DEFAULT 0,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Meeting details
    meeting_link VARCHAR(500),
    meeting_platform VARCHAR(50) DEFAULT 'google_meet',
    
    -- Location (for in-person or hybrid)
    location_type VARCHAR(20) DEFAULT 'virtual' CHECK (location_type IN ('virtual', 'in_person', 'hybrid')),
    location_address TEXT,
    
    -- Metadata
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- 3. Webinar speakers (many-to-many relationship)
CREATE TABLE IF NOT EXISTS webinar_speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    speaker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'Speaker', -- e.g., 'Host', 'Co-host', 'Guest Speaker'
    is_primary_speaker BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(webinar_id, speaker_id)
);

-- 4. User webinar registrations (enhanced from existing)
CREATE TABLE IF NOT EXISTS user_webinars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
    attended_at TIMESTAMP WITH TIME ZONE,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, webinar_id)
);

-- 5. Webinar analytics (for tracking engagement)
CREATE TABLE IF NOT EXISTS webinar_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    total_registrations INTEGER DEFAULT 0,
    total_attendees INTEGER DEFAULT 0,
    average_attendance_duration INTEGER, -- in minutes
    peak_attendees INTEGER DEFAULT 0,
    engagement_score DECIMAL(3,2), -- 0.00 to 1.00
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_webinars_status ON webinars(status);
CREATE INDEX IF NOT EXISTS idx_webinars_scheduled_date ON webinars(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_webinars_host_id ON webinars(host_id);
CREATE INDEX IF NOT EXISTS idx_webinars_category_id ON webinars(category_id);
CREATE INDEX IF NOT EXISTS idx_webinars_featured ON webinars(is_featured);
CREATE INDEX IF NOT EXISTS idx_webinars_public ON webinars(is_public);

CREATE INDEX IF NOT EXISTS idx_user_webinars_user_id ON user_webinars(user_id);
CREATE INDEX IF NOT EXISTS idx_user_webinars_webinar_id ON user_webinars(webinar_id);
CREATE INDEX IF NOT EXISTS idx_user_webinars_status ON user_webinars(status);

CREATE INDEX IF NOT EXISTS idx_webinar_speakers_webinar_id ON webinar_speakers(webinar_id);
CREATE INDEX IF NOT EXISTS idx_webinar_speakers_speaker_id ON webinar_speakers(speaker_id);

-- Insert default categories
INSERT INTO categories (name, description, icon_name, color) VALUES
    ('Content Creation', 'Learn content creation strategies and techniques', 'FileText', '#f59e0b'),
    ('Monetization', 'Discover ways to monetize your content and skills', 'DollarSign', '#10b981'),
    ('Marketing', 'Marketing strategies for creators', 'BarChart3', '#3b82f6'),
    ('Technology', 'Tech tools and platforms for creators', 'Laptop', '#8b5cf6'),
    ('Strategy', 'Strategic planning and business development', 'Target', '#ef4444'),
    ('Growth', 'Scaling and growing your creator business', 'TrendingUp', '#06b6d4')
ON CONFLICT (name) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_webinars_updated_at BEFORE UPDATE ON webinars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webinar_analytics_updated_at BEFORE UPDATE ON webinar_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to update current_registrants count
CREATE OR REPLACE FUNCTION update_webinar_registrants()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE webinars 
        SET current_registrants = current_registrants + 1
        WHERE id = NEW.webinar_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE webinars 
        SET current_registrants = current_registrants - 1
        WHERE id = OLD.webinar_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update registrant count
CREATE TRIGGER update_webinar_registrants_count
    AFTER INSERT OR DELETE ON user_webinars
    FOR EACH ROW EXECUTE FUNCTION update_webinar_registrants();

-- Add RLS policies for security
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_analytics ENABLE ROW LEVEL SECURITY;

-- Webinars: Users can view public webinars, hosts can manage their own
CREATE POLICY "Users can view public webinars" ON webinars
    FOR SELECT USING (is_public = true OR host_id = auth.uid());

CREATE POLICY "Hosts can manage their webinars" ON webinars
    FOR ALL USING (host_id = auth.uid());

-- User webinars: Users can view their own registrations
CREATE POLICY "Users can view their registrations" ON user_webinars
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their registrations" ON user_webinars
    FOR ALL USING (user_id = auth.uid());

-- Webinar speakers: Public read access, hosts can manage
CREATE POLICY "Public can view webinar speakers" ON webinar_speakers
    FOR SELECT USING (true);

CREATE POLICY "Hosts can manage webinar speakers" ON webinar_speakers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM webinars 
            WHERE id = webinar_speakers.webinar_id 
            AND host_id = auth.uid()
        )
    );

-- Analytics: Only hosts can view their webinar analytics
CREATE POLICY "Hosts can view their analytics" ON webinar_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM webinars 
            WHERE id = webinar_analytics.webinar_id 
            AND host_id = auth.uid()
        )
    );

-- Grant necessary permissions
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON webinars TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_webinars TO authenticated;
GRANT SELECT ON webinar_speakers TO authenticated;
GRANT SELECT ON webinar_analytics TO authenticated;

-- Grant additional permissions to hosts (will be handled by RLS)
GRANT ALL ON webinars TO authenticated;
GRANT ALL ON webinar_speakers TO authenticated;
GRANT ALL ON webinar_analytics TO authenticated;
