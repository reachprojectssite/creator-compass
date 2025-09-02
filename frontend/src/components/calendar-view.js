import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Video, Clock, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WebinarHostingService } from '@/lib/webinar-hosting-service';
import { WebinarCreationForm } from './webinar-creation-form';

export function CalendarView({ currentUser, onWebinarSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [webinars, setWebinars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showCreateWebinar, setShowCreateWebinar] = useState(false);
  const [userCanCreateWebinars, setUserCanCreateWebinars] = useState(false);

  // Check if user can create webinars
  useEffect(() => {
    if (currentUser) {
      // Only speakers and employees can create webinars
      setUserCanCreateWebinars(
        currentUser.user_type === 'speaker' || currentUser.user_type === 'employee'
      );
    }
  }, [currentUser]);

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const tempDate = new Date(startDate);
    
    while (tempDate <= lastDay || days.length < 42) {
      days.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    return days;
  };

  // Load webinars for the current month
  useEffect(() => {
    const loadWebinars = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        let result;
        
        if (currentUser.user_type === 'employee') {
          // Admins can see all webinars
          result = await WebinarHostingService.getAllWebinars(currentUser.id);
        } else {
          // Regular users see their own webinars and public ones
          const ownWebinars = await WebinarHostingService.getHostUpcomingWebinars(currentUser.id, currentUser.id);
          if (ownWebinars.success) {
            result = ownWebinars;
          } else {
            result = { success: false, data: [] };
          }
        }

        if (result.success) {
          // Filter for upcoming webinars only
          const upcomingWebinars = result.data.filter(webinar => 
            webinar.status === 'upcoming' && 
            new Date(webinar.date) >= new Date()
          );
          setWebinars(upcomingWebinars);
        }
      } catch (error) {
        console.error('Error loading webinars:', error);
        setWebinars([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWebinars();
  }, [currentDate, currentUser]);

  // Get webinars for a specific date
  const getWebinarsForDate = (date) => {
    return webinars.filter(webinar => {
      const webinarDate = new Date(webinar.date);
      return webinarDate.toDateString() === date.toDateString();
    });
  };

  // Add to Google Calendar
  const addToGoogleCalendar = (webinar) => {
    const startDate = new Date(`${webinar.date}T${webinar.time}`);
    const endDate = new Date(startDate.getTime() + (webinar.duration_minutes || 60) * 60000);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(webinar.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(webinar.description || '')}&location=${encodeURIComponent(webinar.meeting_link || 'Online')}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  // Add to Outlook Calendar
  const addToOutlookCalendar = (webinar) => {
    const startDate = new Date(`${webinar.date}T${webinar.time}`);
    const endDate = new Date(startDate.getTime() + (webinar.duration_minutes || 60) * 60000);
    
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(webinar.title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(webinar.description || '')}&location=${encodeURIComponent(webinar.meeting_link || 'Online')}`;
    
    window.open(outlookUrl, '_blank');
  };

  // Download ICS file
  const downloadICS = (webinar) => {
    const startDate = new Date(`${webinar.date}T${webinar.time}`);
    const endDate = new Date(startDate.getTime() + (webinar.duration_minutes || 60) * 60000);
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Creator Webinars//Calendar Event//EN',
      'BEGIN:VEVENT',
      `UID:${webinar.id}@creatorwebinars.com`,
      `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:${webinar.title}`,
      `DESCRIPTION:${webinar.description || ''}`,
      `LOCATION:${webinar.meeting_link || 'Online'}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${webinar.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const calendarDays = getCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
      {/* Calendar Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">Calendar</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-amber-50 text-amber-600 border-amber-200"
              >
                Month
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-slate-600"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="p-2"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="p-2"
            >
              <ChevronRight size={16} />
            </Button>
            {userCanCreateWebinars && (
              <Button
                onClick={() => setShowCreateWebinar(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Plus size={16} className="mr-2" />
                Create Webinar
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-2">
          <h3 className="text-xl font-bold text-slate-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-slate-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const dayWebinars = getWebinarsForDate(date);
            
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-slate-100 cursor-pointer transition-colors ${
                  isCurrentMonth ? 'bg-white' : 'bg-slate-50'
                } ${
                  isToday ? 'bg-amber-50 border-amber-200' : ''
                } ${
                  isSelected ? 'bg-amber-100 border-amber-300' : ''
                } hover:bg-slate-50`}
                onClick={() => setSelectedDate(date)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                } ${
                  isToday ? 'text-amber-600' : ''
                }`}>
                  {date.getDate()}
                </div>
                
                {/* Webinar indicators */}
                {dayWebinars.map((webinar, webinarIndex) => (
                  <div
                    key={webinarIndex}
                    className="text-xs p-1 mb-1 bg-amber-100 text-amber-800 rounded cursor-pointer hover:bg-amber-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onWebinarSelect?.(webinar);
                    }}
                  >
                    <div className="font-medium truncate">{webinar.title}</div>
                    <div className="flex items-center gap-1 text-amber-700">
                      <Clock size={10} />
                      {webinar.time}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <h4 className="font-medium text-slate-800 mb-3">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          
          {getWebinarsForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getWebinarsForDate(selectedDate).map((webinar) => (
                <div key={webinar.id} className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-slate-800 mb-1">{webinar.title}</h5>
                      <p className="text-sm text-slate-600 mb-2">{webinar.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {webinar.time} ({webinar.duration_minutes || 60} min)
                        </div>
                        {webinar.meeting_link && (
                          <div className="flex items-center gap-1">
                            <Video size={12} />
                            <a 
                              href={webinar.meeting_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-amber-600 hover:underline"
                            >
                              Join Meeting
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToGoogleCalendar(webinar)}
                        className="text-xs"
                      >
                        Google
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToOutlookCalendar(webinar)}
                        className="text-xs"
                      >
                        Outlook
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadICS(webinar)}
                        className="text-xs"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No webinars scheduled for this date.</p>
          )}
        </div>
      )}

      {/* Webinar Creation Form */}
      {showCreateWebinar && (
        <WebinarCreationForm
          currentUser={currentUser}
          onClose={() => setShowCreateWebinar(false)}
          onWebinarCreated={(webinar) => {
            // Refresh webinars list
            setWebinars(prev => [webinar, ...prev]);
            setShowCreateWebinar(false);
          }}
        />
      )}
    </div>
  );
}
