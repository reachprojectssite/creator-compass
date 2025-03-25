"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Shield, MailIcon } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  // Form state
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock API call - replace with actual password reset functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError('Unable to send reset link. Please try again.');
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
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden border border-amber-100 p-0">
          {!isSubmitted ? (
            <div className="p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-md">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 text-center">Reset Your Password</h2>
                <p className="text-slate-600 mt-2 text-center">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 transition-all border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    We'll send a secure link to this email address
                  </p>
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
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-sm font-medium text-amber-600 hover:text-amber-500 underline underline-offset-2">
                    Back to login
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Check className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Check Your Email</h2>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <p className="text-slate-700 mb-2">
                  We've sent a password reset link to:
                </p>
                <p className="font-medium text-slate-800 break-all">
                  {email}
                </p>
              </div>
              
              <p className="text-sm text-slate-600 mb-6">
                The link will expire in 24 hours. If you don't see the email, please check your spam folder.
              </p>
              
              <div className="space-y-4">
                <Link href="/login">
                  <Button variant="outline" className="border border-amber-200 text-amber-600 hover:bg-amber-50 w-full">
                    Return to Login
                  </Button>
                </Link>
                
                <button 
                  onClick={handleSubmit} 
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Resend email
                </button>
              </div>
            </div>
          )}
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