import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { userId, webinarId } = await request.json();

    if (!userId || !webinarId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Webinar ID are required' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const { data: existingRegistration, error: checkError } = await supabase
      .from('user_webinars')
      .select('*')
      .eq('user_id', userId)
      .eq('webinar_id', webinarId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingRegistration) {
      return NextResponse.json(
        { success: false, error: 'User is already registered for this webinar' },
        { status: 400 }
      );
    }

    // Register the user
    const { data: registration, error } = await supabase
      .from('user_webinars')
      .insert({
        user_id: userId,
        webinar_id: webinarId,
        status: 'registered',
        registered_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: registration,
      message: 'Successfully registered for webinar'
    });

  } catch (error) {
    console.error('Register for webinar error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const webinarId = searchParams.get('webinarId');

    if (!userId || !webinarId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Webinar ID are required' },
        { status: 400 }
      );
    }

    // Delete the registration
    const { error } = await supabase
      .from('user_webinars')
      .delete()
      .eq('user_id', userId)
      .eq('webinar_id', webinarId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Successfully unregistered from webinar'
    });

  } catch (error) {
    console.error('Unregister from webinar error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
