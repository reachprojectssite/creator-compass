import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
         // For now, return hardcoded categories since the categories table doesn't exist yet
     // We'll update this to use real data when the categories table is created
     const categories = [
       { id: '1', name: 'Content Creation', description: 'Learn content creation strategies and techniques', iconName: 'FileText', color: '#f59e0b', count: 1 },
       { id: '2', name: 'Monetization', description: 'Discover ways to monetize your content and skills', iconName: 'DollarSign', color: '#10b981', count: 1 },
       { id: '3', name: 'Marketing', description: 'Marketing strategies for creators', iconName: 'BarChart3', color: '#3b82f6', count: 1 },
       { id: '4', name: 'Technology', description: 'Tech tools and platforms for creators', iconName: 'Laptop', color: '#8b5cf6', count: 1 },
       { id: '5', name: 'Strategy', description: 'Strategic planning and business development', iconName: 'Target', color: '#ef4444', count: 1 },
       { id: '6', name: 'Growth', description: 'Scaling and growing your creator business', iconName: 'TrendingUp', color: '#06b6d4', count: 1 }
     ];

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
