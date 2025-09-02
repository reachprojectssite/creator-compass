"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Star, Sparkles, Mail, AlertCircle, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import GoogleAuthService from "@/lib/google-auth-service";

export default function Signup() {
  // Signup form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Enhanced email validation function
  const validateEmail = (email) => {
    // Basic checks
    if (!email) {
      return 'Email is required';
    }
    
    if (email.length > 254) {
      return 'Email is too long (maximum 254 characters)';
    }
    
    // Trim whitespace
    const trimmedEmail = email.trim();
    if (trimmedEmail !== email) {
      return 'Email cannot contain leading or trailing spaces';
    }
    
    // Check for @ symbol
    if (!trimmedEmail.includes('@')) {
      return 'Email must contain @ symbol';
    }
    
    // Split email into local and domain parts
    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) {
      return 'Email can only contain one @ symbol';
    }
    
    const [localPart, domain] = parts;
    
    // Validate local part (before @)
    if (!localPart || localPart.length === 0) {
      return 'Email must have content before @ symbol';
    }
    
    if (localPart.length > 64) {
      return 'Part before @ is too long (maximum 64 characters)';
    }
    
    // Check for valid characters in local part
    const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
    if (!localPartRegex.test(localPart)) {
      return 'Invalid characters in email address';
    }
    
    // Check for consecutive dots
    if (localPart.includes('..')) {
      return 'Email cannot contain consecutive dots';
    }
    
    // Check for dots at start or end of local part
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return 'Email cannot start or end with a dot';
    }
    
    // Validate domain part (after @)
    if (!domain || domain.length === 0) {
      return 'Email must have a domain after @ symbol';
    }
    
    if (domain.length > 253) {
      return 'Domain part is too long (maximum 253 characters)';
    }
    
    // Check for valid domain format
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domain)) {
      return 'Invalid domain format';
    }
    
    // Check for at least one dot in domain
    if (!domain.includes('.')) {
      return 'Domain must contain at least one dot (e.g., .com, .org)';
    }
    
    // Check for valid TLD (top-level domain)
    const tld = domain.split('.').pop();
    if (!tld || tld.length < 2) {
      return 'Domain must have a valid top-level domain (e.g., .com, .org)';
    }
    
    // Check for valid TLD characters
    const tldRegex = /^[a-zA-Z]{2,}$/;
    if (!tldRegex.test(tld)) {
      return 'Top-level domain must contain only letters';
    }
    
    // Check for consecutive dots in domain
    if (domain.includes('..')) {
      return 'Domain cannot contain consecutive dots';
    }
    
    // Check for dots at start or end of domain
    if (domain.startsWith('.') || domain.endsWith('.')) {
      return 'Domain cannot start or end with a dot';
    }
    
    // Check for common disposable email domains (optional security measure)
    const disposableDomains = [
      'tempmail.org', '10minutemail.com', 'guerrillamail.com', 
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ];
    
    if (disposableDomains.some(disposable => domain.toLowerCase().includes(disposable))) {
      return 'Please use a valid email address (disposable emails not allowed)';
    }
    
    return '';
  };

  // Password validation function
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  // Confirm password validation function
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  // Handle email input changes
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
    // Clear confirm password error if passwords now match
    if (confirmPassword && value === confirmPassword) {
      setConfirmPasswordError('');
    }
  };

  // Handle confirm password input changes
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(validateConfirmPassword(value));
  };

  // Handle email signup
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(confirmPassword);
    
    if (emailValidation || passwordValidation || confirmPasswordValidation) {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      setConfirmPasswordError(confirmPasswordValidation);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Import AuthService for registration
      const { AuthService } = await import('@/lib/auth');
      
      // Register the user
      const result = await AuthService.registerUser({
        email,
        full_name: email.split('@')[0], // Use email prefix as name for now
        password,
        university: '',
        interests: [],
        consent_events: false,
        consent_newsletter: false
      });

      if (result.success) {
        // Store the session token in localStorage
        if (result.sessionToken) {
          localStorage.setItem('sessionToken', result.sessionToken);
        }
        
        // Redirect to dashboard with welcome message and session
        window.location.href = `/dashboard?welcome=true&authMethod=email&session=${result.sessionToken}`;
      } else {
        setError(result.error || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');

    try {
      const googleAuth = new GoogleAuthService();
      
      // Check if Google OAuth is properly configured
      if (!googleAuth.clientId) {
        throw new Error('Google OAuth not configured');
      }
      
      const authUrl = googleAuth.generateAuthUrl('signup');
      console.log('Redirecting to Google OAuth:', authUrl);
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError('Failed to start Google signup. Please try again.');
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
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full overflow-hidden border border-amber-100 relative">
          {/* Decorative side panel - hidden on mobile */}
          <div className="md:absolute md:top-0 md:bottom-0 md:left-0 md:w-1/3 bg-gradient-to-br from-amber-400 to-orange-500 hidden md:block">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-4 border-white/30"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-4 border-white/20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-white/40"></div>
            </div>
            <div className="h-full flex flex-col justify-center p-6 text-white">
              <div className="mb-8">
                <Sparkles className="h-8 w-8 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Join our Creator Webinars</h2>
                <p className="text-white/80 text-sm">
                  Connect with industry experts and fellow creators in our interactive sessions.
                </p>
              </div>
              
              <div className="space-y-3 mt-auto">
                <div className="flex items-start">
                  <div className="p-1 bg-white/20 rounded-full mr-2">
                    <Check className="h-3 w-3" />
                  </div>
                  <p className="text-sm">Access exclusive resources</p>
                </div>
                <div className="flex items-start">
                  <div className="p-1 bg-white/20 rounded-full mr-2">
                    <Check className="h-3 w-3" />
                  </div>
                  <p className="text-sm">Join interactive Q&A sessions</p>
                </div>
                <div className="flex items-start">
                  <div className="p-1 bg-white/20 rounded-full mr-2">
                    <Check className="h-3 w-3" />
                  </div>
                  <p className="text-sm">Connect with industry experts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form content */}
          <div className="md:ml-[33.333%] w-full md:w-[66.666%] p-6 md:p-8">
            {!isSubmitted ? (
              <>
                <div className="text-center md:text-left mb-6">
                  <div className="flex items-center justify-center md:justify-start mb-3">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                      <Star className="h-4 w-4 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Create an Account</h2>
                  </div>
                  <p className="text-slate-500 text-sm">
                    Join our community of creators and start your journey today
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md mb-4 text-sm flex items-start">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Email Signup Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Mail className="h-5 w-5 text-gray-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Sign up with Email</h3>
                  </div>
                  
                    <form onSubmit={handleEmailSignup} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                        <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={() => setEmailError(validateEmail(email))}
                      placeholder="you@example.com"
                            className={`w-full transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500 pr-10 ${
                              emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
                              email && !emailError ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''
                            }`}
                      required
                    />
                          {email && !emailError && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Check className="h-4 w-4 text-green-500" />
                            </div>
                          )}
                          {emailError && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            </div>
                          )}
                        </div>
                        {emailError && (
                          <p className="mt-1 text-sm text-red-600 flex items-start">
                            <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                            {emailError}
                          </p>
                        )}
                        {email && !emailError && (
                          <p className="mt-1 text-sm text-green-600 flex items-start">
                            <Check className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                            Valid email address
                          </p>
                        )}
                  </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handlePasswordChange}
                            className={`w-full transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500 pr-10 ${
                              passwordError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                            }`}
                            placeholder="Create a strong password"
                          minLength="8"
                          required
                        />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {passwordError && (
                          <p className="mt-1 text-sm text-red-600 flex items-start">
                            <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                            {passwordError}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Must be at least 8 characters with uppercase, lowercase, and number
                        </p>
                      </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                        <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`w-full transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500 pr-10 ${
                              confirmPasswordError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                            }`}
                            placeholder="Confirm your password"
                        required
                      />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                    </div>
                        {confirmPasswordError && (
                          <p className="mt-1 text-sm text-red-600 flex items-start">
                            <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                            {confirmPasswordError}
                          </p>
                        )}
                  </div>

                  <div className="flex items-start pt-1">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="font-medium text-gray-700">
                        I agree to receive updates about upcoming webinars
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 py-3"
                        disabled={isLoading || !!emailError || !!passwordError || !!confirmPasswordError}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating your account...
                      </span>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                    </form>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  {/* Google Signup Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-5 h-5 mr-2">
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Sign up with Google</h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Quick and secure signup using your Google account
                    </p>

                    <Button
                      onClick={handleGoogleSignup}
                      className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 py-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing up...
                        </span>
                      ) : (
                        <>
                          Continue with Google
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center mt-6 text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-amber-600 hover:text-amber-500 underline underline-offset-2">
                      Sign in
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Check className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-4">You're all set!</h2>
                
                <p className="text-slate-600 mb-6">
                  We've sent a confirmation email to <span className="font-medium">{email}</span>. 
                  Please check your inbox to verify your email address.
                </p>
                
                <div className="max-w-md mx-auto bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Next steps:
                  </h3>
                  <ul className="text-sm text-amber-700 space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-amber-200 text-amber-700 mr-2">1</div>
                      <span>Verify your email address</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-amber-200 text-amber-700 mr-2">2</div>
                      <span>Complete your profile</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-amber-200 text-amber-700 mr-2">3</div>
                      <span>Join our upcoming webinars</span>
                    </li>
                  </ul>
                </div>
                
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
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