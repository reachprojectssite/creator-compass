-- Migration Script: Update existing database from email-based to username-based authentication
-- Run this in your Supabase SQL editor AFTER backing up your data

-- Step 1: Add username column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50);

-- Step 2: Add username constraints (with proper error handling)
DO $$
BEGIN
    -- Add username check constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_username_check'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_username_check 
        CHECK (username ~ '^[a-zA-Z0-9]{4,50}$');
    END IF;
    
    -- Add unique constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_username_unique'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_username_unique 
        UNIQUE (username);
    END IF;
END $$;

-- Step 3: Make email and password_hash optional
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Step 4: For existing users with email but no username, generate usernames
-- This will create usernames from existing emails
UPDATE users 
SET username = CASE 
  WHEN email IS NOT NULL AND username IS NULL THEN
    CASE 
      WHEN LENGTH(SPLIT_PART(email, '@', 1)) >= 4 THEN SPLIT_PART(email, '@', 1)
      ELSE SPLIT_PART(email, '@', 1) || '123'
    END
  ELSE username
END
WHERE email IS NOT NULL AND username IS NULL;

-- Step 5: Handle duplicate usernames by adding numbers
-- This is a simple approach - you might want to review and customize usernames manually
DO $$
DECLARE
  user_record RECORD;
  counter INTEGER;
  new_username VARCHAR(50);
BEGIN
  FOR user_record IN 
    SELECT id, username, email 
    FROM users 
    WHERE username IS NOT NULL
  LOOP
    counter := 1;
    new_username := user_record.username;
    
    -- Keep trying until we find a unique username
    WHILE EXISTS(SELECT 1 FROM users WHERE username = new_username AND id != user_record.id) LOOP
      new_username := user_record.username || counter::TEXT;
      counter := counter + 1;
      
      -- Prevent infinite loop
      IF counter > 1000 THEN
        new_username := user_record.username || '_' || EXTRACT(EPOCH FROM NOW())::INTEGER;
        EXIT;
      END IF;
    END LOOP;
    
    -- Update the username if it changed
    IF new_username != user_record.username THEN
      UPDATE users SET username = new_username WHERE id = user_record.id;
    END IF;
  END LOOP;
END $$;

-- Step 6: Handle users without proper authentication data
-- For users with email but no password_hash, create a placeholder password_hash
-- For users without email or username, create a placeholder username
UPDATE users 
SET 
  password_hash = CASE 
    WHEN password_hash IS NULL AND email IS NOT NULL THEN 'placeholder_hash_' || id::text
    ELSE password_hash
  END,
  username = CASE 
    WHEN username IS NULL THEN 'user_' || id::text
    ELSE username
  END
WHERE (password_hash IS NULL AND email IS NOT NULL) OR username IS NULL;

-- Step 7: Make username NOT NULL after all users have been updated
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Step 8: Add the constraint that ensures either username/password OR Google account exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'valid_auth_method'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT valid_auth_method CHECK (
            (password_hash IS NOT NULL AND username IS NOT NULL) OR 
            (google_account_id IS NOT NULL AND google_email IS NOT NULL)
        );
    END IF;
END $$;

-- Step 9: Create index on username for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Step 10: Verify the migration
SELECT 
  COUNT(*) as total_users,
  COUNT(username) as users_with_username,
  COUNT(email) as users_with_email,
  COUNT(password_hash) as users_with_password,
  COUNT(google_account_id) as users_with_google
FROM users;

-- Step 11: Show any potential issues
SELECT 
  id,
  username,
  email,
  CASE 
    WHEN password_hash IS NOT NULL AND username IS NOT NULL THEN 'Traditional Account'
    WHEN google_account_id IS NOT NULL AND google_email IS NOT NULL THEN 'Google Account'
    ELSE 'Invalid Account - Missing Required Fields'
  END as account_type
FROM users
ORDER BY created_at;

-- Step 12: Show users that need attention (users with placeholder data)
SELECT 
  id,
  username,
  email,
  CASE 
    WHEN password_hash LIKE 'placeholder_hash_%' THEN 'Needs real password'
    WHEN username LIKE 'user_%' THEN 'Needs real username'
    ELSE 'OK'
  END as needs_attention
FROM users
WHERE password_hash LIKE 'placeholder_hash_%' OR username LIKE 'user_%';
