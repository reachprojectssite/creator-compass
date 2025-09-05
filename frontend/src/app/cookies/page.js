"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export default function CookiesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-amber-500 transition-colors">Creator Webinars</Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/#speakers" className="text-sm font-medium hover:text-orange-500">Speakers</Link>
            <Link href="/#curriculum" className="text-sm font-medium hover:text-orange-500">Sessions</Link>
            <Link href="/#hosts" className="text-sm font-medium hover:text-orange-500">About Us</Link>
            <Link href="/#faq" className="text-sm font-medium hover:text-orange-500">FAQ</Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            <Link href="/" className="hidden md:flex">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Sign Up
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-gray-600 rounded-full"></span>
                  <span className="w-full h-0.5 bg-gray-600 rounded-full"></span>
                  <span className="w-full h-0.5 bg-gray-600 rounded-full"></span>
                </div>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-3 px-4 absolute w-full z-20 shadow-md">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/#speakers" 
                className="text-sm font-medium py-2 px-3 hover:bg-amber-50 rounded-md hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Speakers
              </Link>
              <Link 
                href="/#curriculum" 
                className="text-sm font-medium py-2 px-3 hover:bg-amber-50 rounded-md hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sessions
              </Link>
              <Link 
                href="/#hosts" 
                className="text-sm font-medium py-2 px-3 hover:bg-amber-50 rounded-md hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/#faq" 
                className="text-sm font-medium py-2 px-3 hover:bg-amber-50 rounded-md hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="pt-2 mt-2 border-t border-gray-100">
                <Link href="/">
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 bg-slate-50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Cookie Policy</h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="mb-4">Last updated: March 24, 2025</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
              <p>Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.</p>
              <p>Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">2. How Creator Webinars Uses Cookies</h2>
              <p>When you use and access the Service, we may place a number of cookie files in your web browser. We use cookies for the following purposes:</p>
              <ul className="list-disc pl-5 mt-2 mb-4">
                <li>To enable certain functions of the Service</li>
                <li>To provide analytics</li>
                <li>To store your preferences</li>
              </ul>
              <p>We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:</p>
              <ul className="list-disc pl-5 mt-2 mb-4">
                <li><strong>Essential cookies.</strong> We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
                <li><strong>Preferences cookies.</strong> We may use preferences cookies to remember information that changes the way the Service behaves or looks, such as the "remember me" functionality of a registered user or a user's language preference.</li>
                <li><strong>Analytics cookies.</strong> We may use analytics cookies to track information how the Service is used so that we can make improvements. We may also use analytics cookies to test new advertisements, pages, features or new functionality of the Service to see how our users react to them.</li>
                <li><strong>Targeting cookies.</strong> These types of cookies are used to deliver advertisements on and through the Service and track the performance of these advertisements. These cookies may also be used to enable third-party advertising networks to deliver ads that may be relevant to you based upon your activities or interests.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">3. Third-Party Cookies</h2>
              <p>In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. These may include:</p>
              <ul className="list-disc pl-5 mt-2 mb-4">
                <li><strong>Google Analytics:</strong> We use Google Analytics to help us understand how our customers use the website. You can read more about how Google uses your Personal Information <a href="https://www.google.com/intl/en/policies/privacy/" className="text-amber-600 hover:text-amber-800" target="_blank" rel="noopener noreferrer">here</a>.</li>
                <li><strong>Social Media:</strong> We use cookies from social media platforms like Facebook, Twitter, and LinkedIn to enable functionality for sharing content on social media and to analyze the effectiveness of our social media advertising.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">4. What Are Your Choices Regarding Cookies</h2>
              <p>If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.</p>
              <p>Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.</p>
              <ul className="list-disc pl-5 mt-2 mb-4">
                <li>For the Chrome web browser, please visit this page from Google: <a href="https://support.google.com/accounts/answer/32050" className="text-amber-600 hover:text-amber-800" target="_blank" rel="noopener noreferrer">https://support.google.com/accounts/answer/32050</a></li>
                <li>For the Internet Explorer web browser, please visit this page from Microsoft: <a href="http://support.microsoft.com/kb/278835" className="text-amber-600 hover:text-amber-800" target="_blank" rel="noopener noreferrer">http://support.microsoft.com/kb/278835</a></li>
                <li>For the Firefox web browser, please visit this page from Mozilla: <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" className="text-amber-600 hover:text-amber-800" target="_blank" rel="noopener noreferrer">https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored</a></li>
                <li>For the Safari web browser, please visit this page from Apple: <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-amber-600 hover:text-amber-800" target="_blank" rel="noopener noreferrer">https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a></li>
              </ul>
              <p>For any other web browser, please visit your web browser's official web pages.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">5. Cookie Consent</h2>
              <p>When you first visit our website, we ask for your consent to use cookies. You can choose to accept or decline cookies. If you choose to decline cookies, some features of our website may not function as intended.</p>
              <p>You can also update your cookie preferences at any time by clicking on the "Cookie Settings" button in the footer of our website.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">6. More Information</h2>
              <p>If you have any questions about our use of cookies or other technologies, please email us at cookies@creatorwebinars.com.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Changes to This Cookie Policy</h2>
              <p>We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.</p>
              <p>You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy are effective when they are posted on this page.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-amber-200 mb-4 md:mb-0">© 2025 Creator Webinars. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-amber-200 hover:text-white text-sm">Terms</Link>
              <Link href="/privacy" className="text-amber-200 hover:text-white text-sm">Privacy</Link>
              <Link href="/cookies" className="text-amber-200 hover:text-white text-sm font-medium">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 