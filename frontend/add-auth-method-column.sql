-- Add auth_method column to users table for security
-- This column tracks how users authenticate: 'email' for traditional, 'oauth' for Google OAuth

-- Add the column (safe - won't fail if exists)
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_method VARCHAR(20) DEFAULT 'email';

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

-- Add constraint to ensure valid auth_method values (safe - won't fail if exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_auth_method' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT check_auth_method 
        CHECK (auth_method IN ('email', 'oauth'));
    END IF;
END $$;

-- Add index for faster auth_method lookups (safe - won't fail if exists)
CREATE INDEX IF NOT EXISTS idx_users_auth_method ON users(auth_method);

-- Add index for email + auth_method lookups (safe - won't fail if exists)
CREATE INDEX IF NOT EXISTS idx_users_email_auth_method ON users(email, auth_method);
