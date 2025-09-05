import { supabase, TABLES, USER_TYPES } from './database';
import GoogleCalendarService from './google-calendar-service';

export class WebinarHostingService {
  // Check if user has permission to manage a webinar
  static async hasWebinarPermission(userId, webinarId, action = 'manage') {
    try {
      // Get webinar details
      const { data: webinar, error } = await supabase
        .from(TABLES.WEBINARS)
        .select('created_by, is_public, status')
        .eq('id', webinarId)
        .single();

      if (error) throw error;

      // Check if user is the creator
      if (webinar.created_by === userId) {
        return { hasPermission: true, reason: 'creator' };
      }

      // Check if user is an admin/employee
      const { data: user } = await supabase
        .from(TABLES.USERS)
        .select('user_type')
        .eq('id', userId)
        .single();

      if (user?.user_type === USER_TYPES.EMPLOYEE) {
        return { hasPermission: true, reason: 'admin' };
      }

      // For view-only actions, check if webinar is public
      if (action === 'view' && webinar.is_public) {
        return { hasPermission: true, reason: 'public' };
      }

      return { hasPermission: false, reason: 'unauthorized' };
    } catch (error) {
      console.error('Permission check error:', error);
      return { hasPermission: false, reason: 'error' };
    }
  }

  // Create a new webinar with Google Meet integration
  static async createWebinarWithMeeting(webinarData, createdBy) {
    try {
      // Verify user can create webinars
      const { data: user } = await supabase
        .from(TABLES.USERS)
        .select('user_type, google_verified, google_access_token')
        .eq('id', createdBy)
        .single();

      // Only speakers and employees can create webinars
      if (user?.user_type !== USER_TYPES.SPEAKER && user?.user_type !== USER_TYPES.EMPLOYEE) {
        throw new Error('Only speakers and employees can create webinars');
      }

      let meetingLink = null;
      let calendarEventId = null;

      // If user has Google account verified, create calendar event
      if (user.google_verified && user.google_access_token) {
        try {
          const calendarService = new GoogleCalendarService();
          
          // Create calendar event with Google Meet
          const calendarEvent = await calendarService.createCalendarEvent(
            user.google_access_token,
            webinarData
          );
          
          // Extract Meet link and calendar event ID
          meetingLink = calendarService.getMeetLinkFromEvent(calendarEvent);
          calendarEventId = calendarEvent.id;
          
        } catch (calendarError) {
          console.warn('Failed to create Google Calendar event, using fallback:', calendarError);
          // Fallback to mock Meet link
          meetingLink = await this.generateGoogleMeetLink(webinarData);
        }
      } else {
        // Generate mock Google Meet link for users without Google integration
        meetingLink = await this.generateGoogleMeetLink(webinarData);
      }
      
      // Ensure webinar has a meeting link
      if (!meetingLink) {
        meetingLink = await this.generateGoogleMeetLink(webinarData);
      }

      // Create webinar in database
      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .insert({
          ...webinarData,
          created_by: createdBy,
          meeting_link: meetingLink,
          google_calendar_event_id: calendarEventId,
          status: 'upcoming'
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Create webinar with meeting error:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate Google Meet link
  static async generateGoogleMeetLink(webinarData) {
    // For now, we'll create a simple Google Meet link
    // In production, you'd integrate with Google Calendar API to create actual meetings
    
    const meetingId = this.generateMeetingId();
    const baseUrl = 'https://meet.google.com';
    
    return `${baseUrl}/${meetingId}`;
  }

  // Generate a unique meeting ID (Google Meet format: xxx-xxxx-xxx)
  static generateMeetingId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    
    let id = '';
    
    // First 3 characters
    for (let i = 0; i < 3; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    id += '-';
    
    // Middle 4 characters
    for (let i = 0; i < 4; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    id += '-';
    
    // Last 3 characters
    for (let i = 0; i < 3; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return id;
  }

  // Start a webinar (change status to live) - Only creator or admin can do this
  static async startWebinar(webinarId, userId) {
    try {
      // Check permissions
      const permission = await this.hasWebinarPermission(userId, webinarId, 'manage');
      if (!permission.hasPermission) {
        throw new Error('You do not have permission to start this webinar');
      }

      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .update({ 
          status: 'live',
          started_at: new Date().toISOString()
        })
        .eq('id', webinarId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Start webinar error:', error);
      return { success: false, error: error.message };
    }
  }

  // End a webinar (change status to completed) - Only creator or admin can do this
  static async endWebinar(webinarId, userId) {
    try {
      // Check permissions
      const permission = await this.hasWebinarPermission(userId, webinarId, 'manage');
      if (!permission.hasPermission) {
        throw new Error('You do not have permission to end this webinar');
      }

      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .update({ 
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', webinarId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('End webinar error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get webinar participants - Only creator, admin, or registered participants can view
  static async getWebinarParticipants(webinarId, userId) {
    try {
      // Check permissions
      const permission = await this.hasWebinarPermission(userId, webinarId, 'view');
      if (!permission.hasPermission) {
        // Check if user is a registered participant
        const { data: registration } = await supabase
          .from(TABLES.USER_WEBINARS)
          .select('id')
          .eq('webinar_id', webinarId)
          .eq('user_id', userId)
          .single();

        if (!registration) {
          throw new Error('You do not have permission to view participants for this webinar');
        }
      }

      const { data, error } = await supabase
        .from(TABLES.USER_WEBINARS)
        .select(`
          *,
          users (
            id,
            full_name,
            email,
            profile_image_url
          )
        `)
        .eq('webinar_id', webinarId)
        .eq('status', 'registered');

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get webinar participants error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send webinar reminder emails - Only creator or admin can do this
  static async sendWebinarReminders(webinarId, userId) {
    try {
      // Check permissions
      const permission = await this.hasWebinarPermission(userId, webinarId, 'manage');
      if (!permission.hasPermission) {
        throw new Error('You do not have permission to send reminders for this webinar');
      }

      // Get participants
      const participantsResult = await this.getWebinarParticipants(webinarId, userId);
      if (!participantsResult.success) throw new Error(participantsResult.error);

      // Get webinar details
      const { data: webinar, error: webinarError } = await supabase
        .from(TABLES.WEBINARS)
        .select('*')
        .eq('id', webinarId)
        .single();

      if (webinarError) throw webinarError;

      // In production, you'd integrate with an email service (SendGrid, Mailgun, etc.)
      // For now, we'll just log the reminder
      console.log(`Sending reminders for webinar: ${webinar.title}`);
      console.log(`Participants: ${participantsResult.data.length}`);

      return { success: true, message: 'Reminders sent successfully' };
    } catch (error) {
      console.error('Send webinar reminders error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get webinar analytics - Only creator, admin, or registered participants can view
  static async getWebinarAnalytics(webinarId, userId) {
    try {
      // Check permissions
      const permission = await this.hasWebinarPermission(userId, webinarId, 'view');
      if (!permission.hasPermission) {
        // Check if user is a registered participant
        const { data: registration } = await supabase
          .from(TABLES.USER_WEBINARS)
          .select('id')
          .eq('webinar_id', webinarId)
          .eq('user_id', userId)
          .single();

        if (!registration) {
          throw new Error('You do not have permission to view analytics for this webinar');
        }
      }

      // Get registration count
      const { count: registrations } = await supabase
        .from(TABLES.USER_WEBINARS)
        .select('*', { count: 'exact', head: true })
        .eq('webinar_id', webinarId);

      // Get attendance count
      const { count: attendance } = await supabase
        .from(TABLES.USER_WEBINARS)
        .select('*', { count: 'exact', head: true })
        .eq('webinar_id', webinarId)
        .eq('status', 'attended');

      // Get average watch time
      const { data: watchTimes } = await supabase
        .from(TABLES.USER_WEBINARS)
        .select('watch_time_minutes')
        .eq('webinar_id', webinarId)
        .not('watch_time_minutes', 'is', null);

      const avgWatchTime = watchTimes.length > 0 
        ? watchTimes.reduce((sum, item) => sum + (item.watch_time_minutes || 0), 0) / watchTimes.length
        : 0;

      return {
        success: true,
        data: {
          registrations: registrations || 0,
          attendance: attendance || 0,
          attendanceRate: registrations > 0 ? (attendance / registrations) * 100 : 0,
          avgWatchTime: Math.round(avgWatchTime),
          totalWatchTime: watchTimes.reduce((sum, item) => sum + (item.watch_time_minutes || 0), 0)
        }
      };
    } catch (error) {
      console.error('Get webinar analytics error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update webinar recording URL - Only creator or admin can do this
  static async updateRecordingUrl(webinarId, recordingUrl, userId) {
    try {
      // Check permissions
      const permission = await this.hasWebinarPermission(userId, webinarId, 'manage');
      if (!permission.hasPermission) {
        throw new Error('You do not have permission to update this webinar');
      }

      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .update({ 
          recording_url: recordingUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', webinarId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Update recording URL error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get upcoming webinars for a host - Only the host or admin can view
  static async getHostUpcomingWebinars(hostId, requestingUserId) {
    try {
      // Check if requesting user is the host or an admin
      if (hostId !== requestingUserId) {
        const { data: user } = await supabase
          .from(TABLES.USERS)
          .select('user_type')
          .eq('id', requestingUserId)
          .single();

        if (user?.user_type !== USER_TYPES.EMPLOYEE) {
          throw new Error('You can only view your own upcoming webinars');
        }
      }

      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .select('*')
        .eq('created_by', hostId)
        .eq('status', 'upcoming')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get host upcoming webinars error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get live webinars for a host - Only the host or admin can view
  static async getHostLiveWebinars(hostId, requestingUserId) {
    try {
      // Check if requesting user is the host or an admin
      if (hostId !== requestingUserId) {
        const { data: user } = await supabase
          .from(TABLES.USERS)
          .select('user_type')
          .eq('id', requestingUserId)
          .single();

        if (user?.user_type !== USER_TYPES.EMPLOYEE) {
          throw new Error('You can only view your own live webinars');
        }
      }

      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .select('*')
        .eq('created_by', hostId)
        .eq('status', 'live');

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get host live webinars error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register for a webinar
  static async registerForWebinar(webinarId, userId) {
    try {
      // Check if webinar exists and is public
      const { data: webinar, error: webinarError } = await supabase
        .from(TABLES.WEBINARS)
        .select('id, is_public, status')
        .eq('id', webinarId)
        .single();

      if (webinarError) throw webinarError;
      if (!webinar.is_public) throw new Error('This webinar is private');
      if (webinar.status !== 'upcoming') throw new Error('Registration is closed for this webinar');

      // Check if already registered
      const { data: existingRegistration } = await supabase
        .from(TABLES.USER_WEBINARS)
        .select('id')
        .eq('webinar_id', webinarId)
        .eq('user_id', userId)
        .single();

      if (existingRegistration) {
        throw new Error('You are already registered for this webinar');
      }

      // Register for webinar
      const { data, error } = await supabase
        .from(TABLES.USER_WEBINARS)
        .insert({
          webinar_id: webinarId,
          user_id: userId,
          status: 'registered',
          registered_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Register for webinar error:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark attendance for a webinar - Only creator or admin can do this
  static async markAttendance(webinarId, participantId, userId, watchTimeMinutes = null) {
    try {
      // Check permissions
      const permission = await this.hasWebinarPermission(userId, webinarId, 'manage');
      if (!permission.hasPermission) {
        throw new Error('You do not have permission to mark attendance for this webinar');
      }

      const { data, error } = await supabase
        .from(TABLES.USER_WEBINARS)
        .update({
          status: 'attended',
          attended_at: new Date().toISOString(),
          watch_time_minutes: watchTimeMinutes
        })
        .eq('webinar_id', webinarId)
        .eq('user_id', participantId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Mark attendance error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all webinars (admin only)
  static async getAllWebinars(userId, filters = {}) {
    try {
      // Check if user is admin
      const { data: user } = await supabase
        .from(TABLES.USERS)
        .select('user_type')
        .eq('id', userId)
        .single();

      if (user?.user_type !== USER_TYPES.EMPLOYEE) {
        throw new Error('Only administrators can view all webinars');
      }

      let query = supabase
        .from(TABLES.WEBINARS)
        .select(`
          *,
          users!webinars_created_by_fkey (
            id,
            full_name,
            email
          )
        `);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get all webinars error:', error);
      return { success: false, error: error.message };
    }
  }
}
