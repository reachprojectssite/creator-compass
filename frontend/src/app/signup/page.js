"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Star, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Mock signup - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
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
        <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full overflow-hidden border border-amber-100 relative">
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
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={signupData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                        University/Organization (Optional)
                      </label>
                      <Input
                        id="organization"
                        name="organization"
                        value={signupData.organization}
                        onChange={handleInputChange}
                        placeholder="Stanford University"
                        className="w-full transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={signupData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={signupData.password}
                          onChange={handleInputChange}
                          className="w-full transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500 pr-20"
                          minLength="8"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none bg-white px-1">
                          min 8 chars
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>
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
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 py-6"
                    disabled={isLoading}
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

                  <div className="text-center mt-6 text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-amber-600 hover:text-amber-500 underline underline-offset-2">
                      Sign in
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Check className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-4">You're all set!</h2>
                
                <p className="text-slate-600 mb-6">
                  We've sent a confirmation email to <span className="font-medium">{signupData.email}</span>. 
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