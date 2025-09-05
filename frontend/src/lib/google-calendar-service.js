import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class GoogleCalendarService {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  }

  // Create a Google Calendar event with Google Meet
  async createCalendarEvent(accessToken, webinarData) {
    try {
      const event = {
        summary: webinarData.title,
        description: webinarData.description,
        start: {
          dateTime: new Date(webinarData.start_time).toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(new Date(webinarData.start_time).getTime() + webinarData.duration_minutes * 60000).toISOString(),
          timeZone: 'UTC',
        },
        attendees: webinarData.participants?.map(email => ({ email })) || [],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 15 } // 15 minutes before
          ]
        }
      };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create calendar event: ${errorData.error?.message || response.statusText}`);
      }

      const createdEvent = await response.json();
      return createdEvent;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  // Update calendar event
  async updateCalendarEvent(accessToken, eventId, webinarData) {
    try {
      const event = {
        summary: webinarData.title,
        description: webinarData.description,
        start: {
          dateTime: new Date(webinarData.start_time).toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(new Date(webinarData.start_time).getTime() + webinarData.duration_minutes * 60000).toISOString(),
          timeZone: 'UTC',
        },
        attendees: webinarData.participants?.map(email => ({ email })) || [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 15 }
          ]
        }
      };

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update calendar event: ${errorData.error?.message || response.statusText}`);
      }

      const updatedEvent = await response.json();
      return updatedEvent;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  // Delete calendar event
  async deleteCalendarEvent(accessToken, eventId) {
    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete calendar event: ${errorData.error?.message || response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  // Get user's calendar events
  async getCalendarEvents(accessToken, timeMin, timeMax) {
    try {
      const params = new URLSearchParams({
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 100
      });

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to get calendar events: ${errorData.error?.message || response.statusText}`);
      }

      const events = await response.json();
      return events.items || [];
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }

  // Send calendar invitations to participants
  async sendCalendarInvitations(accessToken, eventId, participants) {
    try {
      const event = {
        attendees: participants.map(email => ({ email }))
      };

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?sendUpdates=all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send calendar invitations: ${errorData.error?.message || response.statusText}`);
      }

      const updatedEvent = await response.json();
      return updatedEvent;
    } catch (error) {
      console.error('Error sending calendar invitations:', error);
      throw error;
    }
  }

  // Get Google Meet link from calendar event
  getMeetLinkFromEvent(event) {
    if (event.conferenceData?.entryPoints) {
      const meetEntry = event.conferenceData.entryPoints.find(
        entry => entry.entryPointType === 'video'
      );
      return meetEntry?.uri || null;
    }
    return null;
  }

  // Check if user has calendar access
  async hasCalendarAccess(accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error checking calendar access:', error);
      return false;
    }
  }

  // Get user's calendar list
  async getCalendarList(accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get calendar list: ${response.statusText}`);
      }

      const calendars = await response.json();
      return calendars.items || [];
    } catch (error) {
      console.error('Error getting calendar list:', error);
      throw error;
    }
  }

  // Update webinar with calendar event ID
  async updateWebinarWithCalendarEvent(webinarId, calendarEventId, meetLink) {
    try {
      const { error } = await supabase
        .from('webinars')
        .update({
          google_calendar_event_id: calendarEventId,
          meeting_link: meetLink,
          updated_at: new Date().toISOString()
        })
        .eq('id', webinarId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error updating webinar with calendar event:', error);
      throw error;
    }
  }
}

export default GoogleCalendarService;
