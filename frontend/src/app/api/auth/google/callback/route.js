import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import GoogleAuthService from '../../../../../lib/google-auth-service';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request) {
  try {
    console.log('=== OAuth Callback Started ===');
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Parse context from state (format: randomState:context)
    const context = state ? state.split(':')[1] : 'signup';
    console.log('OAuth context:', context);
    console.log('Code present:', !!code);
    console.log('State present:', !!state);

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/dashboard?error=oauth_failed&message=' + encodeURIComponent(error), request.url));
    }

    // Validate required parameters
    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(new URL('/dashboard?error=no_code&message=No authorization code received from Google', request.url));
    }

    // Check if Google OAuth is properly configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Google OAuth not configured - missing environment variables');
      return NextResponse.redirect(new URL('/dashboard?error=oauth_not_configured&message=Google OAuth is not configured. Please check your environment variables.', request.url));
    }

    // Initialize Google Auth Service
    const googleAuthService = new GoogleAuthService();

    // Exchange code for tokens
    const tokens = await googleAuthService.exchangeCodeForTokens(code);
    if (!tokens) {
      console.error('Failed to exchange code for tokens');
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed&message=Failed to exchange authorization code for tokens', request.url));
    }

    // Get user info from Google
    const userInfo = await googleAuthService.getUserInfo(tokens.access_token);
    if (!userInfo) {
      console.error('Failed to get user info from Google');
      return NextResponse.redirect(new URL('/dashboard?error=user_info_failed', request.url));
    }

    console.log('Checking for existing user with email:', userInfo.email);
    
    // Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id, email, full_name, auth_method')
      .eq('email', userInfo.email)
      .single();
      
    console.log('User check result:', { existingUser: !!existingUser, error: userCheckError });

    let userId;
    let isNewUser = false;

    if (existingUser) {
      console.log('Found existing user:', existingUser.email, 'auth_method:', existingUser.auth_method);
      console.log('Full user object:', JSON.stringify(existingUser, null, 2));
      
      // Check if existing user is traditional (not OAuth)
      if (existingUser.auth_method && existingUser.auth_method !== 'oauth') {
        console.error('Traditional user attempting OAuth login:', existingUser.email);
        return NextResponse.redirect(new URL('/dashboard?error=oauth_blocked&message=This account was created with email/password. Please use traditional login.', request.url));
      }
      
      // If auth_method is null/undefined, treat as traditional user
      if (!existingUser.auth_method) {
        console.error('User without auth_method attempting OAuth login:', existingUser.email);
        return NextResponse.redirect(new URL('/dashboard?error=oauth_blocked&message=This account was created with email/password. Please use traditional login.', request.url));
      }
      
      // User exists and is OAuth-compatible, use their ID
      userId = existingUser.id;
      console.log('Existing OAuth user found:', existingUser.email);
      
      // For signup context, don't allow creating duplicate accounts
      if (context === 'signup') {
        console.log('Signup attempt for existing OAuth user - treating as login');
        // Treat this as a login instead of signup
        isNewUser = false;
      }
    } else {
      // No existing user found
      if (context === 'login') {
        // This is a login attempt but user doesn't exist
        console.error('Login attempt for non-existent user:', userInfo.email);
        return NextResponse.redirect(new URL('/dashboard?error=user_not_found&message=No account found with this email. Please sign up first.', request.url));
      }
      
      // This is a signup attempt, create new user
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: userInfo.email,
          full_name: userInfo.name || userInfo.email.split('@')[0],
          password_hash: await bcrypt.hash('oauth_user_' + Math.random().toString(36), 12), // Secure placeholder for OAuth users
          user_type: 'consumer',
          auth_method: 'oauth', // Flag to identify OAuth users
          google_account_id: userInfo.id,
          google_email: userInfo.email,
          google_verified: true,
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Failed to create new user:', createError);
        return NextResponse.redirect(new URL('/dashboard?error=user_creation_failed&message=' + encodeURIComponent(createError.message), request.url));
      }

      userId = newUser.id;
      isNewUser = true;
      console.log('New user created:', userInfo.email);

      // Create user experience record
      await supabase
        .from('user_exp')
        .insert({
          user_id: userId,
          total_exp: 0,
          current_level: 1,
          exp_to_next_level: 1
        });
    }

    // Update existing user with Google info if they don't have it
    if (!isNewUser) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          google_account_id: userInfo.id,
          google_email: userInfo.email,
          google_verified: true,
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Failed to update user with Google info:', updateError);
      }
    }

    // Create a session token for the user
    const sessionToken = btoa(`${userId}:${Date.now()}:${Math.random()}`);
    
    // Store session in database
    await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });

    // Redirect based on whether this is a new user or existing user
    if (isNewUser) {
      // New user - redirect to dashboard with welcome message
      return NextResponse.redirect(new URL(`/dashboard?welcome=true&authMethod=oauth&session=${sessionToken}`, request.url));
    } else {
      // Existing user - redirect to dashboard (no special message for existing OAuth users)
      return NextResponse.redirect(new URL(`/dashboard?session=${sessionToken}`, request.url));
    }

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=callback_error&message=' + encodeURIComponent(error.message), request.url));
  }
}
