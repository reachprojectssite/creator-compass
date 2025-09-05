"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Star, ArrowRight, Coffee, Lock } from "lucide-react";
import Link from "next/link";
import { AuthService } from "@/lib/auth";
import GoogleAuthService from "@/lib/google-auth-service";

export default function Login() {
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call actual authentication service
      const result = await AuthService.loginUser(loginData.email, loginData.password);
      
      if (result.success) {
        // Store the session token in localStorage
        if (result.sessionToken) {
          localStorage.setItem('sessionToken', result.sessionToken);
        }
        
        // Redirect to dashboard with session token
        window.location.href = `/dashboard?session=${result.sessionToken}`;
      } else {
        setError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const googleAuth = new GoogleAuthService();
      
      // Check if Google OAuth is properly configured
      if (!googleAuth.clientId) {
        throw new Error('Google OAuth not configured');
      }
      
      const authUrl = googleAuth.generateAuthUrl('login');
      console.log('Redirecting to Google OAuth:', authUrl);
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError('Failed to start Google login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm py-3 border-b border-amber-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="font-bold text-lg text-slate-800">Creator Webinars</h1>
          <Link href="/" className="px-4 py-2 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium text-sm transition-all">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Decorative elements */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="fixed bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full opacity-20 blur-3xl"></div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-lg w-full overflow-hidden border border-amber-100 p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left decorative panel */}
            <div className="md:w-1/3 bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 right-10 w-16 h-16 rounded-full border-4 border-white/30"></div>
                <div className="absolute bottom-20 left-5 w-24 h-24 rounded-full border-4 border-white/20"></div>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-center">
                <Coffee className="h-10 w-10 mb-4" />
                <h2 className="text-xl font-bold mb-3">Welcome back!</h2>
                <p className="text-white/80 text-sm">
                  Sign in to access your creator webinars account and stay connected.
                </p>
              </div>
            </div>
            
            {/* Right content panel */}
            <div className="md:w-2/3 p-8">
              <div className="flex items-center justify-center md:justify-start mb-6">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                  <Lock className="h-4 w-4 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs font-medium text-amber-600 hover:text-amber-500 underline underline-offset-2">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    className="w-full transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    name="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                {/* Google Login Button */}
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 py-3"
                  disabled={isLoading}
                >
                  <div className="w-5 h-5 mr-2">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  Continue with Google
                </Button>

                <div className="text-center text-sm text-slate-600 mt-6">
                  Don't have an account?{" "}
                  <Link href="/signup" className="font-medium text-amber-600 hover:text-amber-500 underline underline-offset-2">
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2025 Creator Webinars. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 