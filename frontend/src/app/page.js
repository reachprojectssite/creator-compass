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
      {/* Rest of the component implementation */}
    </div>
  );
}