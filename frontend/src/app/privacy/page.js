"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
                Join the Webinars
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
                    Join the Webinars
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
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Privacy Policy</h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="mb-4">Last updated: March 24, 2025</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>At Creator Webinars, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
              <p>This privacy policy applies to all personal data collected through our website, as well as any associated services, sales, marketing, or events.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">2. The Data We Collect About You</h2>
              <p>Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).</p>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-5 mt-2 mb-4">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Profile Data</strong> includes your username and password, your interests, preferences, feedback, and survey responses.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Personal Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-5 mt-2 mb-4">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
              <p>Generally, we do not rely on consent as a legal basis for processing your personal data although we will get your consent before sending third party direct marketing communications to you via email or text message. You have the right to withdraw consent to marketing at any time by contacting us.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">4. Purposes for Which We Will Use Your Personal Data</h2>
              <p>We have set out below, in a table format, a description of all the ways we plan to use your personal data, and which of the legal bases we rely on to do so.</p>
              
              <div className="border border-slate-200 rounded-lg my-6">
                <div className="grid grid-cols-2 gap-4 p-4 border-b border-slate-200 font-medium">
                  <div>Purpose/Activity</div>
                  <div>Lawful basis for processing</div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 border-b border-slate-200">
                  <div>To register you as a new customer</div>
                  <div>Performance of a contract with you</div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 border-b border-slate-200">
                  <div>To process and deliver your service including managing payments</div>
                  <div>Performance of a contract with you; Necessary for our legitimate interests</div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div>To manage our relationship with you including notifying you about changes to our terms or privacy policy</div>
                  <div>Performance of a contract with you; Necessary to comply with a legal obligation; Necessary for our legitimate interests</div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Security</h2>
              <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.</p>
              <p>We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">6. Data Retention</h2>
              <p>We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Your Legal Rights</h2>
              <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:</p>
              <ul className="list-disc pl-5 mt-2 mb-4">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
              <p>If you wish to exercise any of the rights set out above, please contact us.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Details</h2>
              <p>If you have any questions about this privacy policy or our privacy practices, please contact us:</p>
              <ul className="list-disc pl-5 mt-2 mb-4">
                <li>Email address: privacy@creatorwebinars.com</li>
                <li>Postal address: Creator Webinars Privacy Team, 123 Creator Avenue, San Francisco, CA 94103</li>
              </ul>
              <p>You have the right to make a complaint at any time to the Federal Trade Commission (FTC), the USA supervisory authority for data protection issues (www.ftc.gov). We would, however, appreciate the chance to deal with your concerns before you approach the FTC, so please contact us in the first instance.</p>
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
              <Link href="/privacy" className="text-amber-200 hover:text-white text-sm font-medium">Privacy</Link>
              <Link href="/cookies" className="text-amber-200 hover:text-white text-sm">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 