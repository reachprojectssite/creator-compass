import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

         // Get the most recent featured webinar (for now, just get the first upcoming webinar)
     const { data: webinars, error } = await supabase
       .from('webinars')
       .select(`
         *,
         user_webinars!inner (
           user_id,
           status
         )
       `)
       .eq('status', 'upcoming')
       .gte('scheduled_date', new Date().toISOString().split('T')[0])
       .order('scheduled_date', { ascending: true })
       .order('scheduled_time', { ascending: true })
       .limit(1)
       .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No featured webinar found, return null
        return NextResponse.json({
          success: true,
          data: null
        });
      }
      throw error;
    }

         // Transform the data
     // Calculate days left
     const today = new Date();
     const webinarDate = new Date(webinars.scheduled_date);
     const daysLeft = Math.ceil((webinarDate - today) / (1000 * 60 * 60 * 24));

     const featuredWebinar = {
       id: webinars.id,
       title: webinars.title,
       description: webinars.description,
       longDescription: webinars.description, // Use description as longDescription for now
       category: webinars.category || 'Uncategorized',
       categoryId: null, // Will be set when categories table is created
       hostId: webinars.created_by,
       isFeatured: true, // Mark as featured for now
       date: new Date(webinars.scheduled_date).toLocaleDateString('en-US', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric'
       }),
       time: webinars.scheduled_time,
       timezone: webinars.timezone,
       duration: webinars.duration_minutes,
       registered: 0, // Will be calculated when current_registrants is added
       maxParticipants: webinars.max_participants,
       daysLeft: daysLeft,
       meetingLink: webinars.meeting_link,
       meetingPlatform: 'google_meet', // Default for now
       locationType: 'virtual', // Default for now
       locationAddress: null,
       tags: [], // Will be set when tags column is added
       speakers: [], // Will be populated when webinar_speakers table is created
       primarySpeaker: null,
       isRegistered: webinars.user_webinars?.some(uw => uw.user_id === userId && uw.status === 'registered') || false,
       createdAt: webinars.created_at,
       updatedAt: webinars.updated_at
     };

    return NextResponse.json({
      success: true,
      data: featuredWebinar
    });

  } catch (error) {
    console.error('Get featured webinar error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
