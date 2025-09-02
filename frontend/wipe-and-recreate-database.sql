-- Wipe and Recreate Database Script
-- Run this in your Supabase SQL Editor to reset your database

-- Drop all existing tables (if they exist)
DROP TABLE IF EXISTS user_webinars CASCADE;
DROP TABLE IF EXISTS user_tasks CASCADE;
DROP TABLE IF EXISTS user_exp CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS webinars CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with Google integration
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
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
  google_refresh_token TEXT
);

-- Webinars table with Google integration
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

-- Google Integration indexes
CREATE INDEX IF NOT EXISTS idx_users_google_account_id ON users(google_account_id);
CREATE INDEX IF NOT EXISTS idx_users_google_email ON users(google_email);
CREATE INDEX IF NOT EXISTS idx_webinars_google_calendar_event_id ON webinars(google_calendar_event_id);

-- Insert some sample data
INSERT INTO users (email, full_name, password_hash, user_type, university) VALUES
('admin@creatorwebinars.com', 'Admin User', 'hashed_password_here', 'employee', 'Creator Webinars'),
('demo@example.com', 'Demo User', 'hashed_password_here', 'consumer', 'Demo University');

-- Insert sample tasks
INSERT INTO tasks (title, description, task_type, exp_reward) VALUES
('Complete Profile', 'Fill out your profile information', 'one_time', 10),
('Join First Webinar', 'Attend your first webinar session', 'one_time', 25),
('Daily Login', 'Log in to the platform', 'daily', 5),
('Share Webinar', 'Share a webinar with friends', 'one_time', 15);

-- Insert sample webinars
INSERT INTO webinars (title, description, date, time, category, created_by) VALUES
('Getting Started with Content Creation', 'Learn the basics of content creation and building your audience', '2025-01-15', '14:00:00', 'Content Creation', (SELECT id FROM users WHERE email = 'admin@creatorwebinars.com')),
('Advanced Marketing Strategies', 'Deep dive into advanced marketing techniques for creators', '2025-01-20', '16:00:00', 'Marketing', (SELECT id FROM users WHERE email = 'admin@creatorwebinars.com'));

-- Create user experience records
INSERT INTO user_exp (user_id, total_exp, current_level) 
SELECT id, 0, 1 FROM users;

-- Disable RLS for development (enable later for production)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE webinars DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_webinars DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_exp DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'Database successfully recreated with Google integration support!' as message;
