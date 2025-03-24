"use client";

import Image from "next/image";
import { Calendar, Users, MapPin, Award, ArrowRight } from "lucide-react";
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
      icon: <Users className="h-8 w-8 text-purple-500" />,
    },
    {
      id: 2,
      title: "Self-Managed vs. Having a Manager",
      date: "March 12, 2025 | 9 AM PST", 
      description: "Learn when to seek management, green & red flags in managers, and how to navigate talent relationships.",
      icon: <Users className="h-8 w-8 text-purple-500" />,
    },
    {
      id: 3,
      title: "Pitch Party: Crafting Effective Brand Pitches",
      date: "April 9, 2025 | 9 AM PST",
      description: "Connect with dream brands, build compelling brand-friendly strategies, and align content & brand goals.",
      icon: <Award className="h-8 w-8 text-purple-500" />,
    },
    {
      id: 4,
      title: "Maximizing Revenue: Building Sustainable Income Streams",
      date: "April 30, 2025 | 9 AM PST",
      description: "Explore revenue streams: partnerships, affiliates, merch, NIL. Build audience loyalty & subscription revenue.",
      icon: <Award className="h-8 w-8 text-purple-500" />,
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            The Next Generation of Creators
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Empowering the Next Generation of Content Creators & Digital Professionals
          </p>
          <Button className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-6 rounded-full">
            Register Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 to-transparent"></div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Program Overview */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Program Overview</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                REACH Nationals and Shine Talent Group have partnered to launch The Next Generation of Creators — 
                a free 4-session virtual curriculum designed to equip aspiring content creators with expert insights, 
                actionable strategies, and real-world applications.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 border-purple-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl text-purple-700">
                    <Calendar className="mr-2 h-5 w-5" /> Free 4-Session Curriculum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Expert-led webinars and Q&As designed for creators, managers, and digital professionals.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl text-blue-700">
                    <MapPin className="mr-2 h-5 w-5" /> National IRL Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Culminating in-person events in major creator markets with networking and pitch opportunities.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-pink-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl text-pink-700">
                    <Award className="mr-2 h-5 w-5" /> Why Now?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">With 1 in 3 young Americans aspiring to be influencers and 84% of creators worried about platform uncertainty, it's never been more critical to diversify skills & income streams.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Curriculum Schedule */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Curriculum Schedule</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                50-minute webinars (30 min content + 20 min Q&A)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sessions.map((session) => (
                <Card key={session.id} className="border-2 border-purple-100 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-purple-700">{session.title}</CardTitle>
                      {session.icon}
                    </div>
                    <CardDescription className="text-purple-500 font-medium">
                      <Calendar className="inline mr-2 h-4 w-4" />
                      {session.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{session.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="text-purple-700 border-purple-300 hover:bg-purple-50">
                      Add to Calendar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* IRL Events */}
          <section className="mb-20 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Culminating IRL Events</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Join us in major creator markets for exclusive in-person events
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">Meet Industry Leaders</h3>
                <p className="text-gray-600">Connect with experts from REACH Nationals and Shine Talent Group</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-blue-700 mb-3">Live Pitch Opportunities</h3>
                <p className="text-gray-600">Present your ideas for brand deals and potential representation</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-pink-700 mb-3">Exclusive Workshops</h3>
                <p className="text-gray-600">Participate in hands-on workshops, networking, and gain access to exclusive content</p>
              </div>
            </div>
          </section>

          {/* About the Organizations */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Meet the Organizations</h2>
            </div>
            
            <Tabs defaultValue="reach" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="reach">REACH Nationals</TabsTrigger>
                <TabsTrigger value="shine">Shine Talent Group</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reach" className="p-6 bg-purple-50 rounded-xl">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3 flex justify-center">
                    <div className="w-48 h-48 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 text-xl font-bold">
                      REACH Nationals
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-bold text-purple-700 mb-4">About REACH Nationals</h3>
                    <p className="text-gray-700 mb-4">
                      Founded at USC and now nationwide, REACH Nationals empowers creators with resources, mentorship, and education across 75+ Universities with 2,500+ Creators and a combined following of 300M+.
                    </p>
                    <p className="text-gray-700 mb-4">
                      <span className="font-semibold">Alumni include:</span> Alan Chikin Chow, PartyShirt, Mia Finney, Cosette, and more.
                    </p>
                    <div className="mt-4">
                      <p className="italic text-purple-700">
                        "We're creating a curriculum that not only educates but inspires creators to achieve their fullest potential."
                      </p>
                      <p className="font-semibold">— Dylan Huey, REACH Nationals</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shine" className="p-6 bg-blue-50 rounded-xl">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3 flex justify-center">
                    <div className="w-48 h-48 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-xl font-bold">
                      Shine Talent Group
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-bold text-blue-700 mb-4">About Shine Talent Group</h3>
                    <p className="text-gray-700 mb-4">
                      Shine Talent Group is a global, award-winning influencer talent management agency representing 250+ creators across LA, London, NYC, and Toronto.
                    </p>
                    <p className="text-gray-700 mb-4">
                      <span className="font-semibold">Notable clients:</span> Amazon, McDonald's, Nintendo, Target, Hilton, Clinique.
                    </p>
                    <div className="mt-4">
                      <p className="italic text-blue-700">
                        "We're excited to spotlight talent management and revenue strategies, guiding creators to build sustainable careers."
                      </p>
                      <p className="font-semibold">— Jess Hunichen, Shine Talent Group</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          {/* FAQ Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-gray-800">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Registration CTA */}
          <section className="mb-20 bg-gradient-to-r from-purple-600 to-pink-500 p-8 md:p-12 rounded-2xl text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the Next Generation?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Register now for our free 4-part webinar series and take the first step toward building a sustainable creator career.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/90 text-gray-800 border-0"
              />
              <Button className="bg-white text-purple-700 hover:bg-gray-100">
                Register Now
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">The Next Generation of Creators</h3>
              <p className="text-gray-400">
                A partnership between REACH Nationals and Shine Talent Group to empower the next wave of digital creators.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">General: info@reachnationals.org</p>
              <p className="text-gray-400">Press: press@shinetalentgroup.com</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <Separator className="bg-gray-700 mb-8" />
          
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 The Next Generation of Creators. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}