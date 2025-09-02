-- Sample Data Insertion Script for Webinar System
-- This script populates the database with sample webinars using only existing columns

-- Insert sample webinars (using only columns that definitely exist)
INSERT INTO webinars (
    title,
    description,
    status,
    category,
    max_participants,
    meeting_link
) VALUES
(
    'Monetizing Your Content: Strategies for 2025',
    'Join industry experts to learn the latest strategies for monetizing your creative work. This comprehensive webinar will cover multiple revenue streams, platform-specific opportunities, and practical steps you can take immediately to increase your income as a creator.',
    'upcoming',
    'Monetization',
    200,
    'https://meet.google.com/sample-link'
),
(
    'Content Creation Masterclass: From Idea to Execution',
    'Learn the fundamentals of creating engaging content that resonates with your audience. This masterclass covers everything from ideation to execution.',
    'upcoming',
    'Content Creation',
    150,
    'https://meet.google.com/content-masterclass'
),
(
    'Social Media Marketing for Creators',
    'Discover effective social media strategies to grow your audience and increase engagement. Learn proven techniques specifically designed for creators.',
    'upcoming',
    'Marketing',
    100,
    'https://meet.google.com/social-media-marketing'
),
(
    'Tech Tools Every Creator Should Know',
    'Explore the latest technology tools and platforms that can streamline your creative workflow. Stay ahead of the curve with this comprehensive overview.',
    'upcoming',
    'Technology',
    120,
    'https://meet.google.com/tech-tools'
),
(
    'Building Your Personal Brand as a Creator',
    'Learn how to develop and maintain a strong personal brand that sets you apart. Your personal brand is your most valuable asset as a creator.',
    'upcoming',
    'Strategy',
    80,
    'https://meet.google.com/personal-branding'
),
(
    'Scaling Your Creator Business',
    'Discover strategies for growing your creator business from a hobby to a sustainable income. Ready to take your creator business to the next level?',
    'upcoming',
    'Growth',
    150,
    'https://meet.google.com/scaling-business'
)
ON CONFLICT DO NOTHING;

-- Insert some sample registrations (assuming we have users)
INSERT INTO user_webinars (user_id, webinar_id, status, registered_at)
SELECT 
    u.id,
    w.id,
    'registered',
    NOW() - INTERVAL '1 day' * (RANDOM() * 30)::integer
FROM users u
CROSS JOIN LATERAL (
    SELECT id FROM webinars 
    WHERE status = 'upcoming'
    ORDER BY RANDOM()
    LIMIT 2
) w
WHERE u.user_type = 'consumer'
ON CONFLICT DO NOTHING;
