-- Sample webinars for September to December 2025
-- These webinars will show as "upcoming" and populate the dashboard

-- Insert sample webinars
INSERT INTO webinars (
  id,
  title,
  description,
  scheduled_date,
  scheduled_time,
  timezone,
  duration_minutes,
  status,
  category,
  max_participants,
  meeting_link,
  created_by,
  created_at,
  updated_at
) VALUES 
-- September 2025
(
  uuid_generate_v4(),
  'Content Creation Masterclass: Building Your Brand',
  'Learn advanced content creation strategies to build a strong personal brand. This comprehensive session covers storytelling, visual design, and audience engagement techniques that will help you stand out in the crowded creator space.',
  '2025-09-15',
  '14:00:00',
  'America/Los_Angeles',
  90,
  'upcoming',
  'Content Creation',
  150,
  'https://meet.google.com/abc-defg-hij',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Monetization Strategies for 2025',
  'Discover the latest monetization methods including subscription models, affiliate marketing, sponsored content, and emerging Web3 opportunities. Real case studies and actionable strategies.',
  '2025-09-22',
  '10:00:00',
  'America/Los_Angeles',
  75,
  'upcoming',
  'Monetization',
  200,
  'https://meet.google.com/xyz-uvw-123',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Social Media Growth Hacking',
  'Advanced techniques for rapid audience growth across all social platforms. Learn algorithm optimization, viral content strategies, and community building methods.',
  '2025-09-29',
  '16:00:00',
  'America/Los_Angeles',
  60,
  'upcoming',
  'Marketing',
  180,
  'https://meet.google.com/def-ghi-jkl',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),

-- October 2025
(
  uuid_generate_v4(),
  'Video Production Excellence',
  'Master professional video production techniques on any budget. From lighting and audio to editing and post-production, this session covers everything you need to create high-quality content.',
  '2025-10-06',
  '13:00:00',
  'America/Los_Angeles',
  90,
  'upcoming',
  'Content Creation',
  120,
  'https://meet.google.com/mno-pqr-stu',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Creator Economy Trends 2025',
  'Stay ahead of the curve with insights into emerging creator economy trends. We''ll explore new platforms, monetization opportunities, and industry shifts that will impact creators.',
  '2025-10-13',
  '11:00:00',
  'America/Los_Angeles',
  75,
  'upcoming',
  'Strategy',
  250,
  'https://meet.google.com/vwx-yz1-234',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Email Marketing for Creators',
  'Build and monetize your email list effectively. Learn email marketing strategies, automation, and conversion techniques specifically designed for content creators.',
  '2025-10-20',
  '15:00:00',
  'America/Los_Angeles',
  60,
  'upcoming',
  'Marketing',
  100,
  'https://meet.google.com/567-890-abc',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Podcasting Success Blueprint',
  'Launch and grow a successful podcast from scratch. Covering equipment, content strategy, distribution, and monetization strategies for podcasters.',
  '2025-10-27',
  '12:00:00',
  'America/Los_Angeles',
  90,
  'upcoming',
  'Content Creation',
  80,
  'https://meet.google.com/def-ghi-jkl',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),

-- November 2025
(
  uuid_generate_v4(),
  'AI Tools for Content Creators',
  'Explore cutting-edge AI tools that can enhance your content creation workflow. From writing assistance to video editing, discover how AI can save time and improve quality.',
  '2025-11-03',
  '14:00:00',
  'America/Los_Angeles',
  75,
  'upcoming',
  'Technology',
  300,
  'https://meet.google.com/mno-pqr-stu',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Building Multiple Revenue Streams',
  'Diversify your income as a creator with multiple revenue streams. Learn how to balance different income sources while maintaining content quality and audience trust.',
  '2025-11-10',
  '10:00:00',
  'America/Los_Angeles',
  90,
  'upcoming',
  'Monetization',
  150,
  'https://meet.google.com/vwx-yz1-234',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Community Building Masterclass',
  'Build and nurture a loyal community around your brand. Learn engagement strategies, community management tools, and how to turn followers into advocates.',
  '2025-11-17',
  '16:00:00',
  'America/Los_Angeles',
  60,
  'upcoming',
  'Marketing',
  120,
  'https://meet.google.com/567-890-abc',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Creator Brand Partnerships',
  'Navigate brand partnerships successfully. Learn how to pitch to brands, negotiate fair deals, and maintain authenticity while working with sponsors.',
  '2025-11-24',
  '13:00:00',
  'America/Los_Angeles',
  75,
  'upcoming',
  'Monetization',
  100,
  'https://meet.google.com/def-ghi-jkl',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),

-- December 2025
(
  uuid_generate_v4(),
  'Year-End Content Strategy',
  'Plan your content strategy for the new year. Learn how to analyze your performance, set goals, and create a content calendar that drives growth.',
  '2025-12-01',
  '11:00:00',
  'America/Los_Angeles',
  90,
  'upcoming',
  'Strategy',
  200,
  'https://meet.google.com/mno-pqr-stu',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Holiday Content Marketing',
  'Capitalize on holiday seasons with effective content marketing strategies. Learn how to create seasonal content that resonates with your audience.',
  '2025-12-08',
  '15:00:00',
  'America/Los_Angeles',
  60,
  'upcoming',
  'Marketing',
  150,
  'https://meet.google.com/vwx-yz1-234',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Creator Tax and Finance Basics',
  'Essential financial knowledge for creators. Learn about tax obligations, business structure, expense tracking, and financial planning for content creators.',
  '2025-12-15',
  '12:00:00',
  'America/Los_Angeles',
  75,
  'upcoming',
  'Business',
  80,
  'https://meet.google.com/567-890-abc',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'New Year Creator Goals Workshop',
  'Set and achieve your creator goals for 2026. Interactive workshop covering goal setting, milestone planning, and accountability strategies.',
  '2025-12-22',
  '14:00:00',
  'America/Los_Angeles',
  90,
  'upcoming',
  'Strategy',
  120,
  'https://meet.google.com/def-ghi-jkl',
  (SELECT id FROM users LIMIT 1),
  NOW(),
  NOW()
);

-- Add some sample registrations for the current user (replace with actual user ID)
-- Uncomment and modify the user_id below to add registrations for a specific user
/*
INSERT INTO user_webinars (
  user_id,
  webinar_id,
  status,
  registered_at
) 
SELECT 
  'YOUR_USER_ID_HERE', -- Replace with actual user ID
  id,
  'registered',
  NOW()
FROM webinars 
WHERE status = 'upcoming' 
AND scheduled_date >= CURRENT_DATE
LIMIT 3;
*/
