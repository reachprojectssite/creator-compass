-- COMPLETE USER DATA WIPE SCRIPT
-- This will delete ALL user-related data and reset the database to a clean state
-- WARNING: This is irreversible! All user data will be permanently deleted

-- Disable foreign key checks temporarily to avoid constraint issues
SET session_replication_role = replica;

-- Delete all user-related data in the correct order (child tables first)

-- 1. User sessions (child of users)
DELETE FROM user_sessions;

-- 2. User experience/levels (child of users)
DELETE FROM user_exp;

-- 3. User webinar relationships (child of users and webinars)
DELETE FROM user_webinars;

-- 4. User tasks (child of users)
DELETE FROM user_tasks;

-- 5. Newsletter subscribers (related to users by email)
DELETE FROM newsletter_subscribers;

-- 6. Webinars (created by users)
DELETE FROM webinars;

-- 7. Tasks (created by users)
DELETE FROM tasks;

-- 8. Finally, delete all users
DELETE FROM users;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Reset auto-increment sequences (if any)
-- Note: This is PostgreSQL specific - if using MySQL, use ALTER TABLE ... AUTO_INCREMENT = 1
-- For PostgreSQL, sequences are typically named table_name_id_seq
-- For now, we'll just delete the data and let new users get new IDs

-- Verify the wipe was successful
SELECT 
    'users' as table_name, COUNT(*) as remaining_records FROM users
UNION ALL
SELECT 'user_sessions', COUNT(*) FROM user_sessions
UNION ALL
SELECT 'user_exp', COUNT(*) FROM user_exp
UNION ALL
SELECT 'user_webinars', COUNT(*) FROM user_webinars
UNION ALL
SELECT 'user_tasks', COUNT(*) FROM user_tasks
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'webinars', COUNT(*) FROM webinars
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks;

-- All counts should be 0 if the wipe was successful
