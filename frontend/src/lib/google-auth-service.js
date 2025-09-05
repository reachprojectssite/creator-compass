import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class GoogleAuthService {
  constructor() {
    // Access environment variables safely for both client and server
    this.clientId = typeof window !== 'undefined' ? 
      (window.__NEXT_DATA__?.props?.env?.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
       (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID : undefined)) : 
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    this.redirectUri = typeof window !== 'undefined' ? 
      (window.__NEXT_DATA__?.props?.env?.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
       (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI : undefined) || 
       'http://localhost:3000/api/auth/google/callback') : 
      (process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback');
    
    this.scope = 'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';
  }

  // Generate OAuth URL for user to authorize
  generateAuthUrl(context = 'signup') {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      state: this.generateState() + ':' + context // Include context in state
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Generate random state for security
  generateState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code) {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const tokens = await response.json();
      return tokens;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }

  // Get user info from Google
  async getUserInfo(accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }

  // Save Google account info to database
  async saveGoogleAccount(userId, googleInfo, tokens) {
    try {
      console.log('Attempting to save Google account for user:', userId);
      console.log('Google info:', googleInfo);
      console.log('Tokens:', { access_token: tokens.access_token ? 'present' : 'missing', refresh_token: tokens.refresh_token ? 'present' : 'missing' });
      
      // Test basic Supabase connection first
      console.log('Supabase URL:', supabaseUrl);
      console.log('Supabase Key exists:', !!supabaseAnonKey);
      
      // Try a simple select first to test connection
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', userId)
        .single();
        
      if (testError) {
        console.error('Test query failed:', testError);
        throw new Error(`Supabase connection test failed: ${testError.message}`);
      }
      
      console.log('Test query successful, user found:', testData);
      
      const { data, error } = await supabase
        .from('users')
        .update({
          google_account_id: googleInfo.id,
          google_email: googleInfo.email,
          google_verified: true,
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully saved Google account data:', data);
      return data;
    } catch (error) {
      console.error('Error saving Google account:', error);
      throw error;
    }
  }

  // Check if user has verified Google account
  async hasVerifiedGoogleAccount(userId) {
    try {
      console.log('Checking verification status for user:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('google_verified, google_email')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking verification status:', error);
        throw error;
      }

      console.log('Verification status data:', data);
      return {
        verified: data?.google_verified || false,
        email: data?.google_email
      };
    } catch (error) {
      console.error('Error checking Google account:', error);
      return { verified: false, email: null };
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const tokens = await response.json();
      return tokens;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Revoke Google access
  async revokeAccess(accessToken) {
    try {
      const response = await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to revoke access: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error revoking access:', error);
      throw error;
    }
  }

  // Remove Google account from database
  async removeGoogleAccount(userId) {
    try {
      console.log('Attempting to remove Google account for user:', userId);
      
      // First, check current state
      const { data: currentData, error: selectError } = await supabase
        .from('users')
        .select('google_account_id, google_email, google_verified')
        .eq('id', userId)
        .single();
        
      if (selectError) {
        console.error('Error checking current state:', selectError);
        throw selectError;
      }
      
      console.log('Current Google account state:', currentData);
      
      const { data, error } = await supabase
        .from('users')
        .update({
          google_account_id: null,
          google_email: null,
          google_verified: false,
          google_access_token: null,
          google_refresh_token: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Successfully removed Google account data:', data);
      
      // Verify the update worked
      const { data: verifyData, error: verifyError } = await supabase
        .from('users')
        .select('google_account_id, google_email, google_verified')
        .eq('id', userId)
        .single();
        
      if (verifyError) {
        console.error('Error verifying removal:', verifyError);
      } else {
        console.log('Verification - Google account state after removal:', verifyData);
      }

      return true;
    } catch (error) {
      console.error('Error removing Google account:', error);
      throw error;
    }
  }
}

export default GoogleAuthService;
