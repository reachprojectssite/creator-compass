import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 3;

    // For now, return hardcoded speakers since the webinar_speakers table doesn't exist yet
    const speakers = [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Content Creator',
        expertise: ['Content Creation', 'Strategy', 'Growth'],
        upcomingSessions: 2,
        image: '/api/placeholder/150/150',
        bio: 'Expert content creator with 10+ years of experience',
        userType: 'speaker'
      },
      {
        id: '2',
        name: 'Mike Chen',
        role: 'Industry Expert',
        expertise: ['Monetization', 'Business', 'Marketing'],
        upcomingSessions: 1,
        image: '/api/placeholder/150/150',
        bio: 'Business strategist specializing in creator monetization',
        userType: 'speaker'
      },
      {
        id: '3',
        name: 'Emma Rodriguez',
        role: 'Content Creator',
        expertise: ['Technology', 'Tools', 'Workflow'],
        upcomingSessions: 1,
        image: '/api/placeholder/150/150',
        bio: 'Tech-savvy creator focused on workflow optimization',
        userType: 'speaker'
      }
    ].slice(0, limit);

    return NextResponse.json({
      success: true,
      data: speakers
    });

  } catch (error) {
    console.error('Get featured speakers error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
