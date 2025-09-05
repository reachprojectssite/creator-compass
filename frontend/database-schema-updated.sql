-- Creator Webinars Database Schema - Updated for Username-based Authentication
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - Updated for username-based authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL CHECK (username ~ '^[a-zA-Z0-9]{4,50}$'),
  email VARCHAR(255), -- Made optional since we now use username as primary identifier
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255), -- Made optional for Google OAuth users
  user_type VARCHAR(50) DEFAULT 'consumer' CHECK (user_type IN ('consumer', 'speaker', 'employee')),
  university VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  profile_image_url TEXT,
  bio TEXT,
  interests TEXT[],
  -- Google Integration fields
  google_account_id VARCHAR(255),
  google_email VARCHAR(255),
  google_verified BOOLEAN DEFAULT FALSE,
  google_access_token TEXT,
  google_refresh_token TEXT,
  -- Ensure either username/password OR Google account exists
  CONSTRAINT valid_auth_method CHECK (
    (password_hash IS NOT NULL AND username IS NOT NULL) OR 
    (google_account_id IS NOT NULL AND google_email IS NOT NULL)
  )
);

-- Webinars table
CREATE TABLE webinars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  category VARCHAR(100),
  max_participants INTEGER,
  meeting_link TEXT,
  recording_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Google Integration fields
  google_calendar_event_id VARCHAR(255),
  meeting_settings JSONB
);

-- User-Webinar relationships (registrations, attendance)
CREATE TABLE user_webinars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'completed')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attended_at TIMESTAMP WITH TIME ZONE,
  watch_time_minutes INTEGER DEFAULT 0,
  UNIQUE(user_id, webinar_id)
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(50) DEFAULT 'one_time' CHECK (task_type IN ('daily', 'one_time')),
  exp_reward INTEGER DEFAULT 1,
  is_repeatable BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-Task completion tracking
CREATE TABLE user_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exp_earned INTEGER DEFAULT 0
);

-- Google Integration indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_google_account_id ON users(google_account_id);
CREATE INDEX IF NOT EXISTS idx_users_google_email ON users(google_email);
CREATE INDEX IF NOT EXISTS idx_webinars_google_calendar_event_id ON webinars(google_calendar_event_id);

-- User experience and levels
CREATE TABLE user_exp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  total_exp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  exp_to_next_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table for custom authentication
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  requirement_type VARCHAR(100),
  requirement_value INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Friends system
CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Friend requests
CREATE TABLE friend_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(from_user_id, to_user_id),
  CHECK (from_user_id != to_user_id)
);

-- Communities (for future use)
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User communities
CREATE TABLE user_communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, community_id)
);

-- Resources
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  file_url TEXT,
  file_size INTEGER,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  consent_events BOOLEAN DEFAULT FALSE,
  consent_newsletter BOOLEAN DEFAULT FALSE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Reports system
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id),
  reported_user_id UUID REFERENCES users(id),
  reported_webinar_id UUID REFERENCES webinars(id),
  reported_community_id UUID REFERENCES communities(id),
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('user', 'webinar', 'community')),
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tasks
INSERT INTO tasks (title, description, task_type, exp_reward, is_repeatable) VALUES
('Attend a webinar', 'Join and watch a webinar for at least 10 minutes', 'daily', 2, true),
('Complete daily check-in', 'Visit the dashboard and check your progress', 'daily', 1, true),
('Send a message', 'Send a message in any chat or community', 'daily', 1, true),
('Join a community', 'Become a member of a community', 'one_time', 5, false),
('Make your first friend', 'Send and have accepted a friend request', 'one_time', 10, false),
('Attend 5 webinars', 'Complete 5 webinars', 'one_time', 15, false),
('Reach level 5', 'Gain enough experience to reach level 5', 'one_time', 20, false),
('Download a resource', 'Download a resource from the resources page', 'daily', 1, true),
('Profile completion', 'Complete your profile with bio and interests', 'one_time', 5, false),
('First week streak', 'Visit the platform for 7 consecutive days', 'one_time', 25, false);

-- Insert default badges
INSERT INTO badges (name, description, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first task', 'tasks_completed', 1),
('Webinar Enthusiast', 'Attend 5 webinars', 'webinars_attended', 5),
('Social Butterfly', 'Make 10 friends', 'friends_count', 10),
('Level Up', 'Reach level 10', 'level', 10),
('Daily Grinder', 'Complete 30 daily tasks', 'daily_tasks_completed', 30),
('Resource Hunter', 'Download 10 resources', 'resources_downloaded', 10),
('Community Member', 'Join 3 communities', 'communities_joined', 3),
('Chat Master', 'Send 100 messages', 'messages_sent', 100);

-- Create indexes for better performance
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_webinars_date ON webinars(date);
CREATE INDEX idx_webinars_status ON webinars(status);
CREATE INDEX idx_user_webinars_user_id ON user_webinars(user_id);
CREATE INDEX idx_user_webinars_webinar_id ON user_webinars(webinar_id);
CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_completed_at ON user_tasks(completed_at);
CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_friend_requests_to_user_id ON friend_requests(to_user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webinars_updated_at BEFORE UPDATE ON webinars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_exp_updated_at BEFORE UPDATE ON user_exp FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migration script to update existing database (run this if you have existing data)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50);
-- ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS users_username_check CHECK (username ~ '^[a-zA-Z0-9]{4,50}$');
-- ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS users_username_unique UNIQUE (username);
-- ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
-- ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
-- ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS valid_auth_method CHECK (
--   (password_hash IS NOT NULL AND username IS NOT NULL) OR 
--   (google_account_id IS NOT NULL AND google_email IS NOT NULL)
-- );
