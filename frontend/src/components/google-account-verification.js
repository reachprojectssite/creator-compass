import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ExternalLink, AlertCircle } from 'lucide-react';
import GoogleAuthService from '../lib/google-auth-service';
import { createClient } from '@supabase/supabase-js';
import GoogleSuccessModal from './google-success-modal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const GoogleAccountVerification = ({ currentUser, onVerificationChange }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [googleEmail, setGoogleEmail] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const googleAuthService = new GoogleAuthService();
  
  // Debug: Check if environment variables are loaded
  console.log('Client ID from env:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  console.log('Redirect URI from env:', process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI);

  useEffect(() => {
    if (currentUser) {
      checkVerificationStatus();
      
      // Check if we're returning from OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const googleConnected = urlParams.get('google_connected');
      const tokens = urlParams.get('tokens');
      
      console.log('URL params check:', { googleConnected, tokens: tokens ? 'present' : 'missing' });
      
      if (googleConnected === 'true' && tokens) {
        console.log('OAuth callback detected, handling...');
        // Handle OAuth callback with tokens
        handleOAuthCallback(tokens);
      }
    }
  }, [currentUser]);

  const checkVerificationStatus = async () => {
    try {
      const status = await googleAuthService.hasVerifiedGoogleAccount(currentUser.id);
      setVerificationStatus(status);
      setGoogleEmail(status.email);
      setError(null);
    } catch (err) {
      console.error('Error checking verification status:', err);
      setError('Failed to check verification status');
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setIsVerifying(true);
      setError(null);
      
      // Generate OAuth URL and redirect user
      const authUrl = googleAuthService.generateAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error initiating Google connection:', err);
      setError('Failed to connect to Google');
      setIsVerifying(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      setIsVerifying(true);
      setError(null);

      // Get current user's Google tokens
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('google_access_token')
        .eq('id', currentUser.id)
        .single();

      if (userError) {
        throw userError;
      }

      if (userData?.google_access_token) {
        // Revoke Google access
        await googleAuthService.revokeAccess(userData.google_access_token);
      }

      // Remove from database
      await googleAuthService.removeGoogleAccount(currentUser.id);

      // Update local state
      setVerificationStatus({ verified: false, email: null });
      setGoogleEmail(null);
      
      if (onVerificationChange) {
        onVerificationChange(false);
      }

      setError(null);
    } catch (err) {
      console.error('Error disconnecting Google account:', err);
      setError('Failed to disconnect Google account');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOAuthCallback = async (tokenData) => {
    try {
      setIsVerifying(true);
      setError(null);
      
      // Parse tokens from URL parameter
      const { access_token, refresh_token, user_info } = JSON.parse(decodeURIComponent(tokenData));
      
      if (!access_token || !user_info) {
        throw new Error('Invalid token data received');
      }
      
      // Save Google account info to database
      const saveResult = await googleAuthService.saveGoogleAccount(
        currentUser.id,
        user_info,
        { access_token, refresh_token }
      );
      
      // Supabase UPDATE operations return null on success, so we don't check saveResult
      // The method will throw an error if something actually fails
      
      // Update local state
      setVerificationStatus({ verified: true, email: user_info.email });
      setGoogleEmail(user_info.email);
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Success! The account is now connected
      console.log('Google account connected successfully!');
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Error handling OAuth callback:', err);
      setError('Failed to connect Google account: ' + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRefreshStatus = async () => {
    await checkVerificationStatus();
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Google Account Verification
        </h3>
        <button
          onClick={handleRefreshStatus}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Verification Status */}
        <div className="flex items-center space-x-3">
          {verificationStatus?.verified ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">
                Connected to Google Account
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-gray-700">
                Not connected to Google
              </span>
            </>
          )}
        </div>

        {/* Google Email Display */}
        {googleEmail && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Email:</span> {googleEmail}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {!verificationStatus?.verified ? (
            <button
              onClick={handleConnectGoogle}
              disabled={isVerifying}
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {isVerifying ? 'Connecting...' : 'Connect Google Account'}
            </button>
          ) : (
            <button
              onClick={handleDisconnectGoogle}
              disabled={isVerifying}
              className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isVerifying ? 'Disconnecting...' : 'Disconnect Google Account'}
            </button>
          )}
        </div>

        {/* Benefits */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Benefits of Google Integration:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Create real Google Calendar events</li>
            <li>• Generate functional Google Meet links</li>
            <li>• Send calendar invitations to participants</li>
            <li>• Sync webinar schedules automatically</li>
          </ul>
        </div>

        {/* Instructions */}
        {!verificationStatus?.verified && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              How to connect:
            </h4>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Click "Connect Google Account" above</li>
              <li>Sign in to your Google account</li>
              <li>Grant permission to access Calendar and Meet</li>
              <li>You'll be redirected back to complete the setup</li>
            </ol>
          </div>
        )}
      </div>
      
      {/* Success Modal */}
      <GoogleSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </div>
  );
}

export default GoogleAccountVerification;
