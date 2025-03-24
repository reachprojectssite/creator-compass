```javascript
"use client";

import Image from "next/image";
import { Calendar, Users, MapPin, Award, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  // Mock data for the curriculum sessions
  const sessions = [
    {
      id: 1,
      title: "In Front of or Behind the Camera: Exploring Career Paths",
      date: "Feb 19, 2025 | 9 AM PST",
      description: "Explore roles like Creator, Manager, Social Strategist. Learn about industry trends & opportunities and find your fit.",
    },
    {
      id: 2,
      title: "Self-Managed vs. Having a Manager", 
      date: "March 12, 2025 | 9 AM PST",
      description: "Learn when to seek management, green & red flags in managers, and how to navigate talent relationships.",
    },
    {
      id: 3,
      title: "Pitch Party: Crafting Effective Brand Pitches",
      date: "April 9, 2025 | 9 AM PST", 
      description: "Connect with dream brands, build compelling brand-friendly strategies, and align content & brand goals.",
    },
    {
      id: 4,
      title: "Maximizing Revenue: Building Sustainable Income Streams",
      date: "April 30, 2025 | 9 AM PST",
      description: "Explore revenue streams: partnerships, affiliates, merch, NIL. Build audience loyalty & subscription revenue.",
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: "Who can join?",
      answer: "This program is designed for aspiring content creators, managers, and digital professionals at any stage of their career. Whether you're just starting out or looking to level up your skills, you're welcome to join."
    },
    {
      question: "Do I need experience?", 
      answer: "No prior experience is required. Our curriculum is designed to benefit creators at all levels, from beginners to those with established platforms."
    },
    {
      question: "Is there a cost?",
      answer: "The 4-session virtual curriculum is completely free. The culminating IRL events may have associated costs, which will be communicated closer to the event dates."
    },
    {
      question: "How do I participate in the webinars?",
      answer: "After registration, you'll receive calendar invites with links to join each virtual session. All webinars will be recorded and made available to registered participants."
    },
    {
      question: "Will I get to interact with the speakers?",
      answer: "Yes! Each 50-minute webinar includes 30 minutes of content followed by a 20-minute Q&A session where you can ask questions directly to our industry experts."
    }
  ];

  // Stats for the program
  const stats = [
    { value: "75+", label: "Universities" },
    { value: "2,500+", label: "Creators" }, 
    { value: "300M+", label: "Combined Following" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Announcement Bar */}
      <div className="bg-blue-600 text-white py-3 px-4 text-center text-sm">
        Limited-Time: Free 4-Session Virtual Curriculum for Aspiring Content Creators
        <Button variant="link" className="text-white underline ml-2 p-0 h-auto">
          Register Now
        </Button>
        <button className="absolute right-2 top-3 text-white/80 hover:text-white">×</button>
      </div>

      {/* Navigation */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="text-2xl font-bold">
            Creator Compass
          </div>
          <div className="hidden md:flex space-x-1">
            <Button variant="ghost" className="text-gray-700">About</Button>
            <Button variant="ghost" className="text-gray-700">Curriculum</Button>
            <Button variant="ghost" className="text-gray-700">Events</Button>
            <Button variant="ghost" className="text-gray-700">FAQ</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 ml-4">Register Now</Button>
          </div>
          <Button variant="ghost" className="md:hidden">☰</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The Next Generation of Creators
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-600">
                Empowering the Next Generation of Content Creators & Digital Professionals
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-md text-lg">
                  Register Now
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-md text-lg">
                  Download Curriculum
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">No credit card required or signup fees</p>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 w-full h-[300px]">
                  <div className="flex items-center justify-center h-full bg-gradient-to-r from-purple-100 to-blue-100">
                    <div className="text-center p-8">
                      <div className="text-5xl font-bold text-blue-600 mb-4">4-Part</div>
                      <div className="text-2xl font-semibold text-gray-800">Free Webinar Series</div>
                      <div className="mt-4 text-gray-600">Starting Feb 19, 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">REACH Nationals has helped over 2,500+ creators succeed</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="uppercase tracking-wider text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About the Program</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              REACH Nationals and Shine Talent Group have partnered to launch The Next Generation of Creators — 
              a free 4-session virtual curriculum designed to equip aspiring content creators with expert insights, 
              actionable strategies, and real-world applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 mb-4">
                <Calendar className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">Free 4-Session Curriculum</h3>
              <p className="text-gray-600">
                Expert-led webinars and Q&As designed for creators, managers, and digital professionals.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 mb-4">
                <MapPin className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">National IRL Events</h3>
              <p className="text-gray-600">
                Culminating in-person events in major creator markets with networking and pitch opportunities.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 mb-4">
                <Award className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">Why Now?</h3>
              <p className="text-gray-600">
                With 1 in 3 young Americans aspiring to be influencers and 84% of creators worried about platform uncertainty, it's never been more critical to diversify skills & income streams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Schedule */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Curriculum Schedule</h2>
            <p className="text-xl text-gray-600">
              50-minute webinars (30 min content + 20 min Q&A)
            </p>
          </div>
          
          <div className="space-y-6">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <div className="text-blue-600 font-semibold flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {session.date}
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold mb-2">{session.title}</h3>
                    <p className="text-gray-600 mb-4">{session.description}</p>
                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizations */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Organizations</h2>
          </div>
          
          <Tabs defaultValue="reach" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-12">
              <TabsTrigger value="reach" className="text-lg py-3">REACH Nationals</TabsTrigger>
              <TabsTrigger value="shine" className="text-lg py-3">Shine Talent Group</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reach">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-2/5">
                  <div className="bg-blue-100 rounded-lg p-8 aspect-square flex items-center justify-center">
                    <div className="text-3xl font-bold text-blue-600">REACH Nationals</div>
                  </div>
                </div>
                <div className="md:w-3/5">
                  <h3 className="text-2xl font-bold mb-4">About REACH Nationals</h3>
                  <p className="text-gray-700 mb-6">
                    Founded at USC and now nationwide, REACH Nationals empowers creators with resources, mentorship, and education across 75+ Universities with 2,500+ Creators and a combined following of 300M+.
                  </p>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Alumni include:</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-blue-600 mr-2" />
                        Alan Chikin Chow
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-blue-600 mr-2" />
                        PartyShirt
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-blue-600 mr-2" />
                        Mia Finney
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-blue-600 mr-2" />
                        Cosette
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="italic text-gray-700 mb-2">
                      "We're creating a curriculum that not only educates but inspires creators to achieve their fullest potential."
                    </p>
                    <p className="font-semibold">— Dylan Huey, REACH Nationals</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shine">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-2/5">
                  <div className="bg-purple-100 rounded-lg p-8 aspect-square flex items-center justify-center">
                    <div className="text-3xl font-bold text-purple-600">Shine Talent Group</div>
                  </div>
                </div>
                <div className="md:w-3/5">
                  <h3 className="text-2xl font-bold mb-4">About Shine Talent Group</h3>
                  <p className="text-gray-700 mb-6">
                    Shine Talent Group is a global, award-winning influencer talent management agency representing 250+ creators across LA, London, NYC, and Toronto.
                  </p>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Notable clients:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-purple-600 mr-2" />
                        Amazon
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-purple-600 mr-2" />
                        McDonald's
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-purple-600 mr-2" />
                        Nintendo
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-purple-600 mr-2" />
                        Target
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-purple-600 mr-2" />
                        Hilton
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-purple-600 mr-2" />
                        Clinique
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="italic text-gray-700 mb-2">
                      "We're excited to spotlight talent management and revenue strategies, guiding creators to build sustainable careers."
                    </p>
                    <p className="font-semibold">— Jess Hunichen, Shine Talent Group</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* IRL Events */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Culminating IRL Events</h2>
              <p className="text-xl text-gray-600 mb-8">
                Join us in major creator markets for exclusive in-person events
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Meet Industry Leaders</h3>
                    <p className="text-gray-600">Connect with experts from REACH Nationals and Shine Talent Group</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Live Pitch Opportunities</h3>
                    <p className="text-gray-600">Present your ideas for brand deals and potential representation</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Exclusive Workshops</h3>
                    <p className="text-gray-600">Participate in hands-on workshops, networking, and gain access to exclusive content</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Learn More About Events
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="relative">
                <div className="bg-white rounded-lg shadow-lg p-8 relative z-10">
                  <div className="bg-gray-100 rounded-lg mb-6 h-[200px] flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Major Creator Markets</h3>
                  <p className="text-gray-600 mb-4">
                    Events will be held in key locations where creators and brands connect.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Los Angeles</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">New York</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Miami</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Chicago</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">+ More TBA</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 w-full h-full bg-blue-200 rounded-lg -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-lg font-medium text-gray-800 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-16 md:py-24 px-4 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Creator Journey Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Register now for our free 4-part webinar series and take the first step toward building a sustainable creator career.
          </p>
          
          <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Register for Free</h3>
            <div className="space-y-4">
              <Input 
                type="text" 
                placeholder="Full Name" 
                className="bg-gray-50 border-gray-200"
              />
              <Input 
                type="email" 
                placeholder="Email Address" 
                className="bg-gray-50 border-gray-200"
              />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Secure Your Spot
              </Button>
              <p className="text-xs text-gray-500 text-center">
                No credit card required. By registering, you agree to receive updates about the program.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">The Next Generation of Creators</h3>
              <p className="text-gray-400 mb-4">
                A partnership between REACH Nationals and Shine Talent Group to empower the next wave of digital creators.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-