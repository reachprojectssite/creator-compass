"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  Globe, 
  MessageSquare, 
  Calendar, 
  Clock, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Star,
  ChevronRight,
  PlusCircle,
  UserPlus,
  UserMinus,
  Mail,
  ArrowLeft,
  X as XIcon,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  List,
  BarChart3,
  TrendingUp,
  Shield,
  Search,
  MoreHorizontal,
  Check,
  Share,
  DollarSign,
  Laptop,
  Lock,
  CreditCard,
  Heart,
  ChevronLeft,
  Image,
  UserRound,
  UserSearch,
  Phone,
  Send,
  Tag,
  Target,
  RefreshCw,
  MapPin,
  Video,
  Camera,
  Mic,
  Link as LinkIcon,
  Home,
  Edit,
  Coins,
  BarChart2,
  Eye,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReliableButton from "@/components/ReliableButton";

export default function Dashboard() {
  console.log("Dashboard component is rendering");
  
  // Active section/view state
  const [activeSection, setActiveSection] = useState("home");
  
  // Debug current section
  useEffect(() => {
    console.log("Active section changed to:", activeSection);
  }, [activeSection]);
  
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Search function
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Search in webinars
    const webinarMatches = upcomingWebinars
      .filter(webinar => 
        webinar.title.toLowerCase().includes(lowerQuery) || 
        webinar.description.toLowerCase().includes(lowerQuery) ||
        (webinar.speakers && webinar.speakers.some(speaker => 
          speaker.toLowerCase().includes(lowerQuery)
        ))
      )
      .map(webinar => ({
        id: `webinar-${webinar.id}`,
        type: 'webinar',
        title: webinar.title,
        subtitle: webinar.date,
        icon: <CalendarDays size={16} />,
        action: () => {
          handleViewWebinarDetails(webinar);
          setShowSearchResults(false);
          setSearchQuery("");
        }
      }));
    
    // Search in previous webinars
    const prevWebinarMatches = previousWebinars
      .filter(webinar => 
        webinar.title.toLowerCase().includes(lowerQuery) || 
        webinar.description.toLowerCase().includes(lowerQuery) ||
        (webinar.speakers && webinar.speakers.some(speaker => 
          speaker.toLowerCase().includes(lowerQuery)
        ))
      )
      .map(webinar => ({
        id: `prev-webinar-${webinar.id}`,
        type: 'previous-webinar',
        title: webinar.title,
        subtitle: webinar.date,
        icon: <Video size={16} />,
        action: () => {
          handleViewPreviousWebinar(webinar.id);
          setShowSearchResults(false);
          setSearchQuery("");
        }
      }));
    
    // Search in communities
    const communityMatches = communities
      .filter(community => 
        community.name.toLowerCase().includes(lowerQuery) || 
        community.description.toLowerCase().includes(lowerQuery) ||
        community.category.toLowerCase().includes(lowerQuery)
      )
      .map(community => ({
        id: `community-${community.id}`,
        type: 'community',
        title: community.name,
        subtitle: `${community.members} members`,
        icon: <Users size={16} />,
        action: () => {
          navigateToSection("communities");
          handleViewCommunityDetails(community);
          setShowSearchResults(false);
          setSearchQuery("");
        }
      }));
    
    // Search in people (friends and discover users)
    const peopleMatches = [...friends, ...discoverUsers]
      .filter(person => 
        person.name.toLowerCase().includes(lowerQuery) || 
        person.role.toLowerCase().includes(lowerQuery) ||
        (person.bio && person.bio.toLowerCase().includes(lowerQuery)) ||
        (person.location && person.location.toLowerCase().includes(lowerQuery)) ||
        (person.tags && person.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      )
      .map(person => ({
        id: `person-${person.id}`,
        type: 'person',
        title: person.name,
        subtitle: person.role,
        icon: <UserRound size={16} />,
        action: () => {
          navigateToSection("people");
          handleViewProfile(person);
          setShowSearchResults(false);
          setSearchQuery("");
        }
      }));
    
    // Search in resources
    const resourceMatches = resources
      .filter(resource => 
        resource.title.toLowerCase().includes(lowerQuery) || 
        resource.description.toLowerCase().includes(lowerQuery) || 
        resource.category.toLowerCase().includes(lowerQuery)
      )
      .map(resource => ({
        id: `resource-${resource.id}`,
        type: 'resource',
        title: resource.title,
        subtitle: resource.category,
        icon: <FileText size={16} />,
        action: () => {
          navigateToSection("resources");
          handleDownloadResource(resource);
          setShowSearchResults(false);
          setSearchQuery("");
        }
      }));
    
    // Navigation shortcuts
    const navShortcuts = [
      { id: "nav-home", title: "Home", section: "home", icon: <Home size={16} /> },
      { id: "nav-webinars", title: "Upcoming Webinars", section: "upcomingWebinars", icon: <CalendarDays size={16} /> },
      { id: "nav-calendar", title: "Calendar", section: "calendar", icon: <Calendar size={16} /> },
      { id: "nav-previous", title: "Previous Webinars", section: "previousWebinars", icon: <Clock size={16} /> },
      { id: "nav-resources", title: "Resources", section: "resources", icon: <FileText size={16} /> },
      { id: "nav-people", title: "People", section: "people", icon: <Users size={16} /> },
      { id: "nav-communities", title: "Communities", section: "communities", icon: <Globe size={16} /> },
      { id: "nav-chat", title: "Chat", section: "chat", icon: <MessageSquare size={16} /> },
      { id: "nav-settings", title: "Settings", section: "settings", icon: <Settings size={16} /> }
    ]
      .filter(item => item.title.toLowerCase().includes(lowerQuery))
      .map(item => ({
        id: item.id,
        type: 'navigation',
        title: item.title,
        subtitle: "Navigate to section",
        icon: item.icon,
        action: () => {
          navigateToSection(item.section);
          setShowSearchResults(false);
          setSearchQuery("");
        }
      }));
    
    // Combine all results
    const allResults = [
      ...navShortcuts,
      ...webinarMatches, 
      ...prevWebinarMatches, 
      ...communityMatches, 
      ...peopleMatches, 
      ...resourceMatches
    ];
    
    setSearchResults(allResults);
    setShowSearchResults(true);
  };
  
  // Handle search input change
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // New interactive state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [friendRequests, setFriendRequests] = useState([
    {
      id: 11,
      name: "Alex Rivera",
      avatar: null,
      role: "Filmmaker",
      timestamp: "2 days ago",
      requestDate: "2 days ago",
      bio: "Independent filmmaker focusing on documentaries about social issues.",
      mutualConnections: 3
    },
    {
      id: 12,
      name: "Taylor Wong",
      avatar: null,
      role: "Blogger",
      timestamp: "1 week ago",
      requestDate: "1 week ago",
      bio: "Writing about productivity and mindfulness for creative professionals.",
      mutualConnections: 1
    }
  ]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [notifications, setNotifications] = useState(3);
  
  // Webinar interactive state
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [showWebinarDetails, setShowWebinarDetails] = useState(false);
  const [registeredWebinars, setRegisteredWebinars] = useState([1]); // IDs of webinars user is registered for
  
  // Mock friends data
  const [friends, setFriends] = useState([
    { id: 1, name: "Michael Brown", avatar: null, role: "Content Strategist", online: true, connected: true, lastActive: "Just now", bio: "Helping creators optimize their content strategy across platforms. 10+ years in digital marketing.", location: "New York, NY", connectionDate: "Connected 8 months ago", collaborations: 2, recentContent: "Published 'Content Strategy for 2025' ebook", tags: ["Strategy", "Marketing", "Monetization"] },
    { id: 2, name: "Lisa Garcia", avatar: null, role: "Videographer", online: false, connected: true, lastActive: "3 hours ago", bio: "Documentary filmmaker with a focus on cultural stories. Emmy-nominated for 'Voices Unheard' series.", location: "Los Angeles, CA", connectionDate: "Connected 1 year ago", collaborations: 1, recentContent: "Released documentary 'Urban Gardens'", tags: ["Video", "Documentary", "Film"] },
    { id: 3, name: "Robert Chen", avatar: null, role: "Graphic Designer", online: true, connected: true, lastActive: "35 minutes ago", bio: "Creating brand identities and visual systems for creators and small businesses.", location: "Miami, FL", connectionDate: "Connected 3 months ago", collaborations: 0, recentContent: "Launched design template marketplace", tags: ["Design", "Branding", "Visual"] }
  ]);
  
  // Mock discover users
  const [discoverUsers, setDiscoverUsers] = useState([
    {
      id: 4,
      name: "Chris Smith",
      avatar: null,
      role: "Podcaster",
      bio: "Host of 'Tech Today' podcast - discussing the latest in technology and digital culture.",
      location: "San Francisco, CA",
      followers: 3450,
      content: "120 episodes",
      online: true,
      connected: false,
      pending: false,
      mutualConnections: 2,
      tags: ["Podcasting", "Tech", "Interviews"]
    },
    {
      id: 5,
      name: "Emma Chen",
      avatar: null,
      role: "Writer",
      bio: "Freelance writer specializing in travel and culture. Author of 'Wanderlust: A Digital Nomad's Journey'.",
      location: "Portland, OR",
      followers: 5240,
      content: "85 articles",
      online: false,
      connected: false,
      pending: false,
      mutualConnections: 1,
      tags: ["Writing", "Travel", "Digital Nomad"]
    },
    {
      id: 6,
      name: "David Kim",
      avatar: null,
      role: "Photographer",
      bio: "Landscape and wildlife photographer with a passion for conservation. My work has appeared in National Geographic.",
      location: "Denver, CO",
      followers: 12800,
      content: "350+ photos",
      online: true,
      connected: false,
      pending: false,
      mutualConnections: 0,
      tags: ["Photography", "Nature", "Wildlife"]
    },
    {
      id: 7,
      name: "Sarah Johnson",
      avatar: null,
      role: "Video Creator",
      bio: "Creating educational content on climate science and sustainable living. 500K+ views across platforms.",
      location: "Boston, MA",
      followers: 8750,
      content: "75 videos",
      online: true,
      connected: false,
      pending: false,
      mutualConnections: 5,
      tags: ["Education", "Climate", "Sustainability"]
    },
    {
      id: 8,
      name: "Marcus Williams",
      avatar: null,
      role: "Music Producer",
      bio: "Independent producer specializing in lo-fi and ambient electronic music. Founder of Sunset Collective.",
      location: "Austin, TX",
      followers: 6320,
      content: "28 tracks",
      online: false,
      connected: false,
      pending: false,
      mutualConnections: 2,
      tags: ["Music", "Production", "Electronic"]
    },
    {
      id: 9,
      name: "Priya Patel",
      avatar: null,
      role: "Culinary Creator",
      bio: "Sharing family recipes and fusion cooking ideas. Cookbook 'Spice Routes' coming in 2025.",
      location: "Chicago, IL",
      followers: 9120,
      content: "150+ recipes",
      online: true,
      connected: false,
      pending: false,
      mutualConnections: 1,
      tags: ["Cooking", "Food", "Recipes"]
    },
    {
      id: 10,
      name: "James Wilson",
      avatar: null,
      role: "Illustrator",
      bio: "Digital artist focusing on fantasy and sci-fi concepts. Previously worked at Dreamworks Animation.",
      location: "Seattle, WA",
      followers: 15400,
      content: "220 illustrations",
      online: false,
      connected: false,
      pending: false,
      mutualConnections: 0,
      tags: ["Art", "Illustration", "Digital"]
    }
  ]);
  
  // Communities interactive state
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showCommunityDetails, setShowCommunityDetails] = useState(false);
  const [joinedCommunities, setJoinedCommunities] = useState([]); // IDs of communities the user has joined
  
  // Communities data
  const communityList = [
    {
      id: 1,
      name: "Video Creators Hub",
      description: "A community for video content creators",
      members: 1250,
      image: null
    },
    {
      id: 2,
      name: "Podcast Professionals",
      description: "For podcast creators and audio engineers",
      members: 890,
      image: null
    },
    {
      id: 3,
      name: "Photography Masters",
      description: "Share photography tips and get feedback",
      members: 1560,
      image: null
    }
  ];
  
  // Upcoming webinars data
  const upcomingWebinars = [
    {
      id: 1,
      title: "Monetizing Your Content: Strategies for 2025",
      description: "Join industry experts to learn the latest strategies for monetizing your creative work.",
      longDescription: "In this session, we'll explore multiple revenue streams available to creators in 2025. Our experts will share case studies, practical tips, and actionable strategies you can implement immediately. Topics include: subscription models, affiliate marketing, sponsored content, digital products, and emerging Web3 opportunities.",
      date: "June 15, 2025",
      time: "9 AM PT / 12 PM EST",
      speakers: ["Jane Rodriguez", "Marcus Chen"],
      registered: 147,
      daysLeft: 3
    },
    {
      id: 2,
      title: "Building Your Creator Brand",
      description: "Learn how to establish a consistent brand identity across all your platforms.",
      longDescription: "Your personal brand is your most valuable asset as a creator. This webinar focuses on developing a unique brand identity, creating consistent visual elements, messaging strategies, and positioning yourself within your niche. You'll leave with a brand development workbook and actionable steps to refine your creator brand.",
      date: "July 2, 2025",
      time: "9 AM PT / 12 PM EST",
      speakers: ["Alex Thompson", "Lisa Wang"],
      registered: 98,
      daysLeft: 20
    },
    {
      id: 3,
      title: "Video Production Masterclass",
      description: "Elevate your video content with professional production techniques.",
      longDescription: "Whether you're shooting on a smartphone or professional camera, this masterclass will help you level up your video production quality. Topics include lighting setups on any budget, audio recording essentials, composition techniques, and efficient editing workflows. Both beginners and experienced creators will find valuable takeaways.",
      date: "July 15, 2025",
      time: "9 AM PT / 12 PM EST",
      speakers: ["David Kim", "Rebecca Martinez"],
      registered: 123,
      daysLeft: 33
    },
    {
      id: 4,
      title: "Growth Strategies for New Platforms",
      description: "Stay ahead of the curve by mastering emerging social platforms.",
      longDescription: "As the creator landscape evolves, new platforms continuously emerge. This forward-looking session explores growth strategies for the latest platforms gaining traction. Learn how to evaluate which platforms deserve your attention, how to adapt your content for different environments, and techniques to build audience on emerging platforms before they become mainstream.",
      date: "August 5, 2025",
      time: "9 AM PT / 12 PM EST",
      speakers: ["Michelle Lee", "James Wilson"],
      registered: 75,
      daysLeft: 54
    }
  ];
  
  // Resources interactive state
  const [activeResourceCategory, setActiveResourceCategory] = useState("All Resources");
  const [downloadedResources, setDownloadedResources] = useState([]);
  
  // Resource categories
  const resourceCategories = ["All Resources", "Marketing", "Production", "Monetization", "Growth", "Tools", "Legal"];
  
  // Resources data
  const resources = [
    {
      id: 1,
      title: "Complete Guide to Content Monetization",
      type: "Guide",
      category: "Monetization",
      description: "Learn 12 proven strategies to monetize your content across different platforms.",
      dateAdded: "May 15, 2025",
      fileSize: "2.4 MB"
    },
    {
      id: 2,
      title: "Social Media Content Calendar",
      type: "Template",
      category: "Marketing",
      description: "Stay organized with this ready-to-use content planning template.",
      dateAdded: "May 15, 2025",
      fileSize: "845 KB"
    },
    {
      id: 3,
      title: "Lighting Setup for Professional Videos",
      type: "Video",
      category: "Production",
      description: "Create studio-quality lighting on any budget with these techniques.",
      dateAdded: "May 15, 2025",
      fileSize: "48 MB"
    },
    {
      id: 4,
      title: "Copyright Guidelines for Creators",
      type: "PDF",
      category: "Legal",
      description: "Essential legal information every creator should know about copyright.",
      dateAdded: "June 1, 2025",
      fileSize: "1.2 MB"
    },
    {
      id: 5,
      title: "Audience Growth Tactics Checklist",
      type: "PDF",
      category: "Growth",
      description: "A comprehensive checklist to grow your audience organically.",
      dateAdded: "May 28, 2025",
      fileSize: "845 KB"
    },
    {
      id: 6,
      title: "Brand Partnership Agreement Template",
      type: "Document",
      category: "Legal",
      description: "Protect yourself with this professional brand partnership contract template.",
      dateAdded: "May 24, 2025",
      fileSize: "320 KB"
    },
    {
      id: 7,
      title: "Podcast Launch Checklist",
      type: "Spreadsheet",
      category: "Production",
      description: "Everything you need to launch a successful podcast.",
      dateAdded: "May 20, 2025",
      fileSize: "450 KB"
    }
  ];
  
  // Filter resources by category
  const filteredResources = activeResourceCategory === "All Resources"
    ? resources
    : resources.filter(resource => resource.category === activeResourceCategory);
  
  // Handle resource download
  const handleDownloadResource = (resource) => {
    if (downloadedResources.includes(resource.id)) {
      alert(`Opening ${resource.title}`);
    } else {
      setDownloadedResources(prev => [...prev, resource.id]);
      alert(`Downloading ${resource.title} (${resource.fileSize})`);
    }
  };
  
  // Change resource category
  const handleChangeResourceCategory = (category) => {
    setActiveResourceCategory(category);
  };
  
  // Request a new resource
  const handleRequestResource = () => {
    const resourceType = prompt("What type of resource would you like to request?");
    if (resourceType) {
      alert(`Thank you for your request! We'll consider adding a resource about "${resourceType}" in the future.`);
    }
  };
  
  // Authentication check - this would be replaced with a real auth check
  useEffect(() => {
    // Mock auth check - in a real app, redirect if not logged in
    const isLoggedIn = true; // Replace with actual auth check
    if (!isLoggedIn) {
      window.location.href = "/login";
    }
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Toggle mobile navigation
  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };
  
  // Handle friend request
  const handleConnect = (user) => {
    // In a real app, this would send a friend request to the backend
    alert(`Friend request sent to ${user.name}`);
    
    // Update the discover users list to show pending status
    setDiscoverUsers(prev => 
      prev.map(u => u.id === user.id ? {...u, pending: true} : u)
    );
  };
  
  // Handle friend removal
  const handleRemoveFriend = (friendId) => {
    if (confirm("Are you sure you want to remove this friend?")) {
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
      
      // If we're viewing this user's profile, close it
      if (selectedUser && selectedUser.id === friendId) {
        setShowUserProfile(false);
        setSelectedUser(null);
      }
    }
  };
  
  // View a user profile
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowUserProfile(true);
  };
  
  // Close user profile
  const handleCloseProfile = () => {
    setShowUserProfile(false);
    setSelectedUser(null);
  };
  
  // Accept a friend request
  const handleAcceptRequest = (request) => {
    // Add to friends
    setFriends(prev => [...prev, {...request, connected: true, online: true}]);
    
    // Remove from requests
    setFriendRequests(prev => prev.filter(req => req.id !== request.id));
    
    // Update notifications count
    setNotifications(prev => Math.max(0, prev - 1));
    
    if (friendRequests.length === 1) {
      setShowFriendRequests(false);
    }
  };
  
  // Reject a friend request
  const handleRejectRequest = (requestId) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    setNotifications(prev => Math.max(0, prev - 1));
    
    if (friendRequests.length === 1) {
      setShowFriendRequests(false);
    }
  };

  // Handle webinar registration
  const handleRegisterWebinar = (webinarId) => {
    if (registeredWebinars.includes(webinarId)) {
      // Unregister
      setRegisteredWebinars(prev => prev.filter(id => id !== webinarId));
      alert("You have been unregistered from this webinar.");
    } else {
      // Register
      setRegisteredWebinars(prev => [...prev, webinarId]);
      alert("You have been registered for this webinar!");
    }
  };
  
  // View webinar details
  const handleViewWebinarDetails = (webinar) => {
    setSelectedWebinar(webinar);
    setShowWebinarDetails(true);
  };
  
  // Close webinar details
  const handleCloseWebinarDetails = () => {
    setShowWebinarDetails(false);
    setSelectedWebinar(null);
  };
  
  // Add to calendar 
  const handleAddToCalendar = (webinar) => {
    alert(`Added "${webinar.title}" to your calendar!`);
  };

  // Handle join community - RENAMED to avoid conflict
  const handleJoinCommunityLegacy = (communityId) => {
    if (joinedCommunities.includes(communityId)) {
      if (confirm("Are you sure you want to leave this community?")) {
        // Leave community
        setJoinedCommunities(prev => prev.filter(id => id !== communityId));
        alert("You have left the community.");
      }
    } else {
      // Join community
      setJoinedCommunities(prev => [...prev, communityId]);
      alert("You have joined the community!");
    }
  };
  
  // View community details
  const handleViewCommunityDetails = (community) => {
    setSelectedCommunity(community);
    setShowCommunityDetails(true);
  };
  
  // Close community details
  const handleCloseCommunityDetails = () => {
    setShowCommunityDetails(false);
    setSelectedCommunity(null);
  };

  // Calendar view state
  const [calendarView, setCalendarView] = useState("month"); // "month" or "list"
  
  // Previous webinars sample data
  const [previousWebinars, setPreviousWebinars] = useState([
    {
      id: 101,
      title: "Content Creation Masterclass",
      description: "Learn advanced content creation techniques for multiple platforms.",
      date: "May 10, 2025",
      duration: "1h 45m",
      speakers: ["Jane Smith", "Michael Brown"],
      views: 245,
      favorite: false
    },
    {
      id: 102,
      title: "Monetization Strategies",
      description: "Discover 12 proven ways to monetize your content in 2025.",
      date: "April 28, 2025",
      duration: "2h 10m",
      speakers: ["Alex Johnson"],
      views: 312,
      favorite: true
    }
  ]);

  // Chat section data
  const [chatChannels, setChatChannels] = useState([
    {
      id: 'ch1',
      type: 'channel',
      name: 'general',
      description: 'General discussions',
      unreadCount: 0,
      messages: [
        {
          sender: { id: 'user123', name: 'Alex Johnson', avatar: null },
          content: 'Hi everyone! Has anyone tried the new analytics dashboard?',
          time: '10:25 AM',
          status: 'read'
        },
        {
          sender: { id: 'user456', name: 'Sarah Miller', avatar: null },
          content: 'Yes, it\'s really helpful for tracking engagement!',
          time: '10:28 AM',
          status: 'read'
        },
        {
          sender: { id: 'currentUser', name: 'You', avatar: null },
          content: 'I need to check it out. Where can I find it?',
          time: '10:30 AM',
          status: 'read'
        },
        {
          sender: { id: 'user123', name: 'Alex Johnson', avatar: null },
          content: 'Go to Settings > Analytics > Dashboard',
          time: '10:32 AM',
          status: 'read'
        }
      ]
    },
    {
      id: 'ch2',
      type: 'channel',
      name: 'resources',
      description: 'Share helpful resources',
      unreadCount: 5,
      messages: []
    },
    {
      id: 'ch3',
      type: 'channel',
      name: 'introductions',
      description: 'Introduce yourself!',
      unreadCount: 0,
      messages: []
    }
  ]);
  
  const [chatDirectMessages, setChatDirectMessages] = useState([
    {
      id: 'dm1',
      type: 'direct',
      name: 'Chris Smith',
      status: 'online',
      lastMessage: 'Let me know when you finish that project',
      unreadCount: 2,
      avatar: null,
      messages: [
        {
          sender: { id: 'user789', name: 'Chris Smith', avatar: null },
          content: "Hey, how's the new content strategy coming along?",
          time: 'Yesterday 4:30 PM',
          status: 'read'
        },
        {
          sender: { id: 'currentUser', name: 'You', avatar: null },
          content: "It's going well! I've mapped out the next three months.",
          time: 'Yesterday 4:45 PM',
          status: 'read'
        },
        {
          sender: { id: 'user789', name: 'Chris Smith', avatar: null },
          content: "That's great! Can you present it at the next meeting?",
          time: 'Yesterday 5:00 PM',
          status: 'read'
        },
        {
          sender: { id: 'user789', name: 'Chris Smith', avatar: null },
          content: 'Let me know when you finish that project',
          time: '8:45 AM',
          status: 'delivered'
        }
      ]
    },
    {
      id: 'dm2',
      type: 'direct',
      name: 'Emily Davis',
      status: 'away',
      lastMessage: 'Thanks for the feedback!',
      unreadCount: 0,
      avatar: null,
      messages: []
    },
    {
      id: 'dm3',
      type: 'direct',
      name: 'Michael Wilson',
      status: 'offline',
      lastMessage: 'See you at the workshop next week',
      unreadCount: 0,
      avatar: null,
      messages: []
    }
  ]);
  
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState('direct');
  
  // Community-specific chat channels
  const [communityChannels, setCommunityChannels] = useState([
    {
      id: 'cc1',
      type: 'community',
      name: 'announcements',
      community: 'Video Creators Network',
      description: 'Important updates for all members',
      unreadCount: 3,
      participants: 253,
      lastActive: '2 hours ago',
      messages: []
    },
    {
      id: 'cc2',
      type: 'community',
      name: 'collaborations',
      community: 'Video Creators Network',
      description: 'Find partners for your next project',
      unreadCount: 0,
      participants: 98,
      lastActive: 'Yesterday',
      messages: []
    },
    {
      id: 'cc3',
      type: 'community',
      name: 'tech-support',
      community: 'Podcasters United',
      description: 'Help with equipment and software',
      unreadCount: 1,
      participants: 75,
      lastActive: '3 days ago',
      messages: []
    }
  ]);
  
  // Platform-wide chat channels
  const [platformChannels, setPlatformChannels] = useState([
    {
      id: 'pc1',
      type: 'platform',
      name: 'General Chat',
      category: 'General',
      description: 'Chat with creators from all communities',
      participants: 523,
      unreadCount: 2,
      featured: true,
      joined: true,
      messages: []
    },
    {
      id: 'pc2',
      type: 'platform',
      name: 'Feedback & Suggestions',
      category: 'Platform',
      description: 'Share your ideas to improve Creator Compass',
      participants: 189,
      unreadCount: 0,
      featured: true,
      joined: true,
      messages: []
    },
    {
      id: 'pc3',
      type: 'platform',
      name: 'Job Opportunities',
      category: 'Careers',
      description: 'Hiring or looking for work in the creator economy',
      participants: 312,
      unreadCount: 0,
      featured: false,
      joined: false,
      messages: []
    },
    {
      id: 'pc4',
      type: 'platform',
      name: 'New Member Welcome',
      category: 'Community',
      description: 'Introduce yourself to the Creator Compass family',
      participants: 421,
      unreadCount: 0,
      featured: false,
      joined: true,
      messages: []
    },
    {
      id: 'pc5',
      type: 'platform',
      name: 'Trending Topics',
      category: 'Discussion',
      description: 'What\'s hot in the creator world right now',
      participants: 267,
      unreadCount: 0,
      featured: false,
      joined: false,
      messages: []
    }
  ]);
  
  // Handle sending a chat message
  const handleSendMessage = (message) => {
    if (!message.trim()) return;
    
    // Add the message to the current channel
    if (selectedChannel) {
      const newMessage = {
        sender: { id: 'currentUser', name: 'You', avatar: null },
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      };
      
      setSelectedChannel(prev => ({
        ...prev,
        messages: [...(prev.messages || []), newMessage]
      }));
      
      // Update the channel in the channels list
      if (selectedChannel.type === 'channel') {
        setChatChannels(prev => 
          prev.map(channel => 
            channel.id === selectedChannel.id 
              ? { ...channel, messages: [...(channel.messages || []), newMessage] }
              : channel
          )
        );
      } else if (selectedChannel.type === 'direct') {
        setChatDirectMessages(prev => 
          prev.map(dm => 
            dm.id === selectedChannel.id 
              ? { ...dm, messages: [...(dm.messages || []), newMessage], lastMessage: message }
              : dm
          )
        );
      }
      
      setChatMessage('');
    }
  };
  
  // Communities data
  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: "Video Creators Network",
      description: "A community for video creators to share tips, collaborate, and grow together.",
      members: 1247,
      category: "Video",
      coverImage: null,
      joined: true,
      posts: [
        {
          id: 101,
          author: {
            name: "Sarah Miller",
            avatar: null,
            role: "Community Leader"
          },
          content: "Just released a new tutorial on color grading in DaVinci Resolve! Check it out and let me know what you think.",
          timestamp: "2 hours ago",
          likes: 24,
          comments: 8,
          liked: false
        },
        {
          id: 102,
          author: {
            name: "Alex Johnson",
            avatar: null,
            role: "Member"
          },
          content: "Looking for collaborators for a new YouTube series about sustainable living. DM me if interested!",
          timestamp: "Yesterday",
          likes: 15,
          comments: 12,
          liked: true
        }
      ],
      events: [
        {
          id: 201,
          title: "Live Q&A: Growing Your Channel in 2025",
          date: "June 15, 2025",
          time: "7:00 PM EST",
          attendees: 78,
          registered: true
        },
        {
          id: 202,
          title: "Workshop: Advanced Editing Techniques",
          date: "June 22, 2025",
          time: "3:00 PM EST",
          attendees: 42,
          registered: false
        }
      ]
    },
    {
      id: 2,
      name: "Podcasters United",
      description: "For podcast creators to exchange ideas, improve audio quality, and build audiences.",
      members: 856,
      category: "Audio",
      coverImage: null,
      joined: true,
      posts: [
        {
          id: 103,
          author: {
            name: "David Chen",
            avatar: null,
            role: "Moderator"
          },
          content: "What microphone setup is everyone using these days? Looking to upgrade my home studio.",
          timestamp: "4 hours ago",
          likes: 19,
          comments: 32,
          liked: false
        }
      ],
      events: [
        {
          id: 203,
          title: "Panel: Monetization Strategies for Podcasters",
          date: "June 18, 2025",
          time: "6:00 PM EST",
          attendees: 63,
          registered: true
        }
      ]
    },
    {
      id: 3,
      name: "Content Creators Hub",
      description: "A general community for all types of content creators to network and share experiences.",
      members: 2145,
      category: "General",
      coverImage: null,
      joined: false,
      posts: [],
      events: []
    },
    {
      id: 4,
      name: "Photography Masters",
      description: "Professional and amateur photographers sharing techniques and critique.",
      members: 943,
      category: "Photography",
      coverImage: null,
      joined: false,
      posts: [],
      events: []
    }
  ]);
  
  // Update existing joinedCommunities to use community state
  useEffect(() => {
    // Set joined communities based on the communities state
    setJoinedCommunities(communities.filter(c => c.joined).map(c => c.id));
  }, [communities]);
  
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [activeCommunityTab, setActiveCommunityTab] = useState("feed");
  const [communityPost, setCommunityPost] = useState("");
  
  // Handle joining a community
  const handleJoinCommunity = (communityId) => {
    setCommunities(prev => 
      prev.map(community => 
        community.id === communityId 
          ? { ...community, joined: true }
          : community
      )
    );
  };
  
  // Handle leaving a community
  const handleLeaveCommunity = (communityId) => {
    if (confirm("Are you sure you want to leave this community?")) {
      setCommunities(prev => 
        prev.map(community => 
          community.id === communityId 
            ? { ...community, joined: false }
            : community
        )
      );
      
      // If viewing this community, go back to list view
      if (activeCommunity && activeCommunity.id === communityId) {
        setActiveCommunity(null);
      }
    }
  };
  
  // Handle liking a post
  const handleLikePost = (communityId, postId) => {
    setCommunities(prev => 
      prev.map(community => {
        if (community.id === communityId) {
          const updatedPosts = community.posts.map(post => {
            if (post.id === postId) {
              return { 
                ...post, 
                liked: !post.liked, 
                likes: post.liked ? post.likes - 1 : post.likes + 1 
              };
            }
            return post;
          });
          return { ...community, posts: updatedPosts };
        }
        return community;
      })
    );
  };
  
  // Handle submitting a new post
  const handleSubmitPost = (communityId) => {
    if (!communityPost.trim()) return;
    
    const newPost = {
      id: Date.now(),
      author: {
        name: "You",
        avatar: null,
        role: "Member"
      },
      content: communityPost,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      liked: false
    };
    
    setCommunities(prev => 
      prev.map(community => 
        community.id === communityId 
          ? { ...community, posts: [newPost, ...community.posts] }
          : community
      )
    );
    
    setCommunityPost("");
  };
  
  // Handle registering for event
  const handleRegisterForEvent = (communityId, eventId) => {
    setCommunities(prev => 
      prev.map(community => {
        if (community.id === communityId) {
          const updatedEvents = community.events.map(event => {
            if (event.id === eventId) {
              return { 
                ...event, 
                registered: !event.registered,
                attendees: event.registered ? event.attendees - 1 : event.attendees + 1
              };
            }
            return event;
          });
          return { ...community, events: updatedEvents };
        }
        return community;
      })
    );
    
    // Show feedback to the user
    const community = communities.find(c => c.id === communityId);
    const event = community?.events.find(e => e.id === eventId);
    
    if (event) {
      const isNowRegistered = !event.registered;
      const message = isNowRegistered 
        ? `You have registered for "${event.title}". We'll send you a reminder before it starts.`
        : `You have unregistered from "${event.title}".`;
      
      alert(message);
    }
  };
  
  // Filter communities by joined status
  const [showOnlyJoinedCommunities, setShowOnlyJoinedCommunities] = useState(false);
  const filteredCommunities = showOnlyJoinedCommunities 
    ? communities.filter(community => community.joined)
    : communities;
    
  // Chat messages state
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      user: "Sarah Johnson", 
      avatar: "SJ", 
      time: "10:23 AM", 
      message: "Has anyone tried the new editing software that was shared in last week's webinar?",
      replies: 3,
      isReply: false,
      isSystem: false
    },
    { 
      id: 2, 
      user: "Michael Chen", 
      avatar: "MC", 
      time: "10:28 AM", 
      message: "Yes! I've been using it for a week now. The interface is much cleaner and the render times are significantly faster. I'd definitely recommend giving it a try.",
      replies: 0,
      isReply: true,
      isSystem: false
    }
  ]);
  
  // Categories for filtering discovery
  const [discoveryCategories, setDiscoveryCategories] = useState([
    { id: "all", name: "All Creators", count: 7, active: true },
    { id: "video", name: "Video", count: 1, active: false },
    { id: "audio", name: "Audio & Podcasts", count: 2, active: false },
    { id: "writing", name: "Writing", count: 1, active: false },
    { id: "visual", name: "Visual Arts", count: 2, active: false },
    { id: "other", name: "Other", count: 1, active: false }
  ]);
  
  // Filter for discovery
  const [discoveryFilter, setDiscoveryFilter] = useState({
    search: "",
    category: "all",
    sortBy: "recommended" // options: recommended, newest, mutual
  });
  
  // Handle viewing previous webinar
  const handleViewPreviousWebinar = (webinarId) => {
    alert(`Playing recording for webinar ID: ${webinarId}`);
  };
  
  // Handle toggling favorite status of a previous webinar
  const handleToggleFavorite = (webinarId) => {
    setPreviousWebinars(prev => 
      prev.map(webinar => 
        webinar.id === webinarId 
          ? {...webinar, favorite: !webinar.favorite} 
          : webinar
      )
    );
  };
  
  // Notification count for friend requests
  const [notificationCount, setNotificationCount] = useState(friendRequests.length);

  // Active people section tab
  const [activePeopleTab, setActivePeopleTab] = useState("friends");

  // Navigation handlers
  const navigateToSection = (sectionId) => {
    console.log(`Navigating to section: ${sectionId}`);
    setActiveSection(sectionId);
    setMobileNavOpen(false);
  };

  // User stats for the home dashboard
  const userStats = {
    name: "Jessica",
    webinarsAttended: 24,
    level: 18,
    connections: 87,
    progress: 72, // progress towards next level (out of 100)
    notesCount: 56,
    certificatesEarned: 8,
  };

  // Daily quests for the home dashboard - updated to be webinar-platform relevant
  const [dailyQuests, setDailyQuests] = useState([
    { id: 1, title: "Attend a live webinar", progress: 0, total: 1, reward: 25, icon: <Globe size={20} className="text-indigo-500" /> },
    { id: 2, title: "Share webinar notes", progress: 0, total: 1, reward: 15, icon: <FileText size={20} className="text-amber-500" /> },
    { id: 3, title: "Connect with 2 speakers", progress: 1, total: 2, reward: 20, icon: <Users size={20} className="text-green-500" /> },
    { id: 4, title: "Give feedback on a session", progress: 0, total: 1, reward: 15, icon: <MessageSquare size={20} className="text-orange-500" /> }
  ]);

  // Mark a quest as completed
  const handleCompleteQuest = (questId) => {
    setDailyQuests(prev => 
      prev.map(quest => 
        quest.id === questId 
          ? { ...quest, progress: quest.total } 
          : quest
      )
    );
  };

  // Settings tab state
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col"
    >
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md py-3 border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            {/* Left side with title and mobile menu */}
            <div className="flex items-center">
              <button 
                className="md:hidden mr-3 text-slate-600 hover:text-amber-500 transition-colors" 
                onClick={toggleMobileNav}
              >
                {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              
              <h1 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                Creator Webinars
              </h1>
            </div>
            
            {/* Right side items */}
            <div className="flex items-center gap-5">
              <div className="relative hidden md:flex items-center search-container">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="py-1.5 pl-9 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64 transition-all"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => {
                    if (searchQuery.trim() && searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                />
                <Search size={16} className="absolute left-3 text-slate-400"/>
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-[70vh] overflow-y-auto">
                    <div className="p-3 border-b border-slate-200">
                      <h3 className="font-semibold text-sm text-slate-800">Search Results ({searchResults.length})</h3>
                    </div>
                    
                    <div className="py-2">
                      {/* Group results by type */}
                      {['navigation', 'webinar', 'previous-webinar', 'community', 'person', 'resource'].map(type => {
                        const typeResults = searchResults.filter(result => result.type === type);
                        if (typeResults.length === 0) return null;
                        
                        return (
                          <div key={type} className="mb-2">
                            <div className="px-3 py-1 bg-slate-50">
                              <h4 className="text-xs font-medium text-slate-500 uppercase">
                                {type === 'navigation' ? 'Navigate To' : 
                                  type === 'webinar' ? 'Upcoming Webinars' :
                                  type === 'previous-webinar' ? 'Previous Webinars' :
                                  type === 'community' ? 'Communities' :
                                  type === 'person' ? 'People' : 'Resources'}
                              </h4>
                            </div>
                            
                            {typeResults.map(result => (
                              <button
                                key={result.id}
                                className="w-full text-left px-4 py-2 hover:bg-amber-50 flex items-center gap-3 transition-colors"
                                onClick={result.action}
                              >
                                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                  {result.icon}
                                </div>
                                <div>
                                  <h3 className="font-medium text-sm text-slate-800">{result.title}</h3>
                                  <p className="text-xs text-slate-500">{result.subtitle}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-2 border-t border-slate-200 bg-slate-50">
                      <p className="text-xs text-center text-slate-500">
                        Press Enter to see all results
                      </p>
                    </div>
                  </div>
                )}
                
                {/* No Results State */}
                {showSearchResults && searchQuery.trim() && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                    <div className="p-4 text-center">
                      <p className="text-sm text-slate-600">No results found for "{searchQuery}"</p>
                      <p className="text-xs text-slate-500 mt-1">Try a different search term</p>
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="text-slate-600 relative hover:text-amber-500 transition-colors"
                onClick={() => setShowFriendRequests(!showFriendRequests)}
              >
                <Bell size={20} className="transform hover:rotate-12 transition-transform" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-md">
                    {notifications}
                  </span>
                )}
              </button>
              <div 
                className="h-9 w-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer shadow-md hover:shadow-lg transition-shadow ring-2 ring-white"
                onClick={() => setActiveSection("settings")}
              >
                JD
              </div>
            </div>
          </div>
        </div>
        
        {/* Friend Requests Dropdown */}
        {showFriendRequests && (
          <div className="absolute right-4 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="p-3 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              <button 
                className="text-slate-400 hover:text-slate-600"
                onClick={() => setShowFriendRequests(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {friendRequests.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  No new notifications
                </div>
              ) : (
                friendRequests.map(request => (
                  <div key={request.id} className="p-3 border-b border-slate-100 hover:bg-amber-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-medium shadow-md">
                        {request.avatar}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-sm text-slate-800">
                          <span className="font-semibold">{request.name}</span> wants to connect with you
                        </p>
                        <p className="text-xs text-slate-500">{request.timestamp}</p>
                        
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-xs h-8 px-3 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                            onClick={() => handleAcceptRequest(request)}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-8 px-3 transition-colors"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-grow z-0">
        {/* Sidebar - Hidden on mobile unless toggled */}
        <aside className={`${mobileNavOpen ? 'block' : 'hidden'} md:block bg-white/95 backdrop-blur-md w-64 border-r border-slate-200 fixed md:sticky top-[57px] h-[calc(100vh-57px)] shadow-md z-30 transition-all duration-200 overflow-y-auto`}>
          <div className="p-4 flex flex-col h-full relative z-20">
            <nav className="space-y-2 flex-grow">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Dashboard</h2>
              
              {/* Add Home to navigation */}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Clicked Home");
                  navigateToSection("home");
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                  activeSection === "home" 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
                style={{cursor: 'pointer'}}
              >
                {activeSection === "home" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"></div>
                )}
                <span>
                  <Home size={17} strokeWidth={2.2} className="text-slate-400" />
                </span>
                <span>Home</span>
              </a>
              
              {/* Simple direct buttons instead of mapped array */}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Clicked Upcoming Webinars");
                  navigateToSection("upcomingWebinars");
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                  activeSection === "upcomingWebinars" 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
                style={{cursor: 'pointer'}}
              >
                {activeSection === "upcomingWebinars" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"></div>
                )}
                <span>
                  <CalendarDays size={17} strokeWidth={2.2} className="text-slate-400" />
                </span>
                <span>Upcoming Webinars</span>
              </a>
              
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Clicked Calendar");
                  navigateToSection("calendar");
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                  activeSection === "calendar" 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
                style={{cursor: 'pointer'}}
              >
                {activeSection === "calendar" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"></div>
                )}
                <span>
                  <Calendar size={17} strokeWidth={2.2} className="text-slate-400" />
                </span>
                <span>Calendar</span>
              </a>
              
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Clicked Previous Webinars");
                  navigateToSection("previousWebinars");
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                  activeSection === "previousWebinars" 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
                style={{cursor: 'pointer'}}
              >
                {activeSection === "previousWebinars" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"></div>
                )}
                <span>
                  <Clock size={17} strokeWidth={2.2} className="text-slate-400" />
                </span>
                <span>Previous Webinars</span>
              </a>
              
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Clicked Resources");
                  navigateToSection("resources");
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                  activeSection === "resources" 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
                style={{cursor: 'pointer'}}
              >
                {activeSection === "resources" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"></div>
                )}
                <span>
                  <FileText size={17} strokeWidth={2.2} className="text-slate-400" />
                </span>
                <span>Resources</span>
              </a>
              
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-3">Connections</h2>
              
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Clicked People");
                  navigateToSection("people");
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                  activeSection === "people" 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
                style={{cursor: 'pointer'}}
              >
                {activeSection === "people" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"></div>
                )}
                <span>
                  <Users size={17} strokeWidth={2.2} className="text-slate-400" />
                </span>
                <span>People</span>
              </a>
              
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Clicked Communities");
                  navigateToSection("communities");
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                  activeSection === "communities" 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
                style={{cursor: 'pointer'}}
              >
                {activeSection === "communities" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"></div>
                )}
                <span>
                  <Globe size={17} strokeWidth={2.2} className="text-slate-400" />
                </span>
                <span>Communities</span>
              </a>
              
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Clicked Chat");
                  navigateToSection("chat");
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                  activeSection === "chat" 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
                style={{cursor: 'pointer'}}
              >
                {activeSection === "chat" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"></div>
                )}
                <span>
                  <MessageSquare size={17} strokeWidth={2.2} className="text-slate-400" />
                </span>
                <span>Chat</span>
              </a>
              
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-3">Account</h2>
              
              <ReliableButton 
                variant="ghost"
                className={`flex items-center justify-start gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                  activeSection === "settings" 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
                onClick={() => {
                  console.log("Clicked Settings");
                  navigateToSection("settings");
                }}
                actionName="Navigate to Settings"
              >
                {activeSection === "settings" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"></div>
                )}
                <span>
                  <Settings size={17} strokeWidth={2.2} className="text-slate-400" />
                </span>
                <span>Settings</span>
              </ReliableButton>
            </nav>
            
            <a 
              href="/login" 
              onClick={(e) => {
                console.log("Logging out");
                // You would add your logout logic here in a real app
              }}
              className="flex items-center gap-3 px-3 py-2.5 mt-4 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
              style={{cursor: 'pointer'}}
            >
              <LogOut size={17} strokeWidth={2.2} />
              Logout
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-grow container mx-auto px-4 py-8 md:px-6 relative z-10">
          {/* Home feed */}
          {activeSection === "home" && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Welcome section with stats */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h1 className="text-2xl font-bold text-slate-800">Welcome back, {userStats.name} 👋</h1>
                          <p className="text-slate-500">Here's your webinar dashboard for today</p>
            </div>
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center relative overflow-hidden">
                          <span className="text-white font-bold">JD</span>
                          <div className="absolute -bottom-1 -right-1 bg-amber-300 text-xs font-bold text-white h-5 w-5 flex items-center justify-center rounded-full">
                            3
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                          <h3 className="text-3xl font-bold text-slate-800">{userStats.webinarsAttended}</h3>
                          <p className="text-sm text-slate-500">Webinars Attended</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                          <h3 className="text-3xl font-bold text-slate-800">{userStats.level}</h3>
                          <p className="text-sm text-slate-500">Level</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                          <h3 className="text-3xl font-bold text-slate-800">{userStats.connections}</h3>
                          <p className="text-sm text-slate-500">Connections</p>
                        </div>
                      </div>
                      
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" 
                          style={{ width: `${userStats.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>{userStats.level}</span>
                        <span>{userStats.level + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Live Now Webinar Section */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                    <div className="relative h-48 bg-slate-800">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full animate-pulse mr-1.5"></span>
                        Live Now
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-bold text-xl">Content Monetization Masterclass</h3>
                        <p className="text-white/80 text-sm">Jane Rodriguez, Marcus Chen</p>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          243 watching
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                        <Globe size={16} />
                        Join Live Webinar
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Next Webinar Alert */}
                  <div className="bg-amber-50 rounded-xl border border-amber-200 shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-amber-100 rounded-lg flex flex-col items-center justify-center text-amber-800 flex-shrink-0">
                          <span className="text-xs font-medium">Jun</span>
                          <span className="text-lg font-bold">15</span>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-800">Your next webinar starts in 2 days</h3>
                            <div className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Reminder</div>
                          </div>
                          <p className="text-sm text-slate-600">Building Your Creator Brand - with Alex Thompson & Lisa Wang</p>
                          <p className="text-xs text-slate-500 mt-1">9 AM PT / 12 PM EST • 90 minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Activity Feed */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                      <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                      {/* Activity items */}
                      <div className="p-4 hover:bg-slate-50 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <MessageSquare size={18} />
                          </div>
                          <div>
                            <p className="text-slate-800">
                              <span className="font-medium">Sarah Miller</span> replied to your question in "Video Production Masterclass"
                            </p>
                            <p className="text-sm text-slate-500 mt-1">"Here's a link to that lighting setup I mentioned..."</p>
                            <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 hover:bg-slate-50 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Star size={18} />
                          </div>
                          <div>
                            <p className="text-slate-800">
                              <span className="font-medium">Jane Rodriguez</span> confirmed your attendance
                            </p>
                            <p className="text-sm text-slate-500 mt-1">"Content Monetization Masterclass"</p>
                            <p className="text-xs text-slate-400 mt-1">Yesterday</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 hover:bg-slate-50 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <UserPlus size={18} />
                          </div>
                          <div>
                            <p className="text-slate-800">
                              <span className="font-medium">David Chen</span> accepted your connection request
                            </p>
                            <p className="text-xs text-slate-400 mt-1">2 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Communities - Moved from right to left column */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-slate-800">Your Communities</h2>
                      <a href="#" className="text-amber-600 text-sm flex items-center hover:underline" onClick={(e) => {
                        e.preventDefault();
                        navigateToSection("communities");
                      }}>
                        View all
                        <ChevronRight size={16} className="ml-1" />
                      </a>
                    </div>
                    
                    <div className="p-6 grid grid-cols-2 gap-3">
                      {communities.filter(c => c.joined).slice(0, 4).map(community => (
                        <div 
                          key={community.id}
                          className="border border-slate-200 rounded-lg p-3 hover:border-amber-200 hover:shadow-sm transition-all"
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center mb-2">
                              {community.category === "Photography" ? (
                                <Camera size={22} className="text-amber-600" />
                              ) : community.category === "Audio" ? (
                                <Mic size={22} className="text-amber-600" />
                              ) : community.category === "Video" ? (
                                <Video size={22} className="text-amber-600" />
                              ) : (
                                <Users size={22} className="text-amber-600" />
                              )}
                            </div>
                            <h3 className="font-medium text-slate-800 text-sm mb-1 line-clamp-1">{community.name}</h3>
                            <p className="text-xs text-slate-500">{community.members.toLocaleString()} members</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {communities.filter(c => c.joined).length === 0 && (
                      <div className="p-8 text-center">
                        <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 items-center justify-center mb-3">
                          <Users size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-slate-600 font-medium">Join a community</h3>
                        <p className="text-slate-500 text-sm mb-4">Connect with like-minded creators</p>
                        <button
                          onClick={() => navigateToSection("communities")}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Browse Communities
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  {/* Daily Quests */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                      <h2 className="text-lg font-semibold text-slate-800">Daily Quests</h2>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {dailyQuests.map(quest => (
                        <div key={quest.id} className="border border-slate-200 rounded-lg p-4 hover:border-amber-200 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                                {quest.icon}
                              </div>
                              <h3 className="font-medium text-slate-800">{quest.title}</h3>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full">
                              <Coins size={12} className="text-amber-500" />
                              <span className="text-xs font-medium text-amber-600">{quest.reward}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                            <span>Progress: {quest.progress}/{quest.total}</span>
                            <span>{Math.round((quest.progress / quest.total) * 100)}%</span>
                          </div>
                          
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all" 
                              style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                            ></div>
                          </div>
                          
                          {quest.progress < quest.total && (
                            <button 
                              onClick={() => handleCompleteQuest(quest.id)}
                              className="w-full mt-3 border border-amber-200 text-amber-600 hover:bg-amber-50 py-1 rounded text-sm transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      ))}
                      
                      <p className="text-xs text-slate-500 text-center mt-4">Complete all quests to earn a Webinar Expert badge!</p>
                    </div>
                  </div>
                  
                  {/* Upcoming Webinars */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-slate-800">Upcoming Webinars</h2>
                      <a href="#" className="text-amber-600 text-sm flex items-center hover:underline" onClick={(e) => {
                        e.preventDefault();
                        navigateToSection("upcomingWebinars");
                      }}>
                        View all
                        <ChevronRight size={16} className="ml-1" />
                      </a>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                      {upcomingWebinars.slice(0, 3).map(webinar => (
                        <div key={webinar.id} className="p-4 hover:bg-slate-50 transition-all">
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-amber-50 text-amber-600 rounded-lg flex-shrink-0">
                              <span className="text-xs font-medium">
                                {new Date(webinar.date).toLocaleString('default', { month: 'short' })}
                              </span>
                              <span className="text-lg font-bold">
                                {new Date(webinar.date).getDate()}
                              </span>
                            </div>
                            
                            <div>
                              <h3 className="font-medium text-slate-800 line-clamp-1">{webinar.title}</h3>
                              <p className="text-xs text-slate-500 mt-1">{webinar.time}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex-shrink-0"></div>
                                <p className="text-xs text-slate-600">{webinar.speakers?.join(', ')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Previous Webinars */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-slate-800">Previous Webinars</h2>
                      <a href="#" className="text-amber-600 text-sm flex items-center hover:underline" onClick={(e) => {
                        e.preventDefault();
                        navigateToSection("previousWebinars");
                      }}>
                        View all
                        <ChevronRight size={16} className="ml-1" />
                      </a>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                      {previousWebinars.slice(0, 2).map(webinar => (
                        <div key={webinar.id} className="p-4 hover:bg-slate-50 transition-all">
                          <div className="flex gap-4">
                            <div className="flex items-center justify-center w-14 h-14 bg-slate-100 text-slate-600 rounded-lg flex-shrink-0">
                              <Video size={22} />
                            </div>
                            
                            <div className="flex-grow">
                              <h3 className="font-medium text-slate-800 line-clamp-1">{webinar.title}</h3>
                              <div className="flex justify-between">
                                <p className="text-xs text-slate-500 mt-1">Duration: {webinar.duration}</p>
                                <p className="text-xs text-slate-500 mt-1">{webinar.views} views</p>
                              </div>
                              <button className="mt-2 text-xs text-amber-600 hover:text-amber-700 flex items-center">
                                <Play size={12} className="mr-1" />
                                Watch Recording
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Upcoming Webinars */}
          {activeSection === "upcomingWebinars" && (
            <div className="animate-fadeIn">
              {showWebinarDetails ? (
                <div>
                  <div className="flex items-center mb-6">
                    <button 
                      onClick={handleCloseWebinarDetails}
                      className="mr-3 p-2 rounded-md hover:bg-amber-100 text-slate-600 transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">Webinar Details</h1>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 h-20 flex items-center px-8 relative">
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
                        <div className="absolute -left-20 -bottom-40 w-80 h-80 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-20"></div>
                </div>
                <div className="relative">
                        <h2 className="text-white font-bold text-2xl">{selectedWebinar.title}</h2>
                </div>
              </div>
              
                    <div className="p-8">
                      <div className="flex flex-wrap gap-5 mb-8 border-b border-slate-200 pb-8">
                        <div className="flex items-center bg-slate-50 px-4 py-2 rounded-full shadow-sm">
                          <Calendar size={18} className="mr-2 text-amber-500" />
                          <span className="font-medium text-slate-800">{selectedWebinar.date}</span>
                        </div>
                        <div className="flex items-center bg-slate-50 px-4 py-2 rounded-full shadow-sm">
                          <Clock size={18} className="mr-2 text-amber-500" />
                          <span className="font-medium text-slate-800">{selectedWebinar.time}</span>
                        </div>
                        <div className="flex items-center bg-slate-50 px-4 py-2 rounded-full shadow-sm">
                          <Users size={18} className="mr-2 text-amber-500" />
                          <span className="font-medium text-slate-800">{selectedWebinar.registered} Registered</span>
                        </div>
                        <div className="flex items-center bg-slate-50 px-4 py-2 rounded-full shadow-sm ml-auto">
                          <span className="font-medium text-amber-600">
                            {selectedWebinar.daysLeft === 0 ? "Today" : `${selectedWebinar.daysLeft} days left`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="font-semibold text-lg text-slate-800 mb-3">About this Webinar</h3>
                        <p className="text-slate-600 leading-relaxed">{selectedWebinar.longDescription}</p>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="font-semibold text-lg text-slate-800 mb-3">Speakers</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {selectedWebinar.speakers.map((speaker, i) => (
                            <div key={i} className="flex items-center gap-3 bg-gradient-to-br from-slate-50 to-white py-3 px-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                {speaker.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{speaker}</p>
                                <p className="text-xs text-slate-500">Industry Expert</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <Button 
                          className={registeredWebinars.includes(selectedWebinar.id) 
                            ? "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all" 
                            : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
                          }
                          onClick={() => handleRegisterWebinar(selectedWebinar.id)}
                        >
                          {registeredWebinars.includes(selectedWebinar.id) ? (
                            <div className="flex items-center">
                              <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center mr-2">
                                <Check size={12} className="text-green-600" />
                              </div>
                              Registered
                            </div>
                          ) : "Register Now"}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-slate-200 text-amber-600 hover:border-amber-200 hover:bg-amber-50 shadow-sm transition-all flex items-center gap-2"
                          onClick={() => handleAddToCalendar(selectedWebinar)}
                        >
                          <CalendarDays size={16} />
                          Add to Calendar
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 ml-auto"
                        >
                          <Share size={16} />
                          Share
                        </Button>
                      </div>
                    </div>
                              </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
                      <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center">
                        <MessageSquare size={18} className="mr-2 text-amber-500" />
                        Discussion Topics
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "Content Monetization Strategies",
                          "Platform-Specific Opportunities",
                          "Creating Digital Products",
                          "Affiliate Marketing Implementation",
                          "Subscription Models"
                        ].map((topic, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-700">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                          </div>
                    
                    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
                      <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center">
                        <FileText size={18} className="mr-2 text-amber-500" />
                        Resources Included
                      </h3>
                      <ul className="space-y-3">
                        {[
                          { name: "Monetization Workbook", type: "PDF", size: "2.3 MB" },
                          { name: "Creator Toolkit 2025", type: "ZIP", size: "14.7 MB" },
                          { name: "Revenue Calculator", type: "XLSX", size: "512 KB" },
                          { name: "Platform Comparison", type: "PDF", size: "1.8 MB" }
                        ].map((resource, i) => (
                          <li key={i} className="flex items-center justify-between text-slate-700 p-2 rounded-md hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                <FileText size={14} />
                        </div>
                              <span>{resource.name}</span>
                      </div>
                            <div className="flex items-center text-xs text-slate-500">
                              <span className="bg-slate-100 px-2 py-0.5 rounded mr-2">{resource.type}</span>
                              {resource.size}
                    </div>
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
              </div>
              ) : (
                  <div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-800 mb-1">Upcoming Webinars</h1>
                      <p className="text-slate-500">Register for upcoming sessions or view your scheduled webinars</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-3 -top-3 w-12 h-12 bg-amber-300 rounded-full opacity-20 blur-lg"></div>
                      <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all relative">
                        <Search size={16} className="mr-2" />
                        Find Webinars
                      </Button>
                  </div>
                </div>
                
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500">Total Upcoming</h3>
                        <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                          <Calendar size={16} className="text-amber-600" />
                  </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-800">12</p>
                      <div className="mt-2 flex items-center text-xs text-green-600">
                        <TrendingUp size={14} className="mr-1" />
                        <span>+2 from last month</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500">Your Registrations</h3>
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-green-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-800">3</p>
                      <div className="mt-2 flex items-center text-xs text-slate-500">
                        <Calendar size={14} className="mr-1" />
                        <span>Next: Content Creation Masterclass</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500">Total Speakers</h3>
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users size={16} className="text-blue-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-800">24</p>
                      <div className="mt-2 flex items-center text-xs text-slate-500">
                        <Star size={14} className="mr-1" />
                        <span>Industry experts</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500">Categories</h3>
                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <List size={16} className="text-purple-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-800">6</p>
                      <div className="mt-2 flex items-center text-xs text-slate-500">
                        <Tag size={14} className="mr-1" />
                        <span>Different topics</span>
                      </div>
                  </div>
                </div>
                
                  {/* Featured Session */}
                  <div 
                    className="bg-white rounded-xl border border-slate-200 shadow-lg p-8 mb-8 relative overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all cursor-pointer group"
                    onClick={() => handleViewWebinarDetails({
                      id: 1,
                      title: "Monetizing Your Content: Strategies for 2025",
                      description: "Join industry experts to learn the latest strategies for monetizing your creative work.",
                      longDescription: "Join industry experts to learn the latest strategies for monetizing your creative work. This comprehensive webinar will cover multiple revenue streams, platform-specific opportunities, and practical steps you can take immediately to increase your income as a creator. You'll learn from professionals who have built successful businesses in the creator economy.",
                      date: "June 15, 2025",
                      time: "9 AM PT / 12 PM EST",
                      registered: registeredWebinars.includes(1),
                      registrants: 147,
                      daysLeft: 45,
                      speakers: ["Jane Rodriguez", "Marcus Chen"]
                    })}
                  >
                    <div className="absolute top-0 right-0 p-2 px-4">
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">Featured Session</span>
                  </div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">Monetizing Your Content: Strategies for 2025</h2>
                      <p className="text-slate-600 mb-4">Join industry experts to learn the latest strategies for monetizing your creative work.</p>
                      
                      <div className="flex flex-wrap gap-6 mb-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="text-amber-600" size={16} />
                          <span>June 15, 2025</span>
                  </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="text-amber-600" size={16} />
                          <span>9 AM PT / 12 PM EST</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Users className="text-amber-600" size={16} />
                          <span>147 Registered</span>
                </div>
              </div>
              
                      <div className="flex flex-wrap gap-3">
                        {registeredWebinars.includes(1) ? (
                          <>
                            <ReliableButton
                              className="text-white bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              actionName="You are registered"
                            >
                              <Check size={16} className="mr-1" /> Registered
                            </ReliableButton>
                            <ReliableButton
                              variant="outline"
                              className="border-slate-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCalendar({ id: 1, title: "Monetizing Your Content: Strategies for 2025" });
                              }}
                              actionName="Add to calendar"
                            >
                              <Calendar size={16} className="mr-1" /> Add to Calendar
                            </ReliableButton>
                          </>
                        ) : (
                          <ReliableButton
                            className="text-white bg-amber-600 hover:bg-amber-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegisterWebinar(1);
                            }}
                            actionName="Register for session"
                          >
                            Register Now
                          </ReliableButton>
                        )}
                        <ReliableButton
                          variant="outline"
                          className="border-slate-300 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-600 transition-all transform hover:scale-[1.02] shadow-sm hover:shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewWebinarDetails({
                              id: 1,
                              title: "Monetizing Your Content: Strategies for 2025",
                              description: "Join industry experts to learn the latest strategies for monetizing your creative work.",
                              date: "June 15, 2025",
                              time: "9 AM PT / 12 PM EST",
                              registered: registeredWebinars.includes(1),
                              registrants: 147,
                              daysLeft: 45,
                              speakers: ["Jane Rodriguez", "Marcus Chen"]
                            });
                          }}
                          actionName="View details"
                        >
                          <span className="flex items-center">
                            Details <ChevronRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </ReliableButton>
                      </div>
                    </div>
                </div>
                
                  {/* Categories */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-slate-800">Browse by Category</h3>
                      <ReliableButton
                        variant="ghost"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={() => console.log("View all categories")}
                        actionName="View All Categories"
                      >
                        See More
                        <ChevronRight size={16} className="ml-1" />
                      </ReliableButton>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { name: "Content Creation", count: 4, icon: <FileText size={20} /> },
                        { name: "Monetization", count: 3, icon: <DollarSign size={20} /> },
                        { name: "Marketing", count: 2, icon: <BarChart3 size={20} /> },
                        { name: "Technology", count: 2, icon: <Laptop size={20} /> },
                        { name: "Strategy", count: 2, icon: <Target size={20} /> },
                        { name: "Growth", count: 3, icon: <TrendingUp size={20} /> }
                  ].map((category, i) => (
                        <button
                          key={i}
                          className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:border-amber-200 hover:bg-amber-50 transition-all group"
                        >
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2 group-hover:bg-amber-200 transition-colors">
                        {category.icon}
                      </div>
                          <span className="font-medium text-sm text-slate-800">{category.name}</span>
                          <span className="text-xs text-slate-500 mt-1">{category.count} sessions</span>
                        </button>
                  ))}
                </div>
              </div>
              
                  {/* Featured Speakers */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-slate-800">Featured Speakers</h3>
                      <ReliableButton
                        variant="ghost"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={() => console.log("View all speakers")}
                        actionName="View All Speakers"
                      >
                        See More
                        <ChevronRight size={16} className="ml-1" />
                      </ReliableButton>
                        </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        {
                          name: "Jane Rodriguez",
                          role: "Content Strategy Expert",
                          expertise: ["YouTube Growth", "Content Planning", "Audience Engagement"],
                          upcomingSessions: 2,
                          image: null
                        },
                        {
                          name: "Marcus Chen",
                          role: "Monetization Specialist",
                          expertise: ["Revenue Streams", "Brand Partnerships", "Digital Products"],
                          upcomingSessions: 3,
                          image: null
                        },
                        {
                          name: "Alex Thompson",
                          role: "Marketing Strategist",
                          expertise: ["Social Media", "Email Marketing", "Analytics"],
                          upcomingSessions: 1,
                          image: null
                        }
                      ].map((speaker, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-amber-200 hover:bg-amber-50 transition-all">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                            {speaker.image || speaker.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800">{speaker.name}</h4>
                            <p className="text-sm text-slate-500">{speaker.role}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {speaker.expertise.map((skill, j) => (
                                <span key={j} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                  {skill}
                                </span>
                              ))}
                          </div>
                            <div className="mt-2 flex items-center text-xs text-amber-600">
                              <Calendar size={12} className="mr-1" />
                              <span>{speaker.upcomingSessions} upcoming session(s)</span>
                        </div>
                          </div>
                              </div>
                            ))}
                            </div>
                          </div>
                          
                  {/* All Upcoming Sessions */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-lg text-slate-800">All Upcoming Sessions</h3>
                          <div className="flex items-center gap-2">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Search sessions..." 
                            className="py-1.5 pl-9 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64 transition-all"
                          />
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        </div>
                        <ReliableButton
                          variant="outline"
                          size="sm"
                          className="border-slate-200 text-slate-700 flex items-center gap-1"
                          onClick={() => console.log("Filter sessions")}
                          actionName="Filter sessions"
                        >
                          <List size={14} className="mr-1" />
                          Filter
                        </ReliableButton>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      {upcomingWebinars.map((webinar, index) => (
                        <div 
                          key={index}
                          className="p-4 border border-slate-200 rounded-lg hover:border-amber-200 hover:shadow-sm transition-all group cursor-pointer"
                          onClick={() => handleViewWebinarDetails(webinar)}
                        >
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                                  {index % 3 === 0 ? "Content Creation" : 
                                   index % 3 === 1 ? "Monetization" : "Marketing"}
                                </span>
                                {webinar.daysLeft === 0 && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                                    Today
                                  </span>
                                )}
                            {registeredWebinars.includes(webinar.id) && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                                    <Check size={10} className="mr-1" />
                                Registered
                                  </span>
                                )}
                              </div>
                              <h4 className="font-semibold text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">
                                {webinar.title}
                              </h4>
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                {webinar.description}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <span className="flex items-center">
                                  <Calendar size={14} className="mr-1.5 text-amber-500" />
                                  {webinar.date}
                                </span>
                                <span className="flex items-center">
                                  <Clock size={14} className="mr-1.5 text-amber-500" />
                                  {webinar.time}
                                </span>
                                <span className="flex items-center">
                                  <Users size={14} className="mr-1.5 text-amber-500" />
                                  {webinar.registered} attendees
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 md:flex-nowrap">
                              {!registeredWebinars.includes(webinar.id) ? (
                                <ReliableButton
                                  size="sm"
                                  className="text-white bg-amber-600 hover:bg-amber-700 min-w-20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRegisterWebinar(webinar.id);
                                  }}
                                  actionName={`Register for "${webinar.title}"`}
                                >
                                  Register
                                </ReliableButton>
                              ) : (
                                <ReliableButton
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 min-w-20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCalendar(webinar);
                                  }}
                                  actionName={`Add "${webinar.title}" to calendar`}
                                >
                                  <Calendar size={14} className="mr-1" />
                                  Calendar
                                </ReliableButton>
                              )}
                              <ReliableButton
                              size="sm" 
                                variant="outline"
                                className="border-slate-200 text-slate-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewWebinarDetails(webinar);
                                }}
                                actionName={`View details for "${webinar.title}"`}
                            >
                              Details
                                <ChevronRight size={14} className="ml-1 opacity-70" />
                              </ReliableButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                    
                    <div className="flex justify-center">
                      <ReliableButton
                        variant="outline"
                        className="border-slate-200 hover:border-amber-200 hover:bg-amber-50 text-amber-600"
                        onClick={() => console.log("Load more sessions")}
                        actionName="Load more sessions"
                      >
                        Load More
                      </ReliableButton>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-md p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-xl font-bold text-amber-800 mb-2">Want to suggest a topic?</h3>
                  <p className="text-amber-700 mb-1">We're always looking for new session ideas.</p>
                  <p className="text-sm text-amber-600">Submit your proposal and help shape our content calendar.</p>
                </div>
                    <ReliableButton 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all whitespace-nowrap"
                      actionName="Suggest a webinar topic"
                      onClick={() => {
                        console.log("Suggest a webinar button clicked");
                        alert("Webinar suggestion form will open here");
                      }}
                    >
                  Suggest a Webinar
                    </ReliableButton>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Settings Section */}
          {activeSection === "settings" && (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">Settings</h1>
                  <p className="text-slate-500">Manage your account preferences</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                    <div className="p-6 flex flex-col items-center text-center">
                      <div className="h-24 w-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-md">
                        JD
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">John Doe</h2>
                      <p className="text-slate-500">Content Creator</p>
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-all"
                      >
                        <Image size={16} className="mr-2" />
                        Change Photo
                </Button>
                    </div>
                    
                    <div className="border-t border-slate-200">
                      <nav className="p-2">
                        <button 
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                            activeSettingsTab === "profile" 
                            ? "bg-amber-50 text-amber-600" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          } font-medium text-sm`}
                          onClick={() => setActiveSettingsTab("profile")}
                        >
                          <UserRound size={16} />
                          <span>Profile</span>
                        </button>
                        <button 
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                            activeSettingsTab === "notifications" 
                            ? "bg-amber-50 text-amber-600" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          } font-medium text-sm mt-1`}
                          onClick={() => setActiveSettingsTab("notifications")}
                        >
                          <Bell size={16} />
                          <span>Notifications</span>
                        </button>
                        <button 
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                            activeSettingsTab === "billing" 
                            ? "bg-amber-50 text-amber-600" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          } font-medium text-sm mt-1`}
                          onClick={() => setActiveSettingsTab("billing")}
                        >
                          <CreditCard size={16} />
                          <span>Billing</span>
                        </button>
                        <button 
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                            activeSettingsTab === "security" 
                            ? "bg-amber-50 text-amber-600" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          } font-medium text-sm mt-1`}
                          onClick={() => setActiveSettingsTab("security")}
                        >
                          <Lock size={16} />
                          <span>Security</span>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-3">
                  {activeSettingsTab === "profile" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                      <div className="border-b border-slate-200 p-4">
                        <h2 className="text-lg font-semibold text-slate-800">Profile Information</h2>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                              value="John"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                              value="Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input 
                              type="email" 
                              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                              value="john.doe@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input 
                              type="tel" 
                              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                              value="+1 (555) 123-4567"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                            <textarea 
                              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 resize-none"
                              rows={4}
                              value="Content creator specializing in educational technology tutorials and reviews. Passionate about helping others learn and grow through digital media."
                            ></textarea>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-200">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <h3 className="text-lg font-semibold text-slate-800">Creator Details</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500">Profile visibility:</span>
                              <button className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                                Public
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Creator Name/Brand</label>
                              <input 
                                type="text" 
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                                value="TechWithJohn"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 bg-white">
                                <option>Technology</option>
                                <option>Education</option>
                                <option>Entertainment</option>
                                <option>Lifestyle</option>
                                <option>Business</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <Button 
                            variant="outline" 
                            className="mr-2 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all"
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeSettingsTab === "notifications" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                      <div className="border-b border-slate-200 p-4">
                        <h2 className="text-lg font-semibold text-slate-800">Notification Preferences</h2>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-slate-800 font-medium">Webinar Reminders</h3>
                              <p className="text-sm text-slate-500">Get notified before your registered webinars</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                              </label>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-slate-800 font-medium">New Connection Requests</h3>
                              <p className="text-sm text-slate-500">Get notified when someone sends you a connection request</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                              </label>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-slate-800 font-medium">Community Activity</h3>
                              <p className="text-sm text-slate-500">Get notified about new posts in your communities</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                              </label>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-slate-800 font-medium">Email Notifications</h3>
                              <p className="text-sm text-slate-500">Receive email notifications for important updates</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <Button 
                            variant="outline" 
                            className="mr-2 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all"
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeSettingsTab === "billing" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                      <div className="border-b border-slate-200 p-4">
                        <h2 className="text-lg font-semibold text-slate-800">Billing Information</h2>
                      </div>
                      
                      <div className="p-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                          <div className="flex items-start">
                            <div className="bg-amber-100 rounded-full p-2 mr-3">
                              <DollarSign size={18} className="text-amber-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-amber-800">Current Plan: Professional</h3>
                              <p className="text-sm text-amber-700 mt-1">Your subscription renews on July 15, 2024</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
                          <div className="p-4 border-b border-slate-200">
                            <h3 className="font-medium text-slate-800">Payment Methods</h3>
                          </div>
                          
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-16 bg-slate-100 rounded-md mr-4 flex items-center justify-center">
                                <CreditCard size={20} className="text-slate-500" />
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-800">•••• •••• •••• 4242</h4>
                                <p className="text-xs text-slate-500">Expires 05/2025</p>
                              </div>
                            </div>
                            <div>
                              <Button variant="outline" size="sm" className="border-slate-200 text-slate-600">
                                <Edit size={14} className="mr-1.5" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                          <div className="p-4 border-b border-slate-200">
                            <h3 className="font-medium text-slate-800">Billing History</h3>
                          </div>
                          
                          <div className="divide-y divide-slate-200">
                            <div className="p-4 flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-slate-800">Professional Plan - Monthly</h4>
                                <p className="text-xs text-slate-500">June 15, 2024</p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-slate-800 font-medium mr-3">$29.99</span>
                                <Button variant="outline" size="sm" className="border-slate-200 text-slate-600">
                                  <FileText size={14} className="mr-1.5" />
                                  Invoice
                                </Button>
                              </div>
                            </div>
                            
                            <div className="p-4 flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-slate-800">Professional Plan - Monthly</h4>
                                <p className="text-xs text-slate-500">May 15, 2024</p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-slate-800 font-medium mr-3">$29.99</span>
                                <Button variant="outline" size="sm" className="border-slate-200 text-slate-600">
                                  <FileText size={14} className="mr-1.5" />
                                  Invoice
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeSettingsTab === "security" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                      <div className="border-b border-slate-200 p-4">
                        <h2 className="text-lg font-semibold text-slate-800">Security Settings</h2>
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-6">
                          <h3 className="font-medium text-slate-800 mb-3">Change Password</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                              <input 
                                type="password" 
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                              <input 
                                type="password" 
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                              <input 
                                type="password" 
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t border-slate-200">
                          <h3 className="font-medium text-slate-800 mb-3">Two-Factor Authentication</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-slate-600">Add an extra layer of security to your account</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-6 mt-6 border-t border-slate-200">
                          <h3 className="font-medium text-slate-800 mb-3">Active Sessions</h3>
                          <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-slate-100 rounded-full mr-4 flex items-center justify-center">
                                  <Laptop size={20} className="text-slate-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-800">MacBook Pro</h4>
                                  <p className="text-xs text-slate-500">San Francisco, CA • Active now</p>
                                </div>
                              </div>
                              <div>
                                <Button variant="outline" size="sm" className="border-slate-200 text-red-500 hover:text-red-600 hover:border-red-200">
                                  Log Out
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <Button 
                            variant="outline" 
                            className="mr-2 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all"
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Calendar Section */}
          {activeSection === "calendar" && (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">My Calendar</h1>
                  <p className="text-slate-500">Manage your upcoming webinars and events</p>
                </div>
                <div className="flex items-center">
                  <div className="border border-slate-200 rounded-lg p-1 inline-flex shadow-sm">
                    <button 
                      className={`px-3 py-1.5 rounded text-sm font-medium flex items-center ${
                        calendarView === "month" 
                          ? 'bg-amber-500 text-white' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    onClick={() => setCalendarView("month")}
                  >
                    <CalendarDays size={15} className="mr-1.5" />
                    Month
                    </button>
                    <button 
                      className={`px-3 py-1.5 rounded text-sm font-medium flex items-center ${
                        calendarView === "list" 
                          ? 'bg-amber-500 text-white' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    onClick={() => setCalendarView("list")}
                  >
                    <List size={15} className="mr-1.5" />
                    List
                    </button>
                  </div>
                  <ReliableButton 
                    variant="outline"
                    className="ml-2 border-slate-200 text-slate-600 flex items-center"
                    onClick={() => console.log("Sync calendar button clicked")}
                    actionName="Sync calendar"
                  >
                    <RefreshCw size={15} className="mr-1.5" />
                    Sync
                  </ReliableButton>
                </div>
              </div>
              
              {calendarView === "month" ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-md mb-8">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-800">June 2024</h2>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-md hover:bg-slate-100">
                        <ChevronLeft size={16} />
                      </button>
                      <button className="px-2.5 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md">
                        Today
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-slate-100">
                        <ChevronRight size={16} />
                      </button>
                </div>
              </div>
                  
                  <div className="grid grid-cols-7 text-center border-b border-slate-200">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                      <div key={i} className="py-2 font-medium text-sm text-slate-600">
                        {day}
            </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 text-sm">
                    {Array(35).fill(null).map((_, i) => {
                      // Sample day number (1-30)
                      const dayNum = i - 2 > 0 && i - 2 <= 30 ? i - 2 : null;
                      // Determine if the day has events
                      let hasEvents = false;
                      let isWebinarDay = false;
                      let isRegistered = false;
                      
                      // For sample data, mark some days as having events
                      if (dayNum === 5 || dayNum === 12 || dayNum === 18 || dayNum === 25) {
                        hasEvents = true;
                        isWebinarDay = true;
                      }
                      
                      if (dayNum === 5) {
                        isRegistered = true;
                      }
                      
                      const isToday = dayNum === 15;
                      
                      return (
                        <div key={i} className={`min-h-24 p-1 border-b border-r border-slate-100 ${!dayNum ? 'bg-slate-50/50' : ''}`}>
                          {dayNum && (
                            <>
                              <div className={`text-right p-1 ${isToday ? 'bg-amber-500 text-white rounded-full w-6 h-6 ml-auto flex items-center justify-center' : ''}`}>
                                {dayNum}
                              </div>
                              
                              {hasEvents && (
                                <div className={`mt-1 text-xs rounded-md p-1.5 ${isRegistered ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'} truncate`}>
                                  <div className="flex items-center gap-1">
                                    <span className={`h-1.5 w-1.5 rounded-full ${isRegistered ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                    {isWebinarDay && (
                                      <span className="truncate">
                                        {dayNum === 5 ? "Content Creation Basics" : 
                                         dayNum === 12 ? "Monetization Strategies" : 
                                         dayNum === 18 ? "SEO for Creators" : 
                                         "Growth Hacking"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-md mb-8">
                  <div className="p-4 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-800">Upcoming Events</h2>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    <div className="p-4">
                      <h3 className="font-medium text-slate-800 mb-2">Registered Webinars</h3>
                      {upcomingWebinars.filter(w => registeredWebinars.includes(w.id)).map((webinar, index) => (
                        <div 
                          key={index} 
                          className="mb-3 p-3 rounded-lg border border-slate-200 hover:border-green-200 hover:bg-green-50 transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-green-100 text-green-800 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                              <Check size={16} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-slate-800">{webinar.title}</h4>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                                  <Calendar size={10} className="mr-1" />
                                  In Calendar
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 line-clamp-2 mb-2">{webinar.description}</p>
                              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                <span className="flex items-center">
                                  <Calendar size={12} className="mr-1 text-green-500" />
                                  {webinar.date}
                                </span>
                                <span className="flex items-center">
                                  <Clock size={12} className="mr-1 text-green-500" />
                                  {webinar.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-slate-800 mb-2">Available Webinars</h3>
                      {upcomingWebinars.filter(w => !registeredWebinars.includes(w.id)).slice(0, 3).map((webinar, index) => (
                        <div 
                          key={index} 
                          className="mb-3 p-3 rounded-lg border border-slate-200 hover:border-amber-200 hover:bg-amber-50 transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-amber-100 text-amber-800 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                              <Calendar size={16} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800">{webinar.title}</h4>
                              <p className="text-sm text-slate-600 line-clamp-2 mb-2">{webinar.description}</p>
                              <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-3">
                                <span className="flex items-center">
                                  <Calendar size={12} className="mr-1 text-amber-500" />
                                  {webinar.date}
                                </span>
                                <span className="flex items-center">
                                  <Clock size={12} className="mr-1 text-amber-500" />
                                  {webinar.time}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <ReliableButton
                                  size="sm"
                                  className="text-white bg-amber-600 hover:bg-amber-700"
                                  onClick={() => handleRegisterWebinar(webinar.id)}
                                  actionName={`Register for ${webinar.title}`}
                                >
                                  Register
                                </ReliableButton>
                                <ReliableButton
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 text-slate-600"
                                  onClick={() => handleViewWebinarDetails(webinar)}
                                  actionName={`View details for ${webinar.title}`}
                                >
                                  Details
                                </ReliableButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-md">
                  <div className="p-4 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-800">Calendar Integrations</h2>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-slate-600 mb-4">Connect your external calendars to sync events</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 h-10 w-10 rounded-md flex items-center justify-center">
                            <Calendar size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-800">Google Calendar</h3>
                            <p className="text-xs text-slate-500">Connected · Last synced 2 hours ago</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-slate-200">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 h-10 w-10 rounded-md flex items-center justify-center">
                            <Calendar size={18} className="text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-800">Outlook Calendar</h3>
                            <p className="text-xs text-slate-500">Not connected</p>
                          </div>
                        </div>
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white" size="sm">Connect</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 h-10 w-10 rounded-md flex items-center justify-center">
                            <Calendar size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-800">Apple Calendar</h3>
                            <p className="text-xs text-slate-500">Not connected</p>
                          </div>
                        </div>
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white" size="sm">Connect</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-slate-200 shadow-md">
                  <div className="p-4 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-800">Notifications</h2>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-slate-600 mb-4">Configure how you'd like to be notified about events</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-slate-800">Event reminders</h3>
                          <p className="text-sm text-slate-500">Notification before events start</p>
                        </div>
                        <select className="bg-white border border-slate-200 rounded-md text-sm py-1.5 pr-8 pl-3">
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>1 day</option>
                        </select>
                      </div>
                      
                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-slate-800">Email notifications</h3>
                            <p className="text-sm text-slate-500">Get emails about your events</p>
                          </div>
                          <div className="relative inline-block h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out">
                            <span className="absolute h-4 w-4 translate-x-0 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out"></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-slate-800">Push notifications</h3>
                            <p className="text-sm text-slate-500">Send to your device</p>
                          </div>
                          <div className="relative inline-block h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-amber-500 transition-colors duration-200 ease-in-out">
                            <span className="absolute h-4 w-4 translate-x-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Previous Webinars section */}
          {activeSection === "previousWebinars" && (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">Previous Webinars</h1>
                  <p className="text-slate-500">Browse our library of past webinar recordings</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search recordings..." 
                    className="py-1.5 pl-9 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64 transition-all"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-8">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-800">Your Library</h2>
                  <div className="text-sm flex items-center gap-2 text-slate-500">
                    <span className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-1.5"></div>
                      New
                    </span>
                    <span className="flex items-center">
                      <Star size={14} className="text-amber-500 mr-1" />
                      Favorites
                    </span>
                  </div>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {previousWebinars.map((webinar) => (
                    <div key={webinar.id} className="p-5 hover:bg-slate-50 transition-all duration-200 cursor-pointer group">
                      <div className="flex items-start gap-5">
                        <div className="bg-gradient-to-br from-slate-200 to-slate-100 rounded-lg w-32 h-20 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                          <FileText size={24} className="text-slate-400" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                            <span className="text-white text-xs font-medium">{webinar.duration}</span>
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">
                              {webinar.title}
                            </h3>
                            <button 
                              className={`text-slate-400 ${webinar.favorite ? 'text-amber-500' : 'hover:text-amber-500'} transition-colors`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(webinar.id);
                              }}
                            >
                              <Star size={18} fill={webinar.favorite ? "currentColor" : "none"} />
                            </button>
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-3">{webinar.description}</p>
                          
                          <div className="flex flex-wrap justify-between items-center">
                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                              <span className="flex items-center">
                                <Calendar size={14} className="mr-1.5 text-amber-500" />
                                {webinar.date}
                              </span>
                              <span className="flex items-center">
                                <Users size={14} className="mr-1.5 text-amber-500" />
                                {webinar.views} views
                              </span>
                              <div className="flex items-center gap-1">
                                {webinar.speakers.map((speaker, i) => (
                                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-medium text-xs border-2 border-white shadow-sm" title={speaker}>
                                    {speaker.split(' ').map(n => n[0]).join('')}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <ReliableButton 
                              variant="outline" 
                              size="sm" 
                              className="border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-all"
                              onClick={() => handleViewPreviousWebinar(webinar.id)}
                              actionName={`Watch replay of "${webinar.title}"`}
                            >
                              Watch Replay
                            </ReliableButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md">
                  <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center">
                    <BarChart3 size={18} className="mr-2 text-amber-500" />
                    Viewing Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
                      <h4 className="text-slate-500 text-sm mb-1">Total Watched</h4>
                      <p className="text-2xl font-bold text-slate-800">14</p>
                      <div className="mt-2 text-xs text-green-600 flex items-center">
                        <TrendingUp size={14} className="mr-1" />
                        <span>35% of available content</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
                      <h4 className="text-slate-500 text-sm mb-1">Watch Time</h4>
                      <p className="text-2xl font-bold text-slate-800">12.5 hrs</p>
                      <div className="h-1.5 bg-slate-200 rounded-full mt-2 w-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[65%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
                    <p className="text-amber-800 font-medium">Your Learning Focus</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-amber-700">Content Creation</span>
                      <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-amber-700">Monetization</span>
                      <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-amber-700">Platform Growth</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md">
                  <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center">
                    <MessageSquare size={18} className="mr-2 text-amber-500" />
                    Recommended For You
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: "Building a Consistent Brand Identity", category: "Branding" },
                      { title: "Advanced Audience Growth Strategies", category: "Marketing" },
                      { title: "Diversifying Revenue Streams", category: "Monetization" }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg hover:border-amber-200 hover:bg-amber-50/30 transition-colors cursor-pointer">
                        <div>
                          <h4 className="font-medium text-slate-800">{item.title}</h4>
                          <span className="text-xs text-slate-500">{item.category}</span>
                        </div>
                        <ReliableButton 
                          variant="ghost" 
                          size="sm" 
                          className="text-amber-600 hover:text-amber-700 h-auto p-0"
                          actionName={`View "${item.title}"`}
                        >
                          View
                          <ChevronRight size={16} className="ml-1 opacity-70" />
                        </ReliableButton>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Resources Section */}
          {activeSection === "resources" && (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">Resources</h1>
                  <p className="text-slate-500">Find helpful downloads, templates, and guides</p>
                </div>
                <ReliableButton 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md"
                  onClick={() => handleRequestResource()}
                  actionName="Request resource"
                >
                  Request Resource
                </ReliableButton>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-8">
                <div className="p-4 border-b border-slate-200">
                  <div className="flex flex-wrap gap-2">
                    {resourceCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleChangeResourceCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          activeResourceCategory === category
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {filteredResources.map(resource => (
                    <div 
                      key={resource.id} 
                      className="p-5 hover:bg-slate-50 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleDownloadResource(resource)}
                    >
                      <div className="flex items-start gap-5">
                        <div className="bg-gradient-to-br from-slate-200 to-slate-100 rounded-lg w-14 h-14 flex-shrink-0 flex items-center justify-center">
                          <FileText size={24} className="text-slate-400" />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">
                              {resource.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              resource.type === 'PDF' 
                                ? 'bg-blue-100 text-blue-600' 
                                : resource.type === 'Template' 
                                ? 'bg-green-100 text-green-600'
                                : resource.type === 'Guide'
                                ? 'bg-amber-100 text-amber-600'
                                : resource.type === 'Video'
                                ? 'bg-purple-100 text-purple-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {resource.type}
                            </span>
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-3">{resource.description}</p>
                          
                          <div className="flex flex-wrap justify-between items-center">
                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                              <span className="flex items-center">
                                <Calendar size={14} className="mr-1.5 text-amber-500" />
                                {resource.dateAdded}
                              </span>
                              <span className="flex items-center">
                                <FileText size={14} className="mr-1.5 text-amber-500" />
                                {resource.fileSize}
                              </span>
                            </div>
                            
                            <ReliableButton 
                              variant="outline" 
                              size="sm" 
                              className={`border-slate-200 ${
                                downloadedResources.includes(resource.id)
                                  ? 'text-green-600 bg-green-50 border-green-200'
                                  : 'text-amber-600 hover:border-amber-200 hover:bg-amber-50'
                              } shadow-sm transition-all`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadResource(resource);
                              }}
                              actionName={downloadedResources.includes(resource.id) ? 'Open file' : 'Download resource'}
                            >
                              {downloadedResources.includes(resource.id) ? 'Open File' : 'Download'}
                            </ReliableButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-amber-800 mb-2">Need a specific resource?</h3>
                    <p className="text-amber-700">If you can't find what you're looking for, let us know and we'll create it for you.</p>
                  </div>
                  <ReliableButton 
                    className="bg-white text-amber-600 border border-amber-300 hover:bg-amber-50 shadow-md whitespace-nowrap"
                    onClick={() => handleRequestResource()}
                    actionName="Request custom resource"
                  >
                    Request Custom Resource
                  </ReliableButton>
                </div>
              </div>
            </div>
          )}
          
          {/* People Section */}
          {activeSection === "people" && (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">People</h1>
                  <p className="text-slate-500">Connect with fellow creators and grow your network</p>
                </div>
                  <div className="relative">
                    <input 
                      type="text" 
                    placeholder="Search people..." 
                    className="py-1.5 pl-9 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64 transition-all"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-md mb-8">
                <div className="border-b border-slate-200">
                  <div className="flex">
                    <button 
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                        activePeopleTab === "friends"
                          ? "border-amber-500 text-amber-600"
                          : "border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300"
                      }`}
                      onClick={() => setActivePeopleTab("friends")}
                    >
                      Friends
                      <span className="ml-1.5 bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">
                        {friends.length}
                      </span>
                    </button>
                    <button
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                        activePeopleTab === "discover"
                          ? "border-amber-500 text-amber-600"
                          : "border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300"
                      }`}
                      onClick={() => setActivePeopleTab("discover")}
                    >
                      Discover
                      <span className="ml-1.5 bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">
                        {discoverUsers.length}
                      </span>
                    </button>
                    <button
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                        activePeopleTab === "requests"
                          ? "border-amber-500 text-amber-600"
                          : "border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300"
                      }`}
                      onClick={() => setActivePeopleTab("requests")}
                    >
                      Requests
                      {friendRequests.length > 0 && (
                        <span className="ml-1.5 bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs">
                          {friendRequests.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Tab Content */}
                <div className="p-6">
                  {/* Friends Tab */}
                  {activePeopleTab === "friends" && (
                    <div>
                      {friends.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <Users size={24} className="text-slate-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">No connections yet</h3>
                          <p className="text-slate-500 mb-4">Start building your network by connecting with fellow creators</p>
                          <Button 
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md"
                            onClick={() => setActivePeopleTab("discover")}
                          >
                            <UserPlus size={16} className="mr-2" />
                            Discover People
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {friends.map(friend => (
                            <div 
                              key={friend.id} 
                              className="bg-white rounded-lg border border-slate-200 p-5 hover:border-amber-200 hover:shadow-md transition-all cursor-pointer"
                              onClick={() => handleViewProfile(friend)}
                            >
                              <div className="flex items-start gap-4">
                                <div className="relative">
                                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xl font-semibold shadow-md">
                                    {friend.avatar || friend.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  {friend.online && (
                                    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                            )}
                          </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-slate-800">
                                      {friend.name}
                                    </h3>
                                    <div className="text-xs text-slate-500">
                                      {friend.online ? (
                                        <span className="flex items-center text-green-600">
                                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                                          Online
                                        </span>
                                      ) : (
                                        <span>{friend.lastActive}</span>
                                      )}
                        </div>
                      </div>
                      
                                  <p className="text-sm text-slate-500 font-medium mb-1">{friend.role}</p>
                                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{friend.bio}</p>
                                  
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {friend.tags.map((tag, i) => (
                                      <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500">{friend.location}</span>
                                    <div className="flex gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-all h-8"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewProfile(friend);
                                        }}
                                      >
                                        Profile
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 shadow-sm transition-all h-8"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveFriend(friend.id);
                                        }}
                                      >
                                        <UserMinus size={14} className="mr-1" />
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Discover Tab */}
                  {activePeopleTab === "discover" && (
                          <div>
                      <div className="mb-6 flex flex-wrap gap-3">
                        {discoveryCategories.map(category => (
                          <button
                            key={category.id}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              category.active
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            onClick={() => {
                              // Toggle category active state
                              setDiscoveryCategories(prev => 
                                prev.map(c => ({
                                  ...c,
                                  active: c.id === category.id
                                }))
                              );
                              
                              // Update filter
                              setDiscoveryFilter(prev => ({
                                ...prev,
                                category: category.id
                              }));
                            }}
                          >
                            {category.name}
                            <span className="ml-1.5 bg-white/20 text-white rounded-full px-1.5 py-0.5 text-xs">
                              {category.count}
                            </span>
                          </button>
                        ))}
                          </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {discoverUsers.map(user => (
                          <div 
                            key={user.id} 
                            className="bg-white rounded-lg border border-slate-200 p-5 hover:border-amber-200 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => handleViewProfile(user)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="relative">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xl font-semibold shadow-md">
                                  {user.avatar || user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                {user.online && (
                                  <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold text-slate-800">
                                    {user.name}
                                  </h3>
                                  {user.mutualConnections > 0 && (
                                    <div className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                      {user.mutualConnections} mutual connection{user.mutualConnections > 1 ? 's' : ''}
                                    </div>
                                  )}
                                </div>
                                
                                <p className="text-sm text-slate-500 font-medium mb-1">{user.role}</p>
                                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{user.bio}</p>
                                
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {user.tags.map((tag, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div className="text-xs text-slate-500">
                                    <span className="flex items-center gap-2">
                                      <Users size={12} className="text-amber-500" />
                                      {user.followers.toLocaleString()} followers
                                    </span>
                                  </div>
                                  
                                  <div>
                                    {user.pending ? (
                              <Button 
                                variant="outline" 
                                        size="sm" 
                                        className="border-amber-200 bg-amber-50 text-amber-600 shadow-sm transition-all h-8"
                                        disabled
                              >
                                        <Clock size={14} className="mr-1" />
                                        Pending
                              </Button>
                            ) : (
                                      <Button 
                                        size="sm" 
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm transition-all h-8"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleConnect(user);
                                        }}
                                      >
                                        <UserPlus size={14} className="mr-1" />
                                        Connect
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Requests Tab */}
                  {activePeopleTab === "requests" && (
                    <div>
                      {friendRequests.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <UserPlus size={24} className="text-slate-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">No pending requests</h3>
                          <p className="text-slate-500 mb-4">When someone sends you a connection request, it will appear here</p>
                              <Button 
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md"
                            onClick={() => setActivePeopleTab("discover")}
                              >
                            <UserSearch size={16} className="mr-2" />
                            Find People to Connect
                              </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {friendRequests.map(request => (
                            <div key={request.id} className="bg-white rounded-lg border border-slate-200 p-5 hover:border-amber-200 hover:shadow-md transition-all">
                              <div className="flex items-start gap-4">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xl font-semibold shadow-md">
                                  {request.avatar || request.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-slate-800">
                                      {request.name}
                                    </h3>
                                    <div className="text-xs text-slate-500">
                                      Requested {request.requestDate}
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm text-slate-500 font-medium mb-1">{request.role}</p>
                                  <p className="text-sm text-slate-600 mb-3">{request.bio}</p>
                                  
                                  {request.mutualConnections > 0 && (
                                    <div className="flex items-center mb-4 text-sm text-slate-600">
                                      <UserSearch size={14} className="text-slate-400 mr-1.5" />
                                      {request.mutualConnections} mutual connection{request.mutualConnections > 1 ? 's' : ''}
                                    </div>
                                  )}
                                  
                                  <div className="flex gap-3">
                                    <ReliableButton 
                                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md flex-1"
                                      onClick={() => handleAcceptRequest(request)}
                                      actionName={`Accept request from ${request.name}`}
                                    >
                                      Accept
                                    </ReliableButton>
                                    <ReliableButton 
                                      variant="outline" 
                                      className="border-slate-200 text-slate-700 hover:bg-slate-50 flex-1"
                                      onClick={() => handleRejectRequest(request.id)}
                                      actionName={`Decline request from ${request.name}`}
                                    >
                                      Decline
                                    </ReliableButton>
                          </div>
                        </div>
                      </div>
                    </div>
                          ))}
                  </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Connection suggestions */}
              {activePeopleTab === "friends" && friends.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-slate-800">People you might know</h3>
                    <Button
                      variant="ghost"
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      onClick={() => setActivePeopleTab("discover")}
                    >
                      See More
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {discoverUsers.filter(user => user.mutualConnections > 0).slice(0, 3).map(user => (
                      <div 
                        key={user.id} 
                        className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer"
                        onClick={() => handleViewProfile(user)}
                      >
                        <div className="relative mb-3">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xl font-semibold shadow-md">
                            {user.avatar || user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          {user.online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                          )}
                        </div>
                        
                        <h4 className="font-medium text-slate-800 text-center">{user.name}</h4>
                        <p className="text-xs text-slate-500 text-center mb-2">{user.role}</p>
                        
                        <div className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full mb-3">
                          {user.mutualConnections} mutual connection{user.mutualConnections > 1 ? 's' : ''}
                        </div>
                        
                        <ReliableButton 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm transition-all h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConnect(user);
                          }}
                          actionName={`Connect with ${user.name}`}
                        >
                          <UserPlus size={14} className="mr-1" />
                          Connect
                        </ReliableButton>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* User Profile Modal */}
              {showUserProfile && selectedUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-32 relative">
                      <button 
                        className="absolute right-4 top-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
                        onClick={handleCloseProfile}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="px-8 pt-0 pb-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <div className="-mt-16 mb-4 relative inline-block">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-4xl font-semibold shadow-xl border-4 border-white">
                              {selectedUser.avatar || selectedUser.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {selectedUser.online && (
                              <div className="absolute bottom-3 right-3 h-5 w-5 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                            )}
                          </div>
                          
                          <h2 className="text-2xl font-bold text-slate-800 mb-1">{selectedUser.name}</h2>
                          <p className="text-slate-500 font-medium mb-4">{selectedUser.role}</p>
                          
                          <p className="text-sm text-slate-600 mb-4">{selectedUser.bio}</p>
                          
                          <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                              <MapPin size={16} className="text-slate-400" />
                              {selectedUser.location}
                            </div>
                            {selectedUser.connectionDate && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar size={16} className="text-slate-400" />
                                {selectedUser.connectionDate}
                              </div>
                            )}
                          </div>
                          
                          {selectedUser.connected ? (
                            <div className="space-y-2">
                              <ReliableButton
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                                onClick={() => {
                                  alert(`Message sent to ${selectedUser.name}`);
                                  handleCloseProfile();
                                }}
                                actionName={`Send message to ${selectedUser.name}`}
                              >
                                <Mail size={16} className="mr-2" />
                                Message
                              </ReliableButton>
                              <ReliableButton 
                                variant="outline" 
                                className="w-full border-slate-200 text-red-600 hover:text-red-700 hover:border-red-200 shadow-sm transition-all"
                                onClick={() => {
                                  handleRemoveFriend(selectedUser.id);
                                  handleCloseProfile();
                                }}
                                actionName={`Remove ${selectedUser.name} from connections`}
                              >
                                <UserMinus size={16} className="mr-2" />
                                Remove Connection
                              </ReliableButton>
                </div>
              ) : (
                            selectedUser.pending ? (
                              <ReliableButton 
                                variant="outline" 
                                className="w-full border-amber-200 bg-amber-50 text-amber-600 shadow-sm transition-all"
                                disabled
                                actionName="Connection pending"
                              >
                                <Clock size={16} className="mr-2" />
                                Connection Pending
                              </ReliableButton>
                            ) : (
                              <ReliableButton 
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                                onClick={() => {
                                  handleConnect(selectedUser);
                                  handleCloseProfile();
                                }}
                                actionName={`Connect with ${selectedUser.name}`}
                              >
                                <UserPlus size={16} className="mr-2" />
                                Connect
                              </ReliableButton>
                            )
                          )}
                        </div>
                        
                        <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-6">
                          <h3 className="text-lg font-semibold text-slate-800 mb-4">Activity</h3>
                          
                          {selectedUser.recentContent && (
                            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="text-slate-600 font-medium">{selectedUser.recentContent}</p>
                            </div>
                          )}
                          
                          <div className="mb-6">
                            <h4 className="font-medium text-slate-700 mb-2">Skills & Expertise</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedUser.tags && selectedUser.tags.map((tag, i) => (
                                <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {selectedUser.connected && (
                            <div>
                              <h4 className="font-medium text-slate-700 mb-3">Collaboration History</h4>
                              
                              {selectedUser.collaborations > 0 ? (
                                <div className="border border-slate-200 rounded-lg divide-y divide-slate-200">
                                  <div className="p-3 flex justify-between items-center">
                                    <div>
                                      <h5 className="font-medium text-slate-800">Webinar Co-host</h5>
                                      <p className="text-sm text-slate-500">Content Creation Strategies</p>
                                    </div>
                                    <span className="text-xs text-slate-500">3 months ago</span>
                                  </div>
                                  {selectedUser.collaborations > 1 && (
                                    <div className="p-3 flex justify-between items-center">
                                      <div>
                                        <h5 className="font-medium text-slate-800">Resource Contribution</h5>
                                        <p className="text-sm text-slate-500">Marketing Guide for Creators</p>
                                      </div>
                                      <span className="text-xs text-slate-500">5 months ago</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-slate-500 text-sm">No collaborations yet</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Communities Section */}
          {activeSection === "communities" && (
            <div className="animate-fadeIn">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-800 mb-1">Communities</h1>
                      <p className="text-slate-500">Join and engage with communities of like-minded creators</p>
                    </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Search communities..." 
                    className="py-1.5 pl-9 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64 transition-all"
                        />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                      </div>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-8">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-800">Your Communities</h2>
                  <div className="text-sm flex items-center gap-2 text-slate-500">
                    <span className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-1.5"></div>
                      New
                    </span>
                    <span className="flex items-center">
                      <Star size={14} className="text-amber-500 mr-1" />
                      Favorites
                    </span>
                    </div>
                  </div>
                  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {joinedCommunities.map(communityId => (
                    <div 
                      key={communityId} 
                      className="group relative rounded-xl border border-slate-200 hover:border-amber-300 shadow-sm hover:shadow transition-all duration-200 overflow-hidden"
                    >
                      {/* Community card header with gradient background */}
                      <div className="h-24 bg-gradient-to-r from-slate-700 to-slate-600 relative">
                        <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-10"></div>
                        <div className="absolute top-3 right-3">
                          <button 
                            className={`h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLeaveCommunity(communityId);
                            }}
                          >
                            <Star size={16} fill={joinedCommunities.includes(communityId) ? "currentColor" : "none"} />
                          </button>
                          </div>
                        
                        {/* Community icon or category icon */}
                        <div className="absolute -bottom-6 left-6">
                          <div className="h-12 w-12 rounded-lg bg-white shadow-md flex items-center justify-center">
                            {communityList.find(c => c.id === communityId)?.category === "Photography" ? (
                              <Camera size={22} className="text-amber-600" />
                            ) : communityList.find(c => c.id === communityId)?.category === "Audio" ? (
                              <Mic size={22} className="text-amber-600" />
                            ) : communityList.find(c => c.id === communityId)?.category === "Video" ? (
                              <Video size={22} className="text-amber-600" />
                            ) : (
                              <Users size={22} className="text-amber-600" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Community content */}
                      <div className="p-6 pt-8">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                            {communityList.find(c => c.id === communityId)?.name}
                          </h3>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                            <Check size={10} className="mr-1" />
                            Joined
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{communityList.find(c => c.id === communityId)?.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-slate-500">
                            <Users size={14} className="mr-1.5 text-amber-500" />
                            {communityList.find(c => c.id === communityId)?.members} members
                          </div>
                          
                          <ReliableButton 
                              variant="outline" 
                              size="sm" 
                            className="border-slate-200 text-amber-600 hover:bg-amber-50 hover:border-amber-200 shadow-sm transition-all"
                            onClick={() => handleViewCommunityDetails({ id: communityId })}
                            actionName={`View community details`}
                          >
                            View Community
                            <ChevronRight size={16} className="ml-1 opacity-70" />
                          </ReliableButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {joinedCommunities.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="inline-flex h-20 w-20 rounded-full bg-slate-100 items-center justify-center mb-4">
                      <Users size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No communities joined yet</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">Join communities to connect with like-minded creators and expand your network</p>
                    <ReliableButton
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => {
                        // Logic to show communities to join
                      }}
                      actionName="Find communities to join"
                    >
                      Discover Communities
                    </ReliableButton>
                  </div>
                )}
              </div>
              
              {/* Recommended Communities */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-slate-800">Recommended Communities</h3>
                  <ReliableButton
                    variant="ghost"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={() => {
                      console.log("View all communities clicked");
                      // Show all communities logic would go here
                    }}
                    actionName="View all communities"
                  >
                    View All
                    <ChevronRight size={16} className="ml-1" />
                  </ReliableButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {communities.filter(c => !c.joined).slice(0, 3).map(community => (
                    <div 
                      key={community.id}
                      className="border border-slate-200 rounded-lg p-5 hover:border-amber-200 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => {
                        setActiveCommunity(community);
                        setActiveCommunityTab("about");
                      }}
                    >
                      <div className="h-12 w-12 bg-gradient-to-br from-slate-200 to-slate-100 rounded-xl flex items-center justify-center text-slate-500 mb-3">
                        {community.category === "Photography" ? (
                          <Camera size={24} />
                        ) : community.category === "Audio" ? (
                          <Mic size={24} />
                        ) : community.category === "Video" ? (
                          <Video size={24} />
                        ) : (
                          <Users size={24} />
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-1">{community.name}</h4>
                      <p className="text-xs text-slate-500 mb-3">
                        {community.members.toLocaleString()} members • {community.category}
                      </p>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{community.description}</p>
                      <ReliableButton
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinCommunity(community.id);
                        }}
                        actionName={`Join ${community.name}`}
                            >
                              Join Community
                      </ReliableButton>
                          </div>
                  ))}
                        </div>
                      </div>
              
              {/* Trending Discussions */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 mb-8">
                <h3 className="font-semibold text-lg text-slate-800 mb-4">Trending Discussions</h3>
                <div className="space-y-6">
                  {[
                    {
                      title: "Best camera setups for small spaces?",
                      community: "Photography Masters",
                      replies: 23,
                      active: true,
                      tags: ["Equipment", "Studio Setup"]
                    },
                    {
                      title: "Algorithm change affecting video reach - let's discuss strategies",
                      community: "Video Creators Network",
                      replies: 47,
                      active: true,
                      tags: ["Algorithm", "Growth"]
                    },
                    {
                      title: "New podcast hosting platforms comparison",
                      community: "Podcasters United",
                      replies: 15,
                      active: false,
                      tags: ["Hosting", "Equipment"]
                    }
                  ].map((discussion, index) => (
                    <div 
                      key={index} 
                      className="border border-slate-200 rounded-lg p-4 hover:border-amber-200 transition-all"
                      onClick={() => {
                        console.log(`Viewing discussion: ${discussion.title}`);
                        // Navigate to discussion logic would go here
                      }}
                    >
                      <h4 className="font-semibold text-slate-800 mb-1 hover:text-amber-600 cursor-pointer">{discussion.title}</h4>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-slate-500">in {discussion.community}</span>
                        {discussion.active && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                            <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></span>
                            Active now
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {discussion.tags.map((tag, i) => (
                            <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">{discussion.replies} replies</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Upcoming Community Events */}
              {communities.some(c => c.joined && c.events.length > 0) && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 mb-8">
                  <h3 className="font-semibold text-lg text-slate-800 mb-4">Your Upcoming Community Events</h3>
                  <div className="space-y-4">
                    {communities.filter(c => c.joined).flatMap(c => 
                      c.events.map(event => ({...event, communityName: c.name, communityId: c.id}))
                    ).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3).map((event, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4 hover:border-amber-200 transition-all flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center h-16 w-16 bg-amber-50 text-amber-600 rounded-lg">
                          <span className="text-sm font-medium">{event.date.split(" ")[0]}</span>
                          <span className="text-xl font-bold">{event.date.split(" ")[1]}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{event.title}</h4>
                          <p className="text-sm text-slate-500">
                            {event.time} • {event.communityName}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs flex items-center text-slate-500">
                              <Users size={12} className="mr-1" />
                              {event.attendees} attending
                            </span>
                            {event.registered && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                                <Check size={10} className="mr-1" />
                                Registered
                              </span>
                            )}
                          </div>
                        </div>
                        <ReliableButton
                          variant={event.registered ? "outline" : "default"}
                          size="sm"
                          className={event.registered ? "border-slate-200 text-slate-700" : "bg-amber-600 hover:bg-amber-700 text-white"}
                          onClick={() => {
                            console.log(`Register for event ${event.id} in community ${event.communityId}`);
                            if (typeof handleRegisterForEvent === 'function') {
                              handleRegisterForEvent(event.communityId, event.id);
                            } else {
                              alert(`Registration ${event.registered ? 'cancelled' : 'confirmed'} for ${event.title}`);
                            }
                          }}
                          actionName={event.registered ? "Cancel registration" : "Register for event"}
                        >
                          {event.registered ? "Registered" : "Register"}
                        </ReliableButton>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Join a community banner moved to bottom */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-md p-6 md:p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-2">Want to join a community?</h3>
                  <p className="text-amber-700 max-w-2xl mx-auto">
                    Connect with like-minded creators, share ideas, and grow your network by joining
                    existing communities or starting your own.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <ReliableButton 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md px-6"
                    actionName="View all communities"
                    onClick={() => {
                      console.log("View all communities clicked");
                      // Navigation logic for viewing all communities
                    }}
                  >
                    View All Communities
                  </ReliableButton>
                  <ReliableButton 
                    variant="outline"
                    className="border-amber-300 text-amber-800 hover:bg-amber-100 shadow-sm px-6"
                    actionName="Start a community"
                    onClick={() => {
                      console.log("Start a community clicked");
                      alert("Community creation form will open here");
                    }}
                  >
                    Start a Community
                  </ReliableButton>
                </div>
              </div>
            </div>
          )}
          
          {/* Chat Section */}
          {activeSection === "chat" && (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">Chat</h1>
                  <p className="text-slate-500">Connect and collaborate with fellow creators</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="py-1.5 pl-9 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64 transition-all"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                </div>
              </div>
              
              {/* Chat Navigation Tabs */}
              <div className="flex border-b border-slate-200 mb-6">
                <button 
                  className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                    activeChatTab === 'direct' 
                      ? 'border-amber-500 text-amber-600' 
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                  onClick={() => setActiveChatTab('direct')}
                >
                  <UserRound size={16} />
                  Friends
                  {chatDirectMessages.reduce((sum, dm) => sum + dm.unreadCount, 0) > 0 && (
                    <span className="bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {chatDirectMessages.reduce((sum, dm) => sum + dm.unreadCount, 0)}
                    </span>
                  )}
                </button>
                <button 
                  className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                    activeChatTab === 'community' 
                      ? 'border-amber-500 text-amber-600' 
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                  onClick={() => setActiveChatTab('community')}
                >
                  <Users size={16} />
                  Communities
                  {communityChannels.reduce((sum, ch) => sum + ch.unreadCount, 0) > 0 && (
                    <span className="bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {communityChannels.reduce((sum, ch) => sum + ch.unreadCount, 0)}
                    </span>
                  )}
                </button>
                <button 
                  className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                    activeChatTab === 'platform' 
                      ? 'border-amber-500 text-amber-600' 
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                  onClick={() => setActiveChatTab('platform')}
                >
                  <Globe size={16} />
                  Platform
                  {platformChannels.reduce((sum, ch) => sum + ch.unreadCount, 0) > 0 && (
                    <span className="bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {platformChannels.reduce((sum, ch) => sum + ch.unreadCount, 0)}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Direct Messages / Friends Chat */}
              {activeChatTab === 'direct' && (
                <>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-6">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-slate-800">Direct Messages</h2>
                      <div className="flex gap-2">
                        <ReliableButton
                          variant="outline"
                          size="sm"
                          className="border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-200"
                          onClick={() => setShowNewChatModal(true)}
                          actionName="Start new direct message"
                        >
                          <UserPlus size={14} className="mr-1" />
                          New Message
                        </ReliableButton>
                        <div className="text-sm flex items-center gap-2 text-slate-500">
                          <span className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                            Online
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                      {chatDirectMessages.map(dm => (
                        <div 
                          key={dm.id} 
                          className={`p-4 hover:bg-slate-50 transition-all duration-200 cursor-pointer group ${
                            selectedChannel?.id === dm.id ? 'bg-amber-50' : ''
                          }`}
                          onClick={() => setSelectedChannel(dm)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-medium">
                                {dm.avatar || dm.name.charAt(0)}
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                                dm.status === 'online' ? 'bg-green-500' : 
                                dm.status === 'away' ? 'bg-amber-400' : 'bg-slate-300'
                              }`}></div>
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <h3 className="font-medium text-slate-800">{dm.name}</h3>
                                <span className="text-xs text-slate-500">
                                  {dm.messages.length > 0 ? 
                                    dm.messages[dm.messages.length-1].time : 
                                    'No messages'}
                                </span>
                              </div>
                              
                              <div className="flex justify-between mt-1">
                                <p className="text-sm text-slate-500 truncate max-w-[12rem]">
                                  {dm.lastMessage}
                                </p>
                                {dm.unreadCount > 0 && (
                                  <span className="bg-amber-500 text-white text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1.5">
                                    {dm.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {chatDirectMessages.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="inline-flex h-12 w-12 rounded-full bg-slate-100 items-center justify-center mb-3">
                          <UserRound size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-slate-600 font-medium mb-1">No direct messages yet</h3>
                        <p className="text-slate-500 text-sm mb-4">Start a conversation with another creator</p>
                        <ReliableButton
                          size="sm"
                          onClick={() => setShowNewChatModal(true)}
                          actionName="Start new direct message"
                        >
                          New Message
                        </ReliableButton>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-6">
                    <div className="p-4 border-b border-slate-200">
                      <h2 className="text-lg font-semibold text-slate-800">Online Friends</h2>
                    </div>
                    
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {friends.filter(f => f.online).map(friend => (
                        <div 
                          key={friend.id} 
                          className="border border-slate-200 rounded-lg p-3 hover:border-amber-200 hover:shadow-sm transition-all cursor-pointer"
                          onClick={() => {
                            // Find existing DM or create new one
                            const existingDM = chatDirectMessages.find(dm => dm.name === friend.name);
                            if (existingDM) {
                              setSelectedChannel(existingDM);
                              setActiveChatTab('direct');
                            } else {
                              // Logic to create new DM channel
                              alert(`New chat with ${friend.name} would be created here`);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-medium text-sm">
                                {friend.avatar || friend.name.charAt(0)}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-800 text-sm">{friend.name}</h3>
                              <p className="text-xs text-green-600">Online</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {friends.filter(f => f.online).length === 0 && (
                        <div className="col-span-full p-4 text-center text-slate-500">
                          No friends are currently online
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {/* Community Chat */}
              {activeChatTab === 'community' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-6">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">Community Channels</h2>
                    <div className="flex gap-2">
                      <select className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-slate-50">
                        <option value="all">All Communities</option>
                        {communities.filter(c => c.joined).map(community => (
                          <option key={community.id} value={community.id}>{community.name}</option>
                        ))}
                      </select>
                      <div className="text-sm flex items-center gap-2 text-slate-500">
                        <span className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500 mr-1.5"></div>
                          New
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {communityChannels.map(channel => (
                      <div 
                        key={channel.id} 
                        className={`p-4 hover:bg-slate-50 transition-all duration-200 cursor-pointer group ${
                          selectedChannel?.id === channel.id ? 'bg-amber-50' : ''
                        }`}
                        onClick={() => setSelectedChannel(channel)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-gradient-to-br from-slate-300 to-slate-200 rounded-lg w-10 h-10 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                            <MessageSquare size={20} className="text-slate-500" />
                            {channel.community && (
                              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium text-slate-800 mb-0.5 group-hover:text-amber-600 transition-colors">
                                  {channel.name}
                                </h3>
                                {channel.community && (
                                  <p className="text-xs text-amber-600">{channel.community}</p>
                                )}
                              </div>
                              {channel.unreadCount > 0 && (
                                <span className="bg-amber-500 text-white text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1.5">
                                  {channel.unreadCount}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-slate-500 mt-1">{channel.description}</p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center text-xs text-slate-500">
                                <Users size={12} className="mr-1.5 text-amber-500" />
                                {channel.participants || '—'} participants
                              </div>
                              
                              <span className="text-xs text-slate-500">
                                {channel.lastActive || 'No activity'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {communityChannels.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="inline-flex h-12 w-12 rounded-full bg-slate-100 items-center justify-center mb-3">
                          <Users size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-slate-600 font-medium mb-1">No community channels yet</h3>
                        <p className="text-slate-500 text-sm mb-4">Join a community to access its channels</p>
                        <ReliableButton
                          size="sm"
                          onClick={() => navigateToSection("communities")}
                          actionName="Browse communities"
                        >
                          Browse Communities
                        </ReliableButton>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Platform-wide Chat */}
              {activeChatTab === 'platform' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-6">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">Platform Channels</h2>
                    <div className="text-sm flex items-center gap-2 text-slate-500">
                      <span className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-1.5"></div>
                        Active
                      </span>
                      <span className="flex items-center">
                        <Star size={14} className="text-amber-500 mr-1" />
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {platformChannels.map(channel => (
                      <div 
                        key={channel.id} 
                        className={`p-4 hover:bg-slate-50 transition-all duration-200 cursor-pointer group ${
                          selectedChannel?.id === channel.id ? 'bg-amber-50' : ''
                        }`}
                        onClick={() => setSelectedChannel(channel)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`rounded-lg w-10 h-10 flex-shrink-0 flex items-center justify-center relative overflow-hidden ${
                            channel.featured ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-slate-300 to-slate-200'
                          }`}>
                            <Globe size={20} className={channel.featured ? 'text-white' : 'text-slate-500'} />
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium text-slate-800 mb-0.5 group-hover:text-amber-600 transition-colors flex items-center">
                                  {channel.name}
                                  {channel.featured && (
                                    <Star size={14} className="text-amber-500 ml-1.5" fill="currentColor" />
                                  )}
                                </h3>
                                <p className="text-xs text-slate-500">{channel.category}</p>
                              </div>
                              {channel.unreadCount > 0 && (
                                <span className="bg-amber-500 text-white text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1.5">
                                  {channel.unreadCount}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-slate-500 mt-1">{channel.description}</p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center text-xs text-slate-500">
                                <Users size={12} className="mr-1.5 text-amber-500" />
                                {channel.participants} active users
                              </div>
                              
                              {channel.joined ? (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                                  <Check size={10} className="mr-1" />
                                  Joined
                                </span>
                              ) : (
                                <ReliableButton
                                  variant="outline"
                                  size="xs"
                                  className="border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Logic to join channel
                                    alert(`You would join the ${channel.name} channel here`);
                                  }}
                                  actionName={`Join ${channel.name} channel`}
                                >
                                  Join
                                </ReliableButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Start a new conversation banner */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-md p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-xl font-bold text-amber-800 mb-2">Connect with the community</h3>
                  <p className="text-amber-700 mb-1">Start conversations, share ideas, and build relationships</p>
                  <p className="text-sm text-amber-600">Create a new chat or join an existing channel</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <ReliableButton 
                    className="bg-white text-amber-600 border border-amber-300 hover:bg-amber-50 shadow-md"
                    onClick={() => {
                      setShowNewChatModal(true);
                    }}
                    actionName="Start a new conversation"
                  >
                    <UserPlus size={16} className="mr-2" />
                    New Direct Message
                  </ReliableButton>
                  <ReliableButton 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                    onClick={() => {
                      setActiveChatTab('platform');
                    }}
                    actionName="Browse platform channels"
                  >
                    <Globe size={16} className="mr-2" />
                    Browse Channels
                  </ReliableButton>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 