import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

         // First, update any webinars that should be marked as completed
     const { error: updateError } = await supabase
       .rpc('update_webinar_status');
     
     if (updateError) {
       console.warn('Could not update webinar status:', updateError);
     }

         // Get total upcoming webinars
     const { count: totalUpcoming, error: upcomingError } = await supabase
       .from('webinars')
       .select('*', { count: 'exact', head: true })
       .eq('status', 'upcoming')
       .gte('scheduled_date', new Date().toISOString().split('T')[0]);

    if (upcomingError) throw upcomingError;

    // Get user's registrations for upcoming webinars only
    const { count: userRegistrations, error: regError } = await supabase
      .from('user_webinars')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'registered');

    if (regError) throw regError;

    // Get next upcoming webinar
    const { data: nextWebinarData, error: nextError } = await supabase
      .from('webinars')
      .select(`
        id,
        title,
        scheduled_date,
        scheduled_time
      `)
      .eq('status', 'upcoming')
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })
      .limit(1)
      .single();

    if (nextError && nextError.code !== 'PGRST116') throw nextError;

    // Get total speakers
    const { count: totalSpeakers, error: speakersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'speaker');

    if (speakersError) throw speakersError;

    // Get total categories
    const { count: totalCategories, error: categoriesError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    if (categoriesError) throw categoriesError;

    // Calculate growth (mock data for now - could be based on previous month)
    const growthFromLastMonth = Math.floor(Math.random() * 5) + 1; // 1-5 webinars

    const statistics = {
      totalUpcoming: totalUpcoming || 0,
      userRegistrations: userRegistrations || 0,
      totalSpeakers: totalSpeakers || 0,
      totalCategories: totalCategories || 0,
      nextWebinar: nextWebinarData?.title || null,
      growthFromLastMonth: growthFromLastMonth
    };

    return NextResponse.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Get webinar statistics error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
