"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Terms of Service</h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="mb-4">Last updated: March 24, 2025</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>Welcome to Creator Webinars. These Terms of Service ("Terms") govern your use of our website and services offered by Creator Webinars (the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">2. Use of the Service</h2>
              <p>Creator Webinars provides an online platform for users to access educational content, webinars, and related resources. Our Service is designed to help creators learn, grow, and connect with industry experts and peers.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
              <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
              <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
              <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Creator Webinars and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Creator Webinars.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">5. Content</h2>
              <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
              <p>By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">6. Links To Other Web Sites</h2>
              <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by Creator Webinars.</p>
              <p>Creator Webinars has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that Creator Webinars shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Termination</h2>
              <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">8. Limitation Of Liability</h2>
              <p>In no event shall Creator Webinars, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
              <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us:</p>
              <ul>
                <li>By email: support@creatorwebinars.com</li>
                <li>By visiting our website and using the contact form</li>
              </ul>
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
              <Link href="/terms" className="text-amber-200 hover:text-white text-sm font-medium">Terms</Link>
              <Link href="/privacy" className="text-amber-200 hover:text-white text-sm">Privacy</Link>
              <Link href="/cookies" className="text-amber-200 hover:text-white text-sm">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 