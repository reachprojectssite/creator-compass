-- Check if auth_method column exists and add it if missing
-- This script will safely add the auth_method column to the users table

-- First, check if the column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'auth_method'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE users ADD COLUMN auth_method VARCHAR(20) DEFAULT 'email';
        
        -- Update existing users to have proper auth_method
        -- Traditional users (with proper password hashes) get 'email'
        -- OAuth users (with google_oauth_user placeholder) get 'oauth'
        UPDATE users 
        SET auth_method = 'oauth' 
        WHERE password_hash = 'google_oauth_user';
        
        -- Set default for remaining users
        UPDATE users 
        SET auth_method = 'email' 
        WHERE auth_method IS NULL;
        
        RAISE NOTICE 'auth_method column added and existing users updated';
    ELSE
        RAISE NOTICE 'auth_method column already exists';
    END IF;
END $$;

-- Show current state of users table
SELECT 
    email, 
    auth_method, 
    CASE 
        WHEN password_hash = 'google_oauth_user' THEN 'OAuth User'
        ELSE 'Traditional User'
    END as user_type
FROM users 
ORDER BY email;
