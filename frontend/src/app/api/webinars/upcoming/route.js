import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 50;

    console.log('Upcoming webinars API called with:', { userId, category, search, limit });

         // Build the query
     let query = supabase
       .from('webinars')
       .select(`
         *,
         user_webinars (
           user_id,
           status
         )
       `)
       .eq('status', 'upcoming')
       .gte('scheduled_date', new Date().toISOString().split('T')[0])
       .order('scheduled_date', { ascending: true })
       .order('scheduled_time', { ascending: true })
       .limit(limit);

    // Add category filter
    if (category) {
      query = query.eq('categories.name', category);
    }

    // Add search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: webinars, error } = await query;

    if (error) throw error;

         // Transform the data to match the frontend expectations
     const transformedWebinars = webinars.map(webinar => {
       // Calculate days left
       const today = new Date();
       const webinarDate = new Date(webinar.scheduled_date);
       const daysLeft = Math.ceil((webinarDate - today) / (1000 * 60 * 60 * 24));

       return {
         id: webinar.id,
         title: webinar.title,
         description: webinar.description,
         longDescription: webinar.description, // Use description as longDescription for now
         category: webinar.category || 'Uncategorized',
         categoryId: null, // Will be set when categories table is created
         hostId: webinar.created_by,
         isFeatured: false, // Will be set when is_featured column is added
         date: new Date(webinar.scheduled_date).toLocaleDateString('en-US', {
           weekday: 'long',
           year: 'numeric',
           month: 'long',
           day: 'numeric'
         }),
         time: webinar.scheduled_time,
         timezone: webinar.timezone,
         duration: webinar.duration_minutes,
         registered: webinar.user_webinars?.filter(uw => uw.status === 'registered').length || 0,
         maxParticipants: webinar.max_participants,
         daysLeft: daysLeft,
         meetingLink: webinar.meeting_link,
         meetingPlatform: 'google_meet', // Default for now
         locationType: 'virtual', // Default for now
         locationAddress: null,
         tags: [], // Will be set when tags column is added
         speakers: [], // Will be populated when webinar_speakers table is created
         primarySpeaker: null,
         isRegistered: userId ? (webinar.user_webinars?.some(uw => uw.user_id === userId && uw.status === 'registered') || false) : false,
         createdAt: webinar.created_at,
         updatedAt: webinar.updated_at
       };
     });

    return NextResponse.json({
      success: true,
      data: transformedWebinars
    });

  } catch (error) {
    console.error('Get upcoming webinars error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
