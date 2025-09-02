import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logging
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key length:', supabaseAnonKey ? supabaseAnonKey.length : 'undefined')
console.log('Supabase Anon Key starts with:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'undefined')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table schemas
export const TABLES = {
  USERS: 'users',
  WEBINARS: 'webinars',
  USER_WEBINARS: 'user_webinars',
  TASKS: 'tasks',
  USER_TASKS: 'user_tasks',
  USER_EXP: 'user_exp',
  BADGES: 'badges',
  USER_BADGES: 'user_badges',
  FRIENDS: 'friends',
  FRIEND_REQUESTS: 'friend_requests',
  COMMUNITIES: 'communities',
  USER_COMMUNITIES: 'user_communities',
  RESOURCES: 'resources',
  NEWSLETTER_SUBSCRIBERS: 'newsletter_subscribers',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications'
}

// User types
export const USER_TYPES = {
  CONSUMER: 'consumer',
  SPEAKER: 'speaker',
  EMPLOYEE: 'employee'
}

// Task types
export const TASK_TYPES = {
  DAILY: 'daily',
  ONE_TIME: 'one_time'
}

// Webinar status
export const WEBINAR_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  COMPLETED: 'completed'
}
