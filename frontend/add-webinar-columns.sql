-- Add missing columns to webinars table if they don't exist
-- This script ensures the webinars table has the necessary columns

-- Add scheduled_date column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'scheduled_date') THEN
        ALTER TABLE webinars ADD COLUMN scheduled_date DATE;
    END IF;
END $$;

-- Add scheduled_time column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'scheduled_time') THEN
        ALTER TABLE webinars ADD COLUMN scheduled_time TIME;
    END IF;
END $$;

-- Add timezone column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'timezone') THEN
        ALTER TABLE webinars ADD COLUMN timezone VARCHAR(50) DEFAULT 'UTC';
    END IF;
END $$;

-- Add duration_minutes column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'duration_minutes') THEN
        ALTER TABLE webinars ADD COLUMN duration_minutes INTEGER DEFAULT 60;
    END IF;
END $$;

-- Add created_by column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'created_by') THEN
        ALTER TABLE webinars ADD COLUMN created_by UUID REFERENCES users(id);
    END IF;
END $$;
