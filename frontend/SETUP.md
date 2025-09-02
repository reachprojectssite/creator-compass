# Creator Webinars Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account and project created

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Copy and paste the contents of `database-schema.sql` into the editor
4. Run the SQL to create all tables and initial data

### 3. Environment Configuration
Create a `.env.local` file in the frontend directory with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under "API".

### 4. Run the Application
```bash
npm run dev
```

## Database Tables Created

- **users**: User accounts (Consumer, Speaker, Employee)
- **webinars**: Webinar events and sessions
- **user_webinars**: User registrations and attendance
- **tasks**: Daily and one-time tasks
- **user_tasks**: Task completion tracking
- **user_exp**: Experience and leveling system
- **badges**: Achievement badges
- **user_badges**: User badge assignments
- **friends**: Friend relationships
- **friend_requests**: Friend request system
- **communities**: Community groups (future feature)
- **resources**: Downloadable resources
- **newsletter_subscribers**: Newsletter subscriptions
- **reports**: User reporting system
- **notifications**: User notifications

## Features Implemented

### Authentication System
- User registration with email/password
- Login/logout functionality
- Password hashing with bcrypt
- Session management

### Experience System
- Fibonacci-based leveling system
- Experience from tasks and webinars
- Level-up notifications

### Task System
- Daily quests that reset daily
- One-time achievements
- Experience rewards
- Progress tracking

### Webinar Management
- User registration for webinars
- Attendance tracking
- Watch time monitoring
- Experience rewards for participation

## Next Steps

1. **Install Dependencies**: Run `npm install` to get Supabase and bcrypt
2. **Set up Supabase**: Create project and run the SQL schema
3. **Configure Environment**: Add your Supabase credentials
4. **Test Features**: Start with registration and login
5. **Customize**: Modify the UI and add more features as needed

## Security Notes

- Passwords are hashed using bcrypt with 12 salt rounds
- User authentication is handled through Supabase Auth
- Database queries use parameterized queries to prevent SQL injection
- User permissions are enforced at the database level

## Support

For issues or questions, check the Supabase documentation or create an issue in the project repository.
