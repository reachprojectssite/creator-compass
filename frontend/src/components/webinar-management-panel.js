import React, { useState, useEffect, useCallback } from 'react';
import { Video, Clock, Users, MapPin, Play, Square, BarChart3, Send, Download, Edit, Trash2, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WebinarHostingService } from '@/lib/webinar-hosting-service';
import { WebinarCreationForm } from './webinar-creation-form';

export function WebinarManagementPanel({ currentUser, onWebinarUpdated }) {
  const [webinars, setWebinars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [message, setMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Debug logging
  console.log('WebinarManagementPanel - currentUser:', currentUser);
  console.log('WebinarManagementPanel - user_type:', currentUser?.user_type);
  console.log('WebinarManagementPanel - should show create button:', (currentUser?.user_type === 'speaker' || currentUser?.user_type === 'employee'));

  const loadUserWebinars = useCallback(async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      let result;
      
      if (currentUser.user_type === 'employee') {
        // Admins can see all webinars
        result = await WebinarHostingService.getAllWebinars(currentUser.id);
      } else {
        // Regular users see their own webinars
        result = await WebinarHostingService.getHostUpcomingWebinars(currentUser.id, currentUser.id);
      }

      if (result.success) {
        setWebinars(result.data);
      } else {
        setMessage('Failed to load webinars: ' + result.error);
      }
    } catch (error) {
      console.error('Error loading webinars:', error);
      setMessage('Error loading webinars');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Load user's webinars
  useEffect(() => {
    if (currentUser) {
      loadUserWebinars();
    }
  }, [currentUser, loadUserWebinars]);

  // Start webinar
  const handleStartWebinar = async (webinarId) => {
    try {
      const result = await WebinarHostingService.startWebinar(webinarId, currentUser.id);
      if (result.success) {
        setMessage('Webinar started successfully!');
        loadUserWebinars(); // Refresh list
        onWebinarUpdated?.();
      } else {
        setMessage('Failed to start webinar: ' + result.error);
      }
    } catch (error) {
      setMessage('Error starting webinar: ' + error.message);
    }
  };

  // End webinar
  const handleEndWebinar = async (webinarId) => {
    try {
      const result = await WebinarHostingService.endWebinar(webinarId, currentUser.id);
      if (result.success) {
        setMessage('Webinar ended successfully!');
        loadUserWebinars(); // Refresh list
        onWebinarUpdated?.();
      } else {
        setMessage('Failed to end webinar: ' + result.error);
      }
    } catch (error) {
      setMessage('Error ending webinar: ' + error.message);
    }
  };

  // Send reminders
  const handleSendReminders = async (webinarId) => {
    try {
      const result = await WebinarHostingService.sendWebinarReminders(webinarId, currentUser.id);
      if (result.success) {
        setMessage('Reminders sent successfully!');
      } else {
        setMessage('Failed to send reminders: ' + result.error);
      }
    } catch (error) {
      setMessage('Error sending reminders: ' + error.message);
    }
  };

  // View analytics
  const handleViewAnalytics = async (webinarId) => {
    try {
      const result = await WebinarHostingService.getWebinarAnalytics(webinarId, currentUser.id);
      if (result.success) {
        setAnalyticsData(result.data);
        setShowAnalytics(true);
        setSelectedWebinar(webinars.find(w => w.id === webinarId));
      } else {
        setMessage('Failed to load analytics: ' + result.error);
      }
    } catch (error) {
      setMessage('Error loading analytics: ' + error.message);
    }
  };

  // View participants
  const handleViewParticipants = async (webinarId) => {
    try {
      const result = await WebinarHostingService.getWebinarParticipants(webinarId, currentUser.id);
      if (result.success) {
        setMessage(`Participants: ${result.data.length} registered`);
        // You could show this in a modal or expand the webinar row
      } else {
        setMessage('Failed to load participants: ' + result.error);
      }
    } catch (error) {
      setMessage('Error loading participants: ' + error.message);
    }
  };

  // Mark attendance
  const handleMarkAttendance = async (webinarId, participantId) => {
    try {
      const result = await WebinarHostingService.markAttendance(webinarId, participantId, currentUser.id);
      if (result.success) {
        setMessage('Attendance marked successfully!');
      } else {
        setMessage('Failed to mark attendance: ' + result.error);
      }
    } catch (error) {
      setMessage('Error marking attendance: ' + error.message);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { color: 'bg-blue-100 text-blue-800', text: 'Upcoming' },
      live: { color: 'bg-green-100 text-green-800', text: 'Live' },
      completed: { color: 'bg-gray-100 text-gray-800', text: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Get action buttons based on webinar status and user permissions
  const getActionButtons = (webinar) => {
    const buttons = [];

    if (webinar.status === 'upcoming') {
      buttons.push(
        <Button
          key="start"
          size="sm"
          onClick={() => handleStartWebinar(webinar.id)}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Play size={14} className="mr-1" />
          Start
        </Button>
      );
      
      buttons.push(
        <Button
          key="reminders"
          size="sm"
          variant="outline"
          onClick={() => handleSendReminders(webinar.id)}
        >
          <Send size={14} className="mr-1" />
          Send Reminders
        </Button>
      );
    }

    if (webinar.status === 'live') {
      buttons.push(
        <Button
          key="end"
          size="sm"
          onClick={() => handleEndWebinar(webinar.id)}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Square size={14} className="mr-1" />
          End
        </Button>
      );
    }

    if (webinar.status === 'completed' || webinar.status === 'live') {
      buttons.push(
        <Button
          key="analytics"
          size="sm"
          variant="outline"
          onClick={() => handleViewAnalytics(webinar.id)}
        >
          <BarChart3 size={14} className="mr-1" />
          Analytics
        </Button>
      );
      
      buttons.push(
        <Button
          key="participants"
          size="sm"
          variant="outline"
          onClick={() => handleViewParticipants(webinar.id)}
        >
          <Users size={14} className="mr-1" />
          Participants
        </Button>
      );
    }

    return buttons;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <span className="ml-2 text-slate-600">Loading webinars...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Webinar Management</h2>
            <p className="text-slate-600 mt-1">
              {currentUser?.user_type === 'employee' 
                ? 'Manage all platform webinars' 
                : 'Manage your webinars and track performance'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Create Webinar Button - Only show for speakers and employees */}
            {(currentUser?.user_type === 'speaker' || currentUser?.user_type === 'employee') && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus size={16} className="mr-2" />
                Create Webinar
              </Button>
            )}
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-600">{webinars.length}</div>
              <div className="text-sm text-slate-500">Total Webinars</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          {message}
        </div>
      )}

      {/* Webinars List */}
      <div className="p-6">
        {webinars.length === 0 ? (
          <div className="text-center py-12">
            <Video size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No webinars found</h3>
            <p className="text-slate-500">
              {currentUser?.user_type === 'employee' 
                ? 'There are no webinars on the platform yet.'
                : 'You haven\'t created any webinars yet.'
              }
            </p>
            {(currentUser?.user_type === 'speaker' || currentUser?.user_type === 'employee') && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white mt-4"
              >
                <Plus size={16} className="mr-2" />
                Create Your First Webinar
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {webinars.map((webinar) => (
              <div key={webinar.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-slate-800">{webinar.title}</h3>
                      {getStatusBadge(webinar.status)}
                    </div>
                    
                    <p className="text-slate-600 mb-3">{webinar.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(webinar.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {webinar.time} ({webinar.duration_minutes || 60} min)
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        {webinar.max_participants || 'Unlimited'} participants
                      </div>
                      {webinar.meeting_link && (
                        <div className="flex items-center gap-1">
                          <Video size={14} />
                          <a 
                            href={webinar.meeting_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:underline"
                          >
                            Meeting Link
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {getActionButtons(webinar)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Modal */}
      {showAnalytics && selectedWebinar && analyticsData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  Analytics: {selectedWebinar.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnalytics(false)}
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analyticsData.registrations}</div>
                  <div className="text-sm text-blue-700">Total Registrations</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analyticsData.attendance}</div>
                  <div className="text-sm text-green-700">Total Attendance</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{analyticsData.attendanceRate.toFixed(1)}%</div>
                  <div className="text-sm text-purple-700">Attendance Rate</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">{analyticsData.avgWatchTime}</div>
                  <div className="text-sm text-amber-700">Avg Watch Time (min)</div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-2">Total Watch Time</h4>
                <div className="text-2xl font-bold text-slate-600">{analyticsData.totalWatchTime} minutes</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Webinar Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Create New Webinar</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6">
              <WebinarCreationForm
                currentUser={currentUser}
                onWebinarCreated={(webinar) => {
                  setShowCreateForm(false);
                  setMessage('Webinar created successfully!');
                  loadUserWebinars(); // Refresh the list
                  onWebinarUpdated?.(); // Notify parent component
                }}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
