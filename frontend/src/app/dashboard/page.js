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
import { AuthService, ExperienceService } from "@/lib/auth";
import { WebinarDashboardService } from "@/lib/webinar-dashboard-service";
import { TaskService } from "@/lib/task-service";
import { SettingsSection } from "@/components/settings-update";
import { CalendarView } from "@/components/calendar-view";
import { WebinarManagementPanel } from "@/components/webinar-management-panel";



export default function Dashboard() {

  console.log("Dashboard component is rendering");

  // Authentication and user state
  const [currentUser, setCurrentUser] = useState(null);
  const [userExperience, setUserExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Settings state
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    bio: "",
    phone: "",
    creator_name: "",
    category: "",
    location: "",
    website: ""
  });
  const [notificationPreferences, setNotificationPreferences] = useState({
    webinar_reminders: true,
    connection_requests: true,
    community_activity: true,
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [currentPlan, setCurrentPlan] = useState("Free Plan");
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [profileSaveMessage, setProfileSaveMessage] = useState("");
  const [notificationSaveMessage, setNotificationSaveMessage] = useState("");

  // Active section/view state
  const [activeSection, setActiveSection] = useState("home");

  // API data state
  const [apiUpcomingWebinars, setApiUpcomingWebinars] = useState([]);
  const [apiFeaturedWebinar, setApiFeaturedWebinar] = useState(null);
  const [apiCategories, setApiCategories] = useState([]);
  const [apiFeaturedSpeakers, setApiFeaturedSpeakers] = useState([]);
  const [apiStatistics, setApiStatistics] = useState(null);
  const [isLoadingApiData, setIsLoadingApiData] = useState(false);

  

  // Debug current section

  useEffect(() => {

    console.log("Active section changed to:", activeSection);

  }, [activeSection]);

  // Initialize profile form when currentUser changes

  useEffect(() => {

    if (currentUser) {

      setProfileForm({

        full_name: currentUser.full_name || "",

        bio: currentUser.bio || "",

        phone: currentUser.phone || "",

        creator_name: currentUser.creator_name || "",

        category: currentUser.category || "",

        location: currentUser.location || "",

        website: currentUser.website || ""

      });

    }

  }, [currentUser]);

  // Fetch API data when user is loaded
  const fetchApiData = async () => {
    if (!currentUser) return;
    
    setIsLoadingApiData(true);
    try {
      // Fetch all API data in parallel
      const [upcomingWebinars, featuredWebinar, categories, featuredSpeakers, statistics] = await Promise.all([
        WebinarDashboardService.getUpcomingWebinars(currentUser.id),
        WebinarDashboardService.getFeaturedWebinar(currentUser.id),
        WebinarDashboardService.getCategories(),
        WebinarDashboardService.getFeaturedSpeakers(),
        WebinarDashboardService.getStatistics(currentUser.id)
      ]);

      setApiUpcomingWebinars(upcomingWebinars.data || []);
      setApiFeaturedWebinar(featuredWebinar.data);
      setApiCategories(categories.data || []);
      setApiFeaturedSpeakers(featuredSpeakers.data || []);
      setApiStatistics(statistics.data);
      
      console.log('API Data loaded:', {
        upcomingWebinars: upcomingWebinars.data?.length || 0,
        featuredWebinar: !!featuredWebinar.data,
        categories: categories.data?.length || 0,
        featuredSpeakers: featuredSpeakers.data?.length || 0,
        statistics: statistics.data
      });
      
      // Debug registration status
      if (upcomingWebinars.data) {
        console.log('Registration status for webinars:', upcomingWebinars.data.map(w => ({
          id: w.id,
          title: w.title,
          isRegistered: w.isRegistered
        })));
      }
    } catch (error) {
      console.error('Error fetching API data:', error);
    } finally {
      setIsLoadingApiData(false);
    }
  };

  // Fetch API data when user changes
  useEffect(() => {
    fetchApiData();
  }, [currentUser]);

  

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  

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

    const webinarMatches = apiUpcomingWebinars

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

      { id: "nav-webinar-management", title: "Webinar Management", section: "webinarManagement", icon: <Video size={16} /> },

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

  

  // Upcoming webinars data - TODO: Replace with API data

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

  const handleRegisterWebinar = async (webinarId) => {

    if (!currentUser) {
      alert("Please log in to register for webinars.");
      return;
    }

    try {
      // Check if already registered
      const isRegistered = apiUpcomingWebinars.find(w => w.id === webinarId)?.isRegistered;
      
      if (isRegistered) {
        // Unregister
        const response = await fetch(`/api/webinars/register?userId=${currentUser.id}&webinarId=${webinarId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // Refresh API data to update the UI
          await fetchApiData();
          // Remove alert - just refresh silently
        } else {
          const error = await response.json();
          alert(`Error unregistering: ${error.error}`);
        }
      } else {
        // Register
        const response = await fetch('/api/webinars/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.id,
            webinarId: webinarId
          })
        });
        
        if (response.ok) {
          // Refresh API data to update the UI
          await fetchApiData();
          console.log('Registration successful, refreshing data...');
          // Remove alert - just refresh silently
        } else {
          const error = await response.json();
          alert(`Error registering: ${error.error}`);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred while processing your registration.');
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

    // Generate calendar links
    const startDate = new Date(`${webinar.date}T${webinar.time}`);
    const endDate = new Date(startDate.getTime() + (webinar.duration_minutes || 60) * 60000);
    
    // Google Calendar
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(webinar.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(webinar.description || '')}&location=${encodeURIComponent(webinar.meeting_link || 'Online')}`;
    
    // Open Google Calendar in new tab
    window.open(googleCalendarUrl, '_blank');

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



  // User stats for the home dashboard - now using real data
  const userStats = useMemo(() => {
    if (!currentUser || !userExperience) {
      return {
        name: "Loading...",
        webinarsAttended: 0,
        level: 1,
        connections: 0,
        progress: 0,
        notesCount: 0,
        certificatesEarned: 0,
      };
    }
    
    // Calculate progress towards next level
    const currentExp = userExperience.total_exp;
    const currentLevel = userExperience.current_level;
    const expToNextLevel = userExperience.exp_to_next_level;
    const progress = Math.min(100, Math.round((currentExp / expToNextLevel) * 100));
    
    return {
      name: currentUser.full_name || "User",
      webinarsAttended: currentUser.webinars_attended || 0,
      level: currentLevel,
      connections: currentUser.connections_count || 0,
      progress: progress,
      notesCount: currentUser.notes_count || 0,
      certificatesEarned: currentUser.certificates_earned || 0,
    };
  }, [currentUser, userExperience]);



  // Daily quests for the home dashboard - now using real data
  const [dailyQuests, setDailyQuests] = useState([]);
  const [isLoadingQuests, setIsLoadingQuests] = useState(true);

  // Load daily quests from database
  useEffect(() => {
    const loadDailyQuests = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoadingQuests(true);
        const questsData = await TaskService.getDailyTasks(currentUser.id);
        
        // Transform the data to match our UI format
        const formattedQuests = questsData.map(quest => ({
          id: quest.id,
          title: quest.title,
          description: quest.description,
          progress: quest.is_completed ? quest.exp_reward : 0,
          total: quest.exp_reward,
          reward: quest.exp_reward,
          isCompleted: quest.is_completed,
          icon: getQuestIcon(quest.title),
        }));
        
        setDailyQuests(formattedQuests);
      } catch (error) {
        console.error("Error loading daily quests:", error);
      } finally {
        setIsLoadingQuests(false);
      }
    };
    
    loadDailyQuests();
  }, [currentUser]);

  // Helper function to get appropriate icon for quest type
  const getQuestIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('webinar') || lowerTitle.includes('attend')) {
      return <Globe size={20} className="text-indigo-500" />;
    } else if (lowerTitle.includes('note') || lowerTitle.includes('share')) {
      return <FileText size={20} className="text-amber-500" />;
    } else if (lowerTitle.includes('connect') || lowerTitle.includes('speaker')) {
      return <Users size={20} className="text-green-500" />;
    } else if (lowerTitle.includes('feedback') || lowerTitle.includes('comment')) {
      return <MessageSquare size={20} className="text-orange-500" />;
    } else {
      return <Target size={20} className="text-blue-500" />;
    }
  };

  // Mark a quest as completed
  const handleCompleteQuest = async (questId) => {
    if (!currentUser) return;
    
    try {
      const result = await TaskService.completeTask(currentUser.id, questId);
      if (result.success) {
        // Update local state
        setDailyQuests(prev => 
          prev.map(quest => 
            quest.id === questId 
              ? { ...quest, isCompleted: true, progress: quest.total } 
              : quest
          )
        );
        
        // Refresh user experience data
        const expData = await ExperienceService.getUserExperience(currentUser.id);
        if (expData.success) {
          setUserExperience(expData.data);
        }
        
        // Show success message
        console.log(`Quest completed! Earned ${result.expEarned} EXP`);
      } else {
        console.error("Failed to complete quest:", result.error);
      }
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };







  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated using session token
        if (typeof window !== 'undefined') {
          const sessionToken = localStorage.getItem('sessionToken');
          
          if (!sessionToken) {
            console.log("No session token found");
            setIsLoading(false);
            return;
          }
          
          // Validate session token with backend
          const response = await fetch('/api/auth/validate-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionToken }),
          });
          
          if (!response.ok) {
            console.log("Invalid session token");
            localStorage.removeItem('sessionToken');
            setIsLoading(false);
            return;
          }
          
          const { user } = await response.json();
          setCurrentUser(user);
          
          // Get user experience data
          const expData = await ExperienceService.getUserExperience(user.id);
          if (expData.success) {
            setUserExperience(expData.data);
          }
          
          // Check for URL parameters to set initial state
          const urlParams = new URLSearchParams(window.location.search);
          const tabParam = urlParams.get('tab');
          const settingsTabParam = urlParams.get('settingsTab');
          const urlSessionToken = urlParams.get('session');
          const welcome = urlParams.get('welcome');
          const error = urlParams.get('error');
          const errorMessage = urlParams.get('message');
          
          // Handle OAuth errors
          if (error && errorMessage) {
            console.log('OAuth error detected:', error, errorMessage);
            setError(decodeURIComponent(errorMessage));
            
            // Clean up URL parameters
            const newUrl = new URL(window.location);
            newUrl.searchParams.delete('error');
            newUrl.searchParams.delete('message');
            window.history.replaceState({}, '', newUrl);
            return;
          }
          
          // Handle OAuth session token from URL
          if (urlSessionToken) {
            try {
              // Validate session token with backend
              const response = await fetch('/api/auth/validate-session', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionToken: urlSessionToken }),
              });
              
              if (response.ok) {
                const { user } = await response.json();
                
                // Set user as authenticated
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                setCurrentUser(user);
                
                // Get user experience data
                const expData = await ExperienceService.getUserExperience(user.id);
                if (expData.success) {
                  setUserExperience(expData.data);
                }
                
                // Show welcome message for new users
                console.log('Welcome parameter:', welcome);
                if (welcome === 'true') {
                  console.log('Setting welcome message to true');
                  setShowWelcomeMessage(true);
                  // Auto-hide after 30 seconds
                  setTimeout(() => setShowWelcomeMessage(false), 30000);
                }
                
                // Clean up URL parameters
                const newUrl = new URL(window.location);
                newUrl.searchParams.delete('session');
                newUrl.searchParams.delete('welcome');
                newUrl.searchParams.delete('authMethod');
                window.history.replaceState({}, '', newUrl);
              }
            } catch (error) {
              console.error('Session validation error:', error);
            }
          }
          
          if (tabParam === 'settings') {
            setActiveSection('settings');
            if (settingsTabParam) {
              setActiveSettingsTab(settingsTabParam);
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);



  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            {error.includes('OAuth') || error.includes('Google') ? 'Authentication Error' : 'Something went wrong'}
          </h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
            <Button onClick={() => window.location.href = '/signup'}>Go to Signup</Button>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-500 mb-4">
            <Lock size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Please log in</h2>
          <p className="text-slate-600 mb-4">You need to be logged in to access your dashboard.</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

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

                Creator Webinars <span className="text-xs font-normal text-slate-500 ml-1">Version Beta</span>
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

                  console.log("Clicked Webinar Management");

                  navigateToSection("webinarManagement");

                }}

                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${

                  activeSection === "webinarManagement" 

                    ? 'text-amber-600 bg-amber-50' 

                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'

                }`}

                style={{cursor: 'pointer'}}

              >

                {activeSection === "webinarManagement" && (

                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"></div>

                )}

                <span>

                  <Video size={17} strokeWidth={2.2} className="text-slate-400" />

                </span>

                <span>Webinar Management</span>

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
          
          {/* Welcome Message for New Users */}
          {showWelcomeMessage && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Welcome to Creator Webinars! 🎉</h3>
                  <p className="text-green-700 mb-3">
                    {new URLSearchParams(window.location.search).get('authMethod') === 'email' 
                      ? "Your account has been successfully created with email and password. You can start exploring webinars, customize your profile, and connect with other creators."
                      : "Your account has been successfully created and you're now signed in with Google. You can start exploring webinars, customize your profile, and connect with other creators."
                    }
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {new URLSearchParams(window.location.search).get('authMethod') === 'email' 
                        ? "Email Account Created"
                        : "Google Account Connected"
                      }
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Ready to Explore
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowWelcomeMessage(false)}
                  className="text-green-400 hover:text-green-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

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

                      {isLoadingQuests ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
                          <p className="text-slate-600 text-sm">Loading daily quests...</p>
                        </div>
                      ) : dailyQuests.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-slate-500 text-sm">No daily quests available today.</p>
                        </div>
                      ) : (
                        dailyQuests.map(quest => (
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
                            
                            {quest.isCompleted ? (
                              <div className="w-full mt-3 bg-green-100 text-green-700 py-1 rounded text-sm text-center font-medium">
                                Completed!
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleCompleteQuest(quest.id)}
                                className="w-full mt-3 border border-amber-200 text-amber-600 hover:bg-amber-50 py-1 rounded text-sm transition-colors"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        ))
                      )}
                      
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

                      {apiUpcomingWebinars.slice(0, 3).map(webinar => (

                        <div key={webinar.id} className="p-4 hover:bg-slate-50 transition-all">

                          <div className="flex gap-4">

                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-amber-50 text-amber-600 rounded-lg flex-shrink-0">

                              <span className="text-xs font-medium">

                                {new Date(webinar.scheduled_date).toLocaleString('default', { month: 'short' })}

                              </span>

                              <span className="text-lg font-bold">

                                {new Date(webinar.scheduled_date).getDate()}

                              </span>

                            </div>

                            

                            <div>

                              <h3 className="font-medium text-slate-800 line-clamp-1">{webinar.title}</h3>

                              <p className="text-xs text-slate-500 mt-1">{webinar.scheduled_time}</p>

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

                      <p className="text-2xl font-bold text-slate-800">
                        {isLoadingApiData ? '...' : apiStatistics?.totalUpcoming || 0}
                      </p>

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

                      <p className="text-2xl font-bold text-slate-800">{apiStatistics?.userRegistrations || 0}</p>

                      <div className="mt-2 flex items-center text-xs text-slate-500">

                        <Calendar size={14} className="mr-1" />

                        <span>Next: {apiStatistics?.nextWebinar || 'No upcoming webinars'}</span>

                      </div>

                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

                      <div className="flex items-center justify-between mb-4">

                        <h3 className="text-sm font-medium text-slate-500">Total Speakers</h3>

                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">

                          <Users size={16} className="text-blue-600" />

                        </div>

                      </div>

                      <p className="text-2xl font-bold text-slate-800">{apiStatistics?.totalSpeakers || 0}</p>

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

                      <p className="text-2xl font-bold text-slate-800">{apiStatistics?.totalCategories || 0}</p>

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

                      {apiUpcomingWebinars.map((webinar, index) => (

                        <div 

                          key={index}

                          className="p-4 border border-slate-200 rounded-lg hover:border-amber-200 hover:shadow-sm transition-all group cursor-pointer"

                          onClick={() => handleViewWebinarDetails(webinar)}

                        >

                          <div className="flex flex-col md:flex-row md:items-center gap-4">

                            <div className="flex-1">

                              <div className="flex items-center gap-2 mb-1">

                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">

                                  {webinar.category}

                                </span>

                                {webinar.daysLeft === 0 && (

                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">

                                    Today

                                  </span>

                                )}

                                {webinar.isRegistered && (

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

                                  {webinar.registered || 0} attendees

                                </span>

                              </div>

                            </div>

                            <div className="flex flex-wrap gap-2 md:flex-nowrap">

                              {!webinar.isRegistered ? (

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

                                  className="border-green-200 text-green-700 bg-green-50 min-w-20"

                                  onClick={(e) => {

                                    e.stopPropagation();

                                    handleRegisterWebinar(webinar.id);

                                  }}

                                  actionName={`Unregister from "${webinar.title}"`}

                                >

                                  <Check size={14} className="mr-1" />

                                  Registered

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

          

          {/* Calendar Section */}
          {activeSection === "calendar" && (
            <CalendarView 
              currentUser={currentUser}
              onWebinarSelect={(webinar) => {
                setSelectedWebinar(webinar);
                setShowWebinarDetails(true);
              }}
            />
          )}

          {/* Webinar Management Section */}
          {activeSection === "webinarManagement" && (
            <WebinarManagementPanel 
              currentUser={currentUser}
              onWebinarUpdated={() => {
                // Refresh calendar view if needed
                if (activeSection === "calendar") {
                  // Force re-render of calendar
                  setActiveSection("calendar");
                }
              }}
            />
          )}

          {/* Settings Section */}

          {activeSection === "settings" && (
            <SettingsSection 
              currentUser={currentUser}
              userExperience={userExperience}
              activeSettingsTab={activeSettingsTab}
              setActiveSettingsTab={setActiveSettingsTab}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              notificationPreferences={notificationPreferences}
              setNotificationPreferences={setNotificationPreferences}
              paymentMethods={paymentMethods}
              setPaymentMethods={setPaymentMethods}
              currentPlan={currentPlan}
              setCurrentPlan={setCurrentPlan}
              showAddPaymentMethod={showAddPaymentMethod}
              setShowAddPaymentMethod={setShowAddPaymentMethod}
              isLoadingPayment={isLoadingPayment}
              setIsLoadingPayment={setIsLoadingPayment}
              isSavingProfile={isSavingProfile}
              setIsSavingProfile={setIsSavingProfile}
              isSavingNotifications={isSavingNotifications}
              setIsSavingNotifications={setIsSavingNotifications}
              profileSaveMessage={profileSaveMessage}
              setProfileSaveMessage={setProfileSaveMessage}
              notificationSaveMessage={notificationSaveMessage}
              setNotificationSaveMessage={setNotificationSaveMessage}
            />
          )}

        </main>

      </div>

    </div>

  );

} 