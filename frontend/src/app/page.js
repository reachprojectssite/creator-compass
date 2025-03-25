"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Users, MapPin, Award, ArrowRight, Check, Star, Globe, DollarSign, BarChart, Zap, Video, MessageCircle, Heart, ChevronDown, Mail, User, Play, File, Instagram, Twitter, Linkedin, Facebook, Coffee, Sparkles, BookOpen, Camera, X, Clock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Home() {
  // State for popups
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  
  // State for inline registration form
  const [inlineFormPhase, setInlineFormPhase] = useState(1);
  const [inlineRegistrationData, setInlineRegistrationData] = useState({
    name: '',
    email: '',
    interests: 'all',
    password: '',
    confirmPassword: '',
    organization: '' // Added organization field with default value
  });

  // State for Contact Form
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    message: '',
    newsletterEmail: ''
  });

  // Handle inline form input changes
  const handleInlineInputChange = (e) => {
    const { name, value } = e.target;
    setInlineRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle inline form phase 1 submission
  const handleInlinePhase1Submit = (e) => {
    e.preventDefault();
    setInlineFormPhase(2);
  };

  // Handle inline form phase 2 (complete registration)
  const handleInlinePhase2Submit = (e) => {
    e.preventDefault();
    // Here you would typically send the registration data to your backend
    console.log("Registration data:", inlineRegistrationData);
    // Move to thank you phase
    setInlineFormPhase(3);
  };

  // Handle contact form input changes
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mock data for the curriculum sessions
  const sessions = [
    {
      id: 1,
      title: "In Front of or Behind the Camera: Exploring Career Paths",
      date: "Feb 19, 2025",
      time: "9 AM PT / 12 PM EST",
      description: "Explore roles like Creator, Manager, Social Strategist. Learn about industry trends & opportunities and find your fit.",
      bullets: [
        "Roles: Creator, Manager, Social Strategist",
        "Industry trends & opportunities",
        "Find your fit"
      ]
    },
    {
      id: 2,
      title: "Self-Managed vs. Having a Manager", 
      date: "March 12, 2025",
      time: "9 AM PT / 12 PM EST",
      description: "Learn when to seek management, green & red flags in managers, and how to navigate talent relationships.",
      bullets: [
        "When to seek management",
        "Green & red flags in managers",
        "How to navigate talent relationships"
      ]
    },
    {
      id: 3,
      title: "Pitch Party: Crafting Effective Brand Pitches",
      date: "April 9, 2025",
      time: "9 AM PT / 12 PM EST",
      description: "Connect with dream brands, build compelling brand-friendly strategies, and align content & brand goals.",
      bullets: [
        "Connect with dream brands",
        "Build compelling brand-friendly strategies",
        "Align content & brand goals"
      ]
    },
    {
      id: 4,
      title: "Maximizing Revenue: Building Sustainable Income Streams",
      date: "April 30, 2025",
      time: "9 AM PT / 12 PM EST",
      description: "Explore revenue streams: partnerships, affiliates, merch, NIL. Build audience loyalty & subscription revenue.",
      bullets: [
        "Revenue streams: partnerships, affiliates, merch, NIL",
        "Audience loyalty & subscription revenue"
      ]
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: "Who can join this program?",
      answer: "This program is designed for aspiring content creators, managers, and digital professionals at any stage of their career. Whether you're just starting out or looking to level up your skills, you're welcome to join."
    },
    {
      question: "Do I need experience to participate?", 
      answer: "No prior experience is required. Our curriculum is designed to benefit creators at all levels, from beginners to those with established platforms."
    },
    {
      question: "Is there a cost to participate?",
      answer: "The 4-session virtual curriculum is completely free. The culminating IRL events may have associated costs, which will be communicated closer to the event dates."
    },
    {
      question: "How do the webinars work?",
      answer: "After registration, you'll receive calendar invites with links to join each virtual session. All webinars will be recorded and made available to registered participants."
    },
    {
      question: "Will I be able to interact with the speakers?",
      answer: "Yes! Each 50-minute webinar includes 30 minutes of content followed by a 20-minute Q&A session where you can ask questions directly to our industry experts."
    },
    {
      question: "What if I can't attend all four sessions?",
      answer: "No problem. While we encourage attending all sessions live, recordings will be available to all registered participants. Each session is designed to provide value on its own, though they work best as a series."
    }
  ];

  // Stats for the hosts
  const reachStats = [
    { value: "75+", label: "Universities" },
    { value: "2,500+", label: "Creators" }, 
    { value: "300M+", label: "Combined Following" }
  ];
  
  const shineStats = [
    { value: "250+", label: "Creators" },
    { value: "4", label: "Global Offices" }, 
    { value: "100+", label: "Major Clients" }
  ];

  // Why join reasons
  const whyJoinReasons = [
    {
      title: "Expert Insights",
      description: "Learn directly from industry leaders at REACH Nationals and Shine Talent Group",
      icon: Users
    },
    {
      title: "Practical Skills",
      description: "Gain actionable strategies you can immediately apply to your creator journey",
      icon: Video
    },
    {
      title: "Networking",
      description: "Connect with fellow creators and industry professionals at our IRL events",
      icon: Globe
    },
    {
      title: "Career Opportunities",
      description: "Showcase your skills and potentially get representation from Shine Talent Group",
      icon: DollarSign
    },
  ];

  // Featured alumni
  const alumni = [
    { name: "Alan Chikin Chow", image: "/placeholder-creator-1.jpg" },
    { name: "PartyShirt", image: "/placeholder-creator-2.jpg" },
    { name: "Mia Finney", image: "/placeholder-creator-3.jpg" },
    { name: "Cosette", image: "/placeholder-creator-4.jpg" },
    { name: "Markian Benhamou", image: "/placeholder-creator-5.jpg" },
    { name: "Caroline Lee", image: "/placeholder-creator-6.jpg" },
  ];

  // Notable clients
  const clients = [
    { name: "Amazon", image: "/placeholder-client-1.png" },
    { name: "McDonald's", image: "/placeholder-client-2.png" },
    { name: "Nintendo", image: "/placeholder-client-3.png" },
    { name: "Target", image: "/placeholder-client-4.png" },
    { name: "Hilton", image: "/placeholder-client-5.png" },
    { name: "Clinique", image: "/placeholder-client-6.png" },
  ];

  // Component for the Contact Form Popup
  function ContactFormPopup() {
    // Handle escape key press
    useEffect(() => {
      const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
          setShowContactPopup(false);
        }
      };
      
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Contact form data:", contactFormData);
      // Here you would typically send the form data to your backend
      alert("Thanks for your message! We'll get back to you soon.");
      setShowContactPopup(false);
    };
    
    return (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowContactPopup(false)}
      >
        <div 
          className="bg-white rounded-lg max-w-md w-full p-6 relative max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => setShowContactPopup(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">Have questions about our webinars? We'd love to hear from you.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <Input 
                id="name" 
                name="name" 
                value={contactFormData.name} 
                onChange={handleContactInputChange} 
                placeholder="John Doe" 
                className="w-full" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={contactFormData.email} 
                onChange={handleContactInputChange} 
                placeholder="john@example.com" 
                className="w-full" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                id="message" 
                name="message"
                value={contactFormData.message}
                onChange={handleContactInputChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2"
                placeholder="Your message here..."
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    );
  }
  
  // Component for the Join Webinar Popup
  function JoinWebinarPopup() {
    // Phase state to track registration progress (1: initial form, 2: password creation, 3: thank you)
    const [phase, setPhase] = useState(1);
    const [registrationData, setRegistrationData] = useState({
      name: '',
      email: '',
      organization: '',
      interests: 'all',
      password: '',
      confirmPassword: ''
    });

    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setRegistrationData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    // Handle form submission for phase 1
    const handlePhase1Submit = (e) => {
      e.preventDefault();
      setPhase(2);
    };

    // Handle form submission for phase 2 (complete registration)
    const handlePhase2Submit = (e) => {
      e.preventDefault();
      // Here you would typically send the registration data to your backend
      console.log("Registration data:", registrationData);
      // Move to thank you screen
      setPhase(3);
    };

    // Close popup after a delay when in thank you screen
    useEffect(() => {
      if (phase === 3) {
        const timer = setTimeout(() => {
          setShowJoinPopup(false);
        }, 10000); // Auto close after 10 seconds
        
        return () => clearTimeout(timer);
      }
    }, [phase]);

    // Handle escape key press
    useEffect(() => {
      const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
          setShowJoinPopup(false);
        }
      };
      
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }, []);
    
    return (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowJoinPopup(false)}
      >
        <div 
          className="bg-white rounded-lg max-w-md w-full p-6 relative max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => setShowJoinPopup(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
          
          {phase === 1 && (
            <>
              <h2 className="text-xl font-bold mb-4">Join Our Webinar Series</h2>
              <p className="text-gray-600 mb-6">Sign up to receive updates about upcoming webinars and exclusive content.</p>
              
              <form onSubmit={handlePhase1Submit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input 
                    id="name" 
                    name="name"
                    value={registrationData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe" 
                    className="w-full" 
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={registrationData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com" 
                    className="w-full" 
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">University/Organization (If Applicable)</label>
                  <Input 
                    id="organization" 
                    name="organization"
                    value={registrationData.organization}
                    onChange={handleInputChange}
                    placeholder="Stanford University" 
                    className="w-full" 
                  />
                </div>
                
                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">Which sessions interest you?</label>
                  <select 
                    id="interests"
                    name="interests"
                    value={registrationData.interests}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-slate-200 focus:border-amber-500 focus:ring-amber-500 py-2"
                  >
                    <option value="all">All sessions</option>
                    <option value="1">Session 1: Career Paths</option>
                    <option value="2">Session 2: Management</option>
                    <option value="3">Session 3: Brand Pitches</option>
                    <option value="4">Session 4: Revenue Streams</option>
                  </select>
                </div>
                
                <div className="flex items-start">
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
                      I agree to receive email updates about upcoming webinars
                    </label>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
                  Continue
                </Button>
              </form>
            </>
          )}
          
          {phase === 2 && (
            <>
              <h2 className="text-xl font-bold mb-4">Create Your Account</h2>
              <p className="text-gray-600 mb-6">Set up a password to complete your registration and access exclusive content.</p>
              
              <form onSubmit={handlePhase2Submit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      value={registrationData.password}
                      onChange={handleInputChange}
                      className="w-full" 
                      minLength="8"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">min 8 chars</div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password" 
                    value={registrationData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full" 
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
                    Complete Registration
                  </Button>
                </div>
                
                <div className="pt-2 text-center">
                  <button 
                    type="button" 
                    className="text-sm text-amber-600 hover:text-amber-700"
                    onClick={() => setPhase(1)}
                  >
                    Back to previous step
                  </button>
                </div>
              </form>
            </>
          )}
          
          {phase === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Thank You for Registering!</h2>
              
              <p className="text-gray-600 mb-6">
                We've sent a confirmation email to <span className="font-medium">{registrationData.email}</span> with all the details you need to get started.
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Please check your inbox (and spam folder) for the email. If you don't receive it within 5 minutes, please contact us.
                </p>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-4">
                    <Calendar className="h-4 w-4 inline-block mr-1 text-amber-500" />
                    Your first session starts on February 19, 2025.
                  </p>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Add to your calendar:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <a 
                        href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Creator%20Webinars%20Session%201&dates=20250219T170000Z/20250219T180000Z&details=Join%20us%20for%20the%20first%20session%20of%20our%20Creator%20Webinars%20series.%20Topic:%20In%20Front%20of%20or%20Behind%20the%20Camera:%20Exploring%20Career%20Paths&location=Online" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4 mr-1.5 text-blue-500" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21.0184 5.65001H20.9737V5.69234C20.9737 5.98894 20.7325 6.23022 20.4359 6.23022H17.9825C17.6859 6.23022 17.4447 5.98873 17.4447 5.69234V3.24402C17.4447 2.94742 17.6859 2.70615 17.9825 2.70615H20.4359C20.7325 2.70615 20.9737 2.94763 20.9737 3.24402V3.23182H21.0184C21.6166 3.23182 22.0991 3.71431 22.0991 4.31251V21.519C22.0991 22.1171 21.6166 22.5998 21.0184 22.5998H2.98158C2.38339 22.5998 1.90088 22.1171 1.90088 21.519V4.31251C1.90088 3.71431 2.38339 3.23182 2.98158 3.23182H3.02632V3.24412C3.02632 3.54072 3.26758 3.78197 3.56418 3.78197H6.01752C6.31412 3.78197 6.55538 3.54072 6.55538 3.24412V0.790811C6.55538 0.49421 6.31412 0.252959 6.01752 0.252959H3.56418C3.26758 0.252959 3.02632 0.494221 3.02632 0.790811V0.799615H2.98158C1.33933 0.799615 0 2.13894 0 3.78119V22.0506C0 23.6926 1.33932 25.0321 2.98158 25.0321H21.0184C22.6607 25.0321 24 23.6926 24 22.0504V3.78109C24 2.13883 22.6607 0.799514 21.0184 0.799514H20.9737V0.7907C20.9737 0.494099 20.7325 0.252847 20.4359 0.252847H17.9825C17.6859 0.252847 17.4447 0.494099 17.4447 0.7907V3.23902C17.4447 3.53562 17.6859 3.77687 17.9825 3.77687H20.4359C20.7325 3.77687 20.9737 3.53562 20.9737 3.23902V3.2316L21.0184 3.23172V5.65001Z" fill="currentColor" />
                          <path d="M6.10352e-05 10.7775H24.0001V8.7775H6.10352e-05V10.7775Z" fill="currentColor" />
                          <path d="M12 16.5C13.6569 16.5 15 15.1569 15 13.5C15 11.8431 13.6569 10.5 12 10.5C10.3431 10.5 9 11.8431 9 13.5C9 15.1569 10.3431 16.5 12 16.5Z" fill="currentColor" />
                        </svg>
                        Google Calendar
                      </a>
                      <a 
                        href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20250219T170000Z%0ADTEND:20250219T180000Z%0ASUMMARY:Creator%20Webinars%20Session%201%0ADESCRIPTION:Join%20us%20for%20the%20first%20session%20of%20our%20Creator%20Webinars%20series.%20Topic:%20In%20Front%20of%20or%20Behind%20the%20Camera:%20Exploring%20Career%20Paths%0ALOCATION:Online%0AEND:VEVENT%0AEND:VCALENDAR" 
                        download="creator-webinars-session1.ics"
                        className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4 mr-1.5 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Apple Calendar
                      </a>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setShowJoinPopup(false)} 
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Component for the Session Detail Popup
  function SessionDetailPopup() {
    const session = selectedSession;
    
    // Handle escape key press
    useEffect(() => {
      const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
          setSelectedSession(null);
        }
      };
      
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }, []);
    
    return (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedSession(null)}
      >
        <div 
          className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => setSelectedSession(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="aspect-[3/2] bg-amber-100 rounded-lg mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center text-amber-400 text-xl font-medium">
              Session {session.id} Image
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="outline" className="flex items-center gap-1 py-1 border-amber-200 bg-amber-50">
              <Calendar className="h-3 w-3 text-amber-500" />
              <span className="text-xs font-medium text-amber-700">{session.date}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 py-1 border-amber-200 bg-amber-50">
              <Clock className="h-3 w-3 text-amber-500" />
              <span className="text-xs font-medium text-amber-700">{session.time}</span>
            </Badge>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">{session.title}</h2>
          <p className="text-gray-600 mb-6">{session.description}</p>
          
          {session.bullets && session.bullets.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">What You'll Learn</h3>
              <ul className="space-y-2">
                {session.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button 
              className="bg-amber-500 hover:bg-amber-600 flex-1" 
              onClick={() => {
                setSelectedSession(null);
                setShowJoinPopup(true);
              }}
            >
              Register for this Session
            </Button>
            <Button 
              variant="outline" 
              className="border-amber-500 text-amber-600 hover:bg-amber-50"
              onClick={() => setSelectedSession(null)}
            >
              Back to Sessions
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-amber-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Add this session to your calendar:</p>
            <div className="flex flex-wrap gap-2">
              <a 
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Creator%20Webinars:%20${encodeURIComponent(session.title)}&dates=20250219T170000Z/20250219T180000Z&details=${encodeURIComponent(`Join us for the Creator Webinars session on: ${session.title}. ${session.description}`)}&location=Online`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-white border border-amber-200 rounded-md text-sm text-gray-700 hover:bg-amber-50"
              >
                <svg className="w-4 h-4 mr-1.5 text-blue-500" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.0184 5.65001H20.9737V5.69234C20.9737 5.98894 20.7325 6.23022 20.4359 6.23022H17.9825C17.6859 6.23022 17.4447 5.98873 17.4447 5.69234V3.24402C17.4447 2.94742 17.6859 2.70615 17.9825 2.70615H20.4359C20.7325 2.70615 20.9737 2.94763 20.9737 3.24402V3.23182H21.0184C21.6166 3.23182 22.0991 3.71431 22.0991 4.31251V21.519C22.0991 22.1171 21.6166 22.5998 21.0184 22.5998H2.98158C2.38339 22.5998 1.90088 22.1171 1.90088 21.519V4.31251C1.90088 3.71431 2.38339 3.23182 2.98158 3.23182H3.02632V3.24412C3.02632 3.54072 3.26758 3.78197 3.56418 3.78197H6.01752C6.31412 3.78197 6.55538 3.54072 6.55538 3.24412V0.790811C6.55538 0.49421 6.31412 0.252959 6.01752 0.252959H3.56418C3.26758 0.252959 3.02632 0.494221 3.02632 0.790811V0.799615H2.98158C1.33933 0.799615 0 2.13894 0 3.78119V22.0506C0 23.6926 1.33932 25.0321 2.98158 25.0321H21.0184C22.6607 25.0321 24 23.6926 24 22.0504V3.78109C24 2.13883 22.6607 0.799514 21.0184 0.799514H20.9737V0.7907C20.9737 0.494099 20.7325 0.252847 20.4359 0.252847H17.9825C17.6859 0.252847 17.4447 0.494099 17.4447 0.7907V3.23902C17.4447 3.53562 17.6859 3.77687 17.9825 3.77687H20.4359C20.7325 3.77687 20.9737 3.53562 20.9737 3.23902V3.2316L21.0184 3.23172V5.65001Z" fill="currentColor" />
                  <path d="M6.10352e-05 10.7775H24.0001V8.7775H6.10352e-05V10.7775Z" fill="currentColor" />
                  <path d="M12 16.5C13.6569 16.5 15 15.1569 15 13.5C15 11.8431 13.6569 10.5 12 10.5C10.3431 10.5 9 11.8431 9 13.5C9 15.1569 10.3431 16.5 12 16.5Z" fill="currentColor" />
                </svg>
                Google Calendar
              </a>
              <a 
                href={`data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20250219T170000Z%0ADTEND:20250219T180000Z%0ASUMMARY:Creator%20Webinars:%20${encodeURIComponent(session.title)}%0ADESCRIPTION:${encodeURIComponent(`Join us for the Creator Webinars session on: ${session.title}. ${session.description}`)}%0ALOCATION:Online%0AEND:VEVENT%0AEND:VCALENDAR`}
                download={`creator-webinars-${session.id}.ics`}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-amber-200 rounded-md text-sm text-gray-700 hover:bg-amber-50"
              >
                <svg className="w-4 h-4 mr-1.5 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Apple Calendar
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white py-3 border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-base sm:text-lg md:text-xl text-slate-800 whitespace-nowrap">
              Creator Webinars
            </Link>
          </div>
          
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-3 lg:space-x-6">
              <a href="#speakers" className="text-sm lg:text-base text-slate-600 hover:text-amber-500 px-2 lg:px-3 py-2">Speakers</a>
              <a href="#curriculum" className="text-sm lg:text-base text-slate-600 hover:text-amber-500 px-2 lg:px-3 py-2">Sessions</a>
              <a href="#hosts" className="text-sm lg:text-base text-slate-600 hover:text-amber-500 px-2 lg:px-3 py-2">About Us</a>
              <a href="#faq" className="text-sm lg:text-base text-slate-600 hover:text-amber-500 px-2 lg:px-3 py-2">FAQ</a>
            </div>
          </div>
            
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link href="/login" className="text-sm lg:text-base text-slate-600 hover:text-amber-500 px-2 lg:px-3 py-2">
              Login
            </Link>
            <Button className="text-xs lg:text-sm bg-orange-500 hover:bg-orange-600" onClick={() => setShowJoinPopup(true)}>
              Join the Webinars
            </Button>
          </div>
          
          <button
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-3 px-4 absolute w-full z-20 shadow-md">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="#speakers" 
                className="text-sm font-medium py-2 px-3 hover:bg-amber-50 rounded-md hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Speakers
              </Link>
              <Link 
                href="#curriculum" 
                className="text-sm font-medium py-2 px-3 hover:bg-amber-50 rounded-md hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sessions
              </Link>
              <a 
                href="#hosts" 
                className="text-sm font-medium py-2 px-3 hover:bg-amber-50 rounded-md hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </a>
              <a 
                href="#faq" 
                className="text-sm font-medium py-2 px-3 hover:bg-amber-50 rounded-md hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="pt-2 mt-2 border-t border-gray-100">
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowJoinPopup(true);
                  }}
                >
                  Join the Webinars
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="relative min-h-[80vh] sm:min-h-[85vh] md:min-h-screen flex items-center py-8 md:py-6">
          {/* Background image/pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-orange-50 opacity-70"></div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-32 sm:w-40 md:w-64 h-32 sm:h-40 md:h-64 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 blur-3xl opacity-30"></div>
            <div className="absolute bottom-10 right-10 w-32 sm:w-40 md:w-80 h-32 sm:h-40 md:h-80 rounded-full bg-gradient-to-bl from-amber-300 to-orange-300 blur-3xl opacity-30"></div>
          </div>
          
          <div className="container mx-auto px-4 py-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
              <div className="text-center md:text-left">
                <div className="max-w-xl mx-auto md:mx-0">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-medium mb-3">
                    Learn. Create. Connect.
                  </span>
                  
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 text-slate-800">
                    The Next Generation of <span className="text-amber-600">Creators</span>
                  </h1>
                  
                  <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-4 sm:mb-6">
                    Join our webinar series with passionate creators to learn, share ideas, and build meaningful connections in a supportive environment.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                    <Button size="lg" className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 bg-amber-500 hover:bg-amber-600" onClick={() => setShowJoinPopup(true)}>
                      Join our webinars
                    </Button>
                    <Button size="lg" variant="outline" className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 border-slate-300 text-slate-700 hover:bg-slate-100">
                      <Play className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Watch our last webinar
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="relative mt-6 sm:mt-8 md:mt-0">
                {/* Main image container */}
                <div className="w-full aspect-[4/3] relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                  <div className="absolute inset-0">
                    <div className="relative w-full h-full">
                      {/* Creator image */}
                      <img 
                        src="/creator-group-photo.jpeg" 
                        alt="Creator group in white tops and blue jeans" 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Floating elements positioned outside the image - hide some on small screens */}
                {/* Heart counter - top left */}
                <div className="absolute -top-2 -left-2 sm:-top-3 md:-top-4 md:-left-4 bg-white px-2 py-1 sm:px-3 md:px-4 md:py-2 rounded-full shadow-md z-20">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3 md:h-4 md:w-4 text-red-500 fill-current" />
                    <span className="text-xs md:text-sm font-medium">1.2k</span>
                  </div>
                </div>
                
                {/* 100% Free - top right */}
                <div className="absolute -top-2 -right-2 sm:-top-3 md:-top-4 md:-right-4 bg-white px-2 py-1 sm:px-3 md:px-4 md:py-2 rounded-full shadow-md z-20">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Star className="h-3 w-3 md:h-4 md:w-4 text-amber-500 fill-current" />
                    <span className="text-xs md:text-sm font-medium">100% Free</span>
                  </div>
                </div>
                
                {/* Coffee icon - bottom right - hide on small screens */}
                <div className="hidden sm:block absolute bottom-[20%] right-[-5%] bg-white p-2 md:p-3 rounded-lg shadow-md z-20 transform rotate-6">
                  <Coffee className="h-4 w-4 md:h-6 md:w-6 text-amber-500" />
                </div>
                
                {/* Create together - repositioned for mobile */}
                <div className="absolute bottom-[-5%] left-[5%] md:bottom-[-8%] md:left-[-5%] bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md z-20 max-w-[160px] sm:max-w-[200px] md:max-w-[280px]">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm md:text-base font-medium">Create together</p>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Learn from experts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Partners section */}
            <div className="mt-8 sm:mt-10 md:mt-12 text-center">
              <p className="text-xs md:text-sm uppercase tracking-wider text-slate-500 mb-2 sm:mb-3 md:mb-4">In collaboration with</p>
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-16">
                <a href="https://reachnatl.com/" target="_blank" rel="noopener noreferrer" className="text-base sm:text-lg md:text-xl font-bold text-slate-700 hover:text-slate-700">REACH Nationals</a>
                <a href="https://www.shinetalentgroup.com/" target="_blank" rel="noopener noreferrer" className="text-base sm:text-lg md:text-xl font-bold text-slate-700 hover:text-slate-700">Shine Talent Group</a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Speakers Section */}
        <section id="speakers" className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-10 md:mb-16 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
                Our Speakers
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-slate-800">Meet some amazing speakers</h2>
              <p className="text-base md:text-xl text-slate-600">
                Learn from industry experts who understand the creator journey and are excited to share their knowledge
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              {[
                { name: "Jess Hunichen", role: "CEO", index: 0 },
                { name: "Dylan Huey", role: "Creator, CEO", index: 1 },
                { name: "Alexis-Marie Soliven", role: "Talent Manager", index: 2 },
                { name: "Ashley Kimichi", role: "Creator", index: 3 },
                { name: "Carrie Bankston", role: "Creator", index: 4 }
              ].map((speaker) => (
                <div key={speaker.index} className="group relative overflow-hidden rounded-xl bg-slate-100 aspect-[3/4] transform transition-transform hover:scale-[1.03]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 opacity-70"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium text-base md:text-xl">
                      {speaker.name.charAt(0) + (speaker.name.includes(' ') ? speaker.name.split(' ')[1].charAt(0) : '')}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 text-white">
                    <h3 className="font-medium text-sm md:text-lg">{speaker.name}</h3>
                    <p className="text-xs md:text-sm text-slate-200">{speaker.role}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 md:mt-10 text-center">
              <p className="text-lg md:text-xl text-amber-600 font-medium">And Many More!</p>
            </div>
          </div>
        </section>

        {/* Why Join section */}
        <section id="why-join" className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-10 md:mb-16 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
                Why Join Us
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-slate-800">Why join our webinar series</h2>
              <p className="text-base md:text-xl text-slate-600">
                REACH Nationals and Shine Talent Group have created a space where creators can learn, grow, and build meaningful connections with fellow creators and industry experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="grid gap-4 md:gap-6">
                  {whyJoinReasons.map((reason, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100 transform transition-all hover:shadow-md hover:scale-[1.02]">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="p-2 md:p-3 rounded-xl bg-amber-100 text-amber-600">
                          <reason.icon className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">{reason.title}</h3>
                          <p className="text-sm md:text-base text-slate-600">{reason.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <div className="bg-white rounded-xl shadow-lg p-5 md:p-8 relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-200 opacity-30"></div>
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-orange-200 opacity-30"></div>
                  
                  {/* Interactive counter section */}
                  <div className="relative mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800">By The Numbers</h3>
                    
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                      <div className="bg-amber-50 rounded-lg p-3 md:p-4 text-center transform transition-all hover:scale-105 hover:shadow-md">
                        <div className="text-xl md:text-3xl font-bold text-amber-600 mb-1">1,000+</div>
                        <div className="text-xs md:text-sm text-slate-600">Creators</div>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 md:p-4 text-center transform transition-all hover:scale-105 hover:shadow-md">
                        <div className="text-xl md:text-3xl font-bold text-amber-600 mb-1">4</div>
                        <div className="text-xs md:text-sm text-slate-600">Sessions</div>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 md:p-4 text-center transform transition-all hover:scale-105 hover:shadow-md">
                        <div className="text-xl md:text-3xl font-bold text-amber-600 mb-1">$0</div>
                        <div className="text-xs md:text-sm text-slate-600">Price</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive benefits cards */}
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-slate-800">What You'll Gain</h3>
                  <div className="space-y-2 md:space-y-3">
                    <div className="group bg-gradient-to-r from-amber-50 to-orange-50 p-3 md:p-4 rounded-lg border border-amber-100 cursor-pointer transform transition-all hover:shadow-md">
                      <div className="flex items-center">
                        <div className="bg-white p-1.5 md:p-2 rounded-full mr-2 md:mr-3 shadow-sm group-hover:bg-amber-500 transition-colors">
                          <Video className="h-4 w-4 md:h-5 md:w-5 text-amber-500 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="font-medium text-sm md:text-base">Live Interactive Sessions</h4>
                      </div>
                      <div className="pl-9 md:pl-12 mt-1 md:mt-2 text-xs md:text-sm text-slate-600 overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-300">
                        Engage directly with industry experts and fellow creators in real-time discussions and Q&A sessions.
                      </div>
                    </div>
                    
                    <div className="group bg-gradient-to-r from-amber-50 to-orange-50 p-3 md:p-4 rounded-lg border border-amber-100 cursor-pointer transform transition-all hover:shadow-md">
                      <div className="flex items-center">
                        <div className="bg-white p-1.5 md:p-2 rounded-full mr-2 md:mr-3 shadow-sm group-hover:bg-amber-500 transition-colors">
                          <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-amber-500 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="font-medium text-sm md:text-base">Exclusive Resources</h4>
                      </div>
                      <div className="pl-9 md:pl-12 mt-1 md:mt-2 text-xs md:text-sm text-slate-600 overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-300">
                        Access templates, guides, and toolkits specifically designed for creators looking to level up their career.
                      </div>
                    </div>
                    
                    <div className="group bg-gradient-to-r from-amber-50 to-orange-50 p-3 md:p-4 rounded-lg border border-amber-100 cursor-pointer transform transition-all hover:shadow-md">
                      <div className="flex items-center">
                        <div className="bg-white p-1.5 md:p-2 rounded-full mr-2 md:mr-3 shadow-sm group-hover:bg-amber-500 transition-colors">
                          <Users className="h-4 w-4 md:h-5 md:w-5 text-amber-500 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="font-medium text-sm md:text-base">1:1 Networking</h4>
                      </div>
                      <div className="pl-9 md:pl-12 mt-1 md:mt-2 text-xs md:text-sm text-slate-600 overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-300">
                        Connect with industry professionals and fellow creators for potential collaborations and mentorship.
                      </div>
                    </div>
                  </div>
                  
                  {/* Next session countdown */}
                  <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-amber-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs md:text-sm text-slate-500">Next Session</div>
                      <div className="text-sm md:text-base font-medium text-slate-700">February 19, 2025</div>
                    </div>
                    <Button className="text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setShowJoinPopup(true)}>
                      Reserve Your Spot
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum/Sessions section */}
        <section id="curriculum" className="py-12 md:py-20 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-10 md:mb-16 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
                Upcoming Sessions
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-slate-800">Learn together with us</h2>
              <p className="text-base md:text-xl text-slate-600">
                Join our interactive sessions where we'll explore creator paths and share meaningful experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {sessions.map((session) => (
                <div 
                  key={session.id} 
                  className="bg-white rounded-xl overflow-hidden border border-amber-100 hover:shadow-md transition-shadow duration-300"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="p-4 pb-3 text-center">
                    <div className="inline-flex items-center mb-4">
                      <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-sm text-amber-700">{session.date}</span>
                    </div>
                    <div className="h-32 flex items-center justify-center bg-slate-100 rounded-lg mb-3">
                      <p className="text-amber-600 text-lg">Session {session.id} Image</p>
                    </div>
                    <h3 className="font-bold text-base mb-2 text-slate-800">{session.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{session.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.time}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSession(session);
                        }}
                        className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Learn more
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 md:mt-16 max-w-3xl mx-auto">
              <div className="bg-white rounded-xl p-4 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square rounded-xl bg-amber-100 relative flex items-center justify-center">
                      <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-white rounded-full p-1.5 md:p-2 shadow-sm">
                        <Video className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-slate-800">What to expect in our sessions</h3>
                    <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-5">
                      Our sessions are designed to be interactive, engaging, and packed with valuable insights. 
                      We focus on real-world applications and peer-to-peer learning.
                    </p>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <MessageCircle className="h-3 w-3 md:h-4 md:w-4 text-amber-600" />
                        </div>
                        <span className="text-xs md:text-sm">Interactive Q&A</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <Users className="h-3 w-3 md:h-4 md:w-4 text-amber-600" />
                        </div>
                        <span className="text-xs md:text-sm">Group discussions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-amber-600" />
                        </div>
                        <span className="text-xs md:text-sm">Practical resources</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <Camera className="h-3 w-3 md:h-4 md:w-4 text-amber-600" />
                        </div>
                        <span className="text-xs md:text-sm">Session recordings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Your Hosts section - more authentic and friendly */}
        <section id="hosts" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">Meet the team behind the magic</h2>
              <p className="text-xl text-slate-600">
                We're a passionate team of creators who have been in your shoes and want to build a supportive series of webinars
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* REACH Nationals - more authentic presentation */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-50 flex items-center justify-center">
                    <div className="text-amber-400 text-lg">REACH Team Photo</div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                      <Star className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      <a href="https://reachnationals.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                        REACH Nationals
                      </a>
                    </h3>
                  </div>
                  
                  <p className="text-slate-600 mb-6">
                    Started by creators for creators at USC, now we're nationwide with a mission to empower the next generation through webinars, connection, and education.
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-1 w-1 rounded-full bg-amber-500"></div>
                      <span className="text-slate-800 font-medium">75+ university communities</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-1 w-1 rounded-full bg-amber-500"></div>
                      <span className="text-slate-800 font-medium">2,500+ creator members</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-1 rounded-full bg-amber-500"></div>
                      <span className="text-slate-800 font-medium">Founded by creators, for creators</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center">
                      <div className="text-amber-500 text-xs">DH</div>
                    </div>
                    <div>
                      <p className="font-medium">Dylan Huey</p>
                      <p className="text-sm text-slate-500">REACH Nationals Founder</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shine Talent Group - more authentic presentation */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-50 flex items-center justify-center">
                    <div className="text-orange-400 text-lg">Shine Team Photo</div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <Award className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      <a href="https://shinetalent.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors">
                        Shine Talent Group
                      </a>
                    </h3>
                  </div>
                  
                  <p className="text-slate-600 mb-6">
                    We're creators at heart who've built a global talent collective supporting 250+ unique voices with the resources, connections, and guidance to thrive.
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-1 w-1 rounded-full bg-orange-500"></div>
                      <span className="text-slate-800 font-medium">4 global creator hubs</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-1 w-1 rounded-full bg-orange-500"></div>
                      <span className="text-slate-800 font-medium">Creator-led approach</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-1 rounded-full bg-orange-500"></div>
                      <span className="text-slate-800 font-medium">Authentic brand partnerships</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                      <div className="text-orange-500 text-xs">JH</div>
                    </div>
                    <div>
                      <p className="font-medium">Jess Hunichen</p>
                      <p className="text-sm text-slate-500">Shine Co-founder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial/Quote row */}
            <div className="max-w-5xl mx-auto mt-16">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-amber-50 rounded-xl p-6 relative">
                  <div className="mb-6 text-4xl text-amber-300">"</div>
                  <p className="text-slate-700 mb-6">
                    Being part of these webinars has been the highlight of my creator journey. The genuine connections and what I've learned have been invaluable.
                  </p>
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center">
                      <div className="text-amber-500 text-xs">AC</div>
                    </div>
                    <div>
                      <p className="font-medium">Alan Chikin Chow</p>
                      <p className="text-sm text-slate-500">Creator & Comedian</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-6 relative">
                  <div className="mb-6 text-4xl text-orange-300">"</div>
                  <p className="text-slate-700 mb-6">
                    What makes this different is how everyone genuinely wants to help each other succeed. It's refreshing to find a program that feels like family.
                  </p>
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                      <div className="text-orange-500 text-xs">MF</div>
                    </div>
                    <div>
                      <p className="font-medium">Mia Finney</p>
                      <p className="text-sm text-slate-500">Content Creator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <section id="faq" className="py-12 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-8 md:mb-12 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
                Questions?
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-slate-800">Common questions</h2>
              <p className="text-base md:text-xl text-slate-600">
                Here's what other creators like you have been asking about our webinar series
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl p-4 md:p-8 shadow-sm mb-6 md:mb-8">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-100 last:border-b-0 py-1 md:py-2">
                      <AccordionTrigger className="text-base md:text-lg font-medium hover:text-amber-600">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-sm md:text-base text-slate-600">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              
              <div className="bg-white rounded-xl p-4 md:p-8 shadow-sm overflow-hidden relative">
                <div className="absolute -top-6 -right-6 w-20 h-20 md:w-24 md:h-24 rounded-full bg-amber-100 opacity-50"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 md:w-24 md:h-24 rounded-full bg-orange-100 opacity-50"></div>
                
                <div className="relative">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center text-center md:text-left">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-amber-100 flex-shrink-0 mx-auto md:mx-0 flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold mb-2">Still have questions?</h3>
                      <p className="text-sm md:text-base text-slate-600 mb-4">
                        We'd love to hear from you! Reach out to our team directly and we'll get back to you as soon as possible.
                      </p>
                      <div className="flex justify-center md:justify-start">
                        <Button className="text-sm md:text-base bg-amber-500 hover:bg-amber-600" onClick={() => setShowContactPopup(true)}>
                          Contact us
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join our webinars section - less sales-y */}
        <section className="py-16 bg-slate-50" id="join">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Join Our Webinars</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join our free webinar series with passionate creators learning, sharing, and growing together. A collaboration between REACH Nationals & Shine Talent Group.
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-6">
                    Join Our Webinars
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">
                    Be part of something special
                  </h2>
                  <p className="text-lg text-slate-600 mb-8">
                    Connect with fellow creators, learn from industry experts, and build meaningful connections in our supportive webinar series.
                  </p>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center text-amber-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">Creator network</h3>
                        <p className="text-slate-600 text-sm">
                          Connect with peers who understand the creator journey and are excited to collaborate
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center text-amber-600">
                        <Video className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">Interactive sessions</h3>
                        <p className="text-slate-600 text-sm">
                          Four engaging sessions covering different aspects of the creator journey
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center text-amber-600">
                        <Coffee className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">In-person meetups</h3>
                        <p className="text-slate-600 text-sm">
                          Culminating IRL events to strengthen connections and create lasting bonds
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-amber-100 flex items-center justify-center text-xs font-medium">
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">2,500+ creators</span> have already joined
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-xl shadow-md p-8 relative">
                    <h3 className="text-2xl font-bold mb-6 text-slate-800">Join our webinars</h3>
                    
                    {inlineFormPhase === 1 && (
                      <form onSubmit={handleInlinePhase1Submit} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700">Your name</label>
                          <div className="relative">
                            <Input 
                              type="text" 
                              name="name"
                              value={inlineRegistrationData.name}
                              onChange={handleInlineInputChange}
                              placeholder="Name" 
                              className="pl-10 py-2 border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                              required
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700">Email address</label>
                          <div className="relative">
                            <Input 
                              type="email" 
                              name="email"
                              value={inlineRegistrationData.email}
                              onChange={handleInlineInputChange}
                              placeholder="Email" 
                              className="pl-10 py-2 border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                              required
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700">Which sessions interest you?</label>
                          <select 
                            name="interests"
                            value={inlineRegistrationData.interests}
                            onChange={handleInlineInputChange}
                            className="w-full rounded-lg border-slate-200 focus:border-amber-500 focus:ring-amber-500 py-2"
                          >
                            <option value="all">All sessions</option>
                            <option value="1">Session 1: Career Paths</option>
                            <option value="2">Session 2: Management</option>
                            <option value="3">Session 3: Brand Pitches</option>
                            <option value="4">Session 4: Revenue Streams</option>
                          </select>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="inline-terms"
                              name="terms"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                              required
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="inline-terms" className="font-medium text-slate-700">
                              I agree to receive email updates about upcoming webinars
                            </label>
                          </div>
                        </div>
                        
                        <Button type="submit" className="w-full py-2 bg-amber-500 hover:bg-amber-600">
                          Continue
                        </Button>
                        
                        <p className="text-center text-xs text-slate-500">
                          By joining, you'll receive updates about our sessions and webinars. No spam, ever.
                        </p>
                      </form>
                    )}
                    
                    {inlineFormPhase === 2 && (
                      <form onSubmit={handleInlinePhase2Submit} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700">Create Password</label>
                          <div className="relative">
                            <Input 
                              type="password" 
                              name="password"
                              value={inlineRegistrationData.password}
                              onChange={handleInlineInputChange}
                              className="w-full py-2 border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                              minLength="8"
                              required
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500">min 8 chars</div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700">Confirm Password</label>
                          <Input 
                            type="password" 
                            name="confirmPassword"
                            value={inlineRegistrationData.confirmPassword}
                            onChange={handleInlineInputChange}
                            className="w-full py-2 border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="w-full py-2 bg-amber-500 hover:bg-amber-600">
                          Complete Registration
                        </Button>
                        
                        <div className="text-center">
                          <button 
                            type="button" 
                            className="text-sm text-amber-600 hover:text-amber-700"
                            onClick={() => setInlineFormPhase(1)}
                          >
                            Back to previous step
                          </button>
                        </div>
                      </form>
                    )}
                    
                    {inlineFormPhase === 3 && (
                      <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-4">Thank You for Registering!</h3>
                        
                        <p className="text-slate-600 mb-6">
                          We've sent a confirmation email to <span className="font-medium">{inlineRegistrationData.email}</span> with all the details.
                        </p>
                        
                        <div className="space-y-4">
                          <p className="text-sm text-slate-500">
                            Please check your inbox and spam folder for the email.
                          </p>
                          
                          <div className="pt-4 border-t border-slate-100">
                            <p className="text-sm text-slate-600 mb-4 flex items-center justify-center">
                              <Calendar className="h-4 w-4 mr-1 text-amber-500" />
                              Your first session starts on February 19, 2025.
                            </p>
                            
                            <div className="mb-6">
                              <p className="text-sm font-medium text-slate-700 mb-3">Add to your calendar:</p>
                              <div className="flex flex-wrap justify-center gap-2">
                                <a 
                                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Creator%20Webinars%20Session%201&dates=20250219T170000Z/20250219T180000Z&details=Join%20us%20for%20the%20first%20session%20of%20our%20Creator%20Webinars%20series.%20Topic:%20In%20Front%20of%20or%20Behind%20the%20Camera:%20Exploring%20Career%20Paths&location=Online" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  <svg className="w-4 h-4 mr-1.5 text-blue-500" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.0184 5.65001H20.9737V5.69234C20.9737 5.98894 20.7325 6.23022 20.4359 6.23022H17.9825C17.6859 6.23022 17.4447 5.98873 17.4447 5.69234V3.24402C17.4447 2.94742 17.6859 2.70615 17.9825 2.70615H20.4359C20.7325 2.70615 20.9737 2.94763 20.9737 3.24402V3.23182H21.0184C21.6166 3.23182 22.0991 3.71431 22.0991 4.31251V21.519C22.0991 22.1171 21.6166 22.5998 21.0184 22.5998H2.98158C2.38339 22.5998 1.90088 22.1171 1.90088 21.519V4.31251C1.90088 3.71431 2.38339 3.23182 2.98158 3.23182H3.02632V3.24412C3.02632 3.54072 3.26758 3.78197 3.56418 3.78197H6.01752C6.31412 3.78197 6.55538 3.54072 6.55538 3.24412V0.790811C6.55538 0.49421 6.31412 0.252959 6.01752 0.252959H3.56418C3.26758 0.252959 3.02632 0.494221 3.02632 0.790811V0.799615H2.98158C1.33933 0.799615 0 2.13894 0 3.78119V22.0506C0 23.6926 1.33932 25.0321 2.98158 25.0321H21.0184C22.6607 25.0321 24 23.6926 24 22.0504V3.78109C24 2.13883 22.6607 0.799514 21.0184 0.799514H20.9737V0.7907C20.9737 0.494099 20.7325 0.252847 20.4359 0.252847H17.9825C17.6859 0.252847 17.4447 0.494099 17.4447 0.7907V3.23902C17.4447 3.53562 17.6859 3.77687 17.9825 3.77687H20.4359C20.7325 3.77687 20.9737 3.53562 20.9737 3.23902V3.2316L21.0184 3.23172V5.65001Z" fill="currentColor" />
                                    <path d="M6.10352e-05 10.7775H24.0001V8.7775H6.10352e-05V10.7775Z" fill="currentColor" />
                                    <path d="M12 16.5C13.6569 16.5 15 15.1569 15 13.5C15 11.8431 13.6569 10.5 12 10.5C10.3431 10.5 9 11.8431 9 13.5C9 15.1569 10.3431 16.5 12 16.5Z" fill="currentColor" />
                                  </svg>
                                  Google Calendar
                                </a>
                                <a 
                                  href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20250219T170000Z%0ADTEND:20250219T180000Z%0ASUMMARY:Creator%20Webinars%20Session%201%0ADESCRIPTION:Join%20us%20for%20the%20first%20session%20of%20our%20Creator%20Webinars%20series.%20Topic:%20In%20Front%20of%20or%20Behind%20the%20Camera:%20Exploring%20Career%20Paths%0ALOCATION:Online%0AEND:VEVENT%0AEND:VCALENDAR" 
                                  download="creator-webinars-session1.ics"
                                  className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  <svg className="w-4 h-4 mr-1.5 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Apple Calendar
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 flex items-center justify-center">
                      {inlineFormPhase < 3 && (
                        <p className="text-sm inline-flex items-center text-slate-600">
                          <Star className="h-4 w-4 text-amber-500 fill-current mr-1" />
                          Sessions start February 19, 2025
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        {/* Success Stories / Apps Grid - Similar to Uscreen */}
        <section className="py-16 bg-slate-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
                Creator Showcase
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">Meet our creator participants</h2>
              <p className="text-slate-600">
                A glimpse at the amazing creators who have attended our webinars
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden aspect-square bg-slate-100 transform transition-all hover:scale-[1.03] hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-xl font-bold ${i % 2 === 0 ? 'text-amber-500' : 'text-orange-500'}`}>
                      {String.fromCharCode(65 + (i % 26))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="font-medium text-sm">Creator {i+1}</p>
                    <p className="text-xs opacity-80">Content category</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-4">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center mr-3">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Creator Webinars</h2>
              </div>
              <p className="text-amber-100 mb-6">
                Join our free webinar series with passionate creators learning, sharing, and growing together. A collaboration between REACH Nationals & Shine Talent Group.
              </p>
              
              <div className="flex space-x-3 mb-6">
                <a href="#" className="w-9 h-9 rounded-full bg-amber-800 flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-amber-800 flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-amber-800 flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-amber-800 flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="font-medium text-lg mb-4 text-amber-200">Explore</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#curriculum" className="text-amber-100 hover:text-white text-sm">Sessions</a></li>
                <li><a href="#speakers" className="text-amber-100 hover:text-white text-sm">Speakers</a></li>
                <li><a href="#faq" className="text-amber-100 hover:text-white text-sm">FAQ</a></li>
                <li><a href="#join" className="text-amber-100 hover:text-white text-sm">Join Us</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="font-medium text-lg mb-4 text-amber-200">Partners</h3>
              <ul className="space-y-2">
                <li><a href="https://reachnatl.com/" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-white text-sm">REACH Nationals</a></li>
                <li><a href="https://www.shinetalentgroup.com/" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-white text-sm">Shine Talent Group</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setShowContactPopup(true); }} className="text-amber-100 hover:text-white text-sm cursor-pointer">Partner With Us</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-4">
              <h3 className="font-medium text-lg mb-4 text-amber-200">Join our newsletter</h3>
              <p className="text-amber-100 text-sm mb-4">
                Get the latest news and resources for creators delivered to your inbox.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex mb-4">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-amber-800 border-amber-700 text-white rounded-l-md rounded-r-none focus:ring-amber-500" 
                  value={contactFormData.newsletterEmail || ''}
                  onChange={(e) => setContactFormData(prev => ({...prev, newsletterEmail: e.target.value}))}
                />
                <Button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 rounded-l-none"
                  onClick={() => {
                    alert('Thanks for subscribing to our newsletter!');
                    setContactFormData(prev => ({...prev, newsletterEmail: ''}));
                  }}
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-amber-200 text-xs">
                <Calendar className="h-3 w-3 inline-block mr-1" />
                Next session: February 19, 2025 • <Clock className="h-3 w-3 inline-block mx-1" /> 9 AM PT / 12 PM EST
              </p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-amber-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-amber-200 mb-4 md:mb-0">© 2025 Creator Webinars. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-amber-200 hover:text-white text-sm">Terms</Link>
              <Link href="/privacy" className="text-amber-200 hover:text-white text-sm">Privacy</Link>
              <Link href="/cookies" className="text-amber-200 hover:text-white text-sm">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Popups */}
      {showContactPopup && <ContactFormPopup />}
      {showJoinPopup && <JoinWebinarPopup />}
      {selectedSession && <SessionDetailPopup />}

      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <h3 className="text-lg font-bold">Dashboard Testing</h3>
        <p className="mb-2">Having trouble accessing the dashboard? Try these links:</p>
        <div className="flex space-x-4">
          <Link href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded-md">App Router Dashboard</Link>
          <a href="/dashboard/index.html" className="px-4 py-2 bg-green-500 text-white rounded-md">Static Dashboard</a>
          <Link href="/dashboard-test" className="px-4 py-2 bg-purple-500 text-white rounded-md">Test Dashboard</Link>
        </div>
      </div>
    </div>
  );
}