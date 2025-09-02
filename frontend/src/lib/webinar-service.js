import { supabase, TABLES, WEBINAR_STATUS } from './database';
import { ExperienceService } from './auth';

export class WebinarService {
  // Get upcoming webinars
  static async getUpcomingWebinars() {
    try {
      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .eq('status', WEBINAR_STATUS.UPCOMING)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get upcoming webinars error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get live webinars
  static async getLiveWebinars() {
    try {
      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .select('*')
        .eq('status', WEBINAR_STATUS.LIVE);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get live webinars error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get past webinars for a user
  static async getUserPastWebinars(userId, days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from(TABLES.USER_WEBINARS)
        .select(`
          *,
          webinars (
            *,
            speakers (
              id,
              full_name,
              profile_image_url
            )
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('attended_at', cutoffDate.toISOString())
        .order('attended_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get user past webinars error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register user for webinar
  static async registerForWebinar(userId, webinarId) {
    try {
      // Check if already registered
      const { data: existing, error: checkError } = await supabase
        .from(TABLES.USER_WEBINARS)
        .select('*')
        .eq('user_id', userId)
        .eq('webinar_id', webinarId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existing) {
        return { success: false, error: 'Already registered for this webinar' };
      }

      // Register user
      const { data, error } = await supabase
        .from(TABLES.USER_WEBINARS)
        .insert({
          user_id: userId,
          webinar_id: webinarId,
          status: 'registered'
        })
        .select()
        .single();

      if (error) throw error;

      // Add experience for registration
      await ExperienceService.addExperience(userId, 1, 'webinar_registration');

      return { success: true, data };
    } catch (error) {
      console.error('Register for webinar error:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark webinar as attended
  static async markWebinarAttended(userId, webinarId, watchTimeMinutes = 0) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_WEBINARS)
        .update({
          status: 'attended',
          attended_at: new Date().toISOString(),
          watch_time_minutes: watchTimeMinutes
        })
        .eq('user_id', userId)
        .eq('webinar_id', webinarId)
        .select()
        .single();

      if (error) throw error;

      // Add experience based on watch time
      let expEarned = 0;
      if (watchTimeMinutes >= 10) {
        expEarned = 2; // 2 exp for watching at least 10 minutes
      } else if (watchTimeMinutes >= 5) {
        expEarned = 1; // 1 exp for watching at least 5 minutes
      }

      if (expEarned > 0) {
        await ExperienceService.addExperience(userId, expEarned, 'webinar_attendance');
      }

      return { success: true, data, expEarned };
    } catch (error) {
      console.error('Mark webinar attended error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get webinar statistics
  static async getWebinarStats() {
    try {
      // Get total upcoming webinars
      const { count: totalUpcoming } = await supabase
        .from(TABLES.WEBINARS)
        .select('*', { count: 'exact', head: true })
        .gte('date', new Date().toISOString().split('T')[0])
        .eq('status', WEBINAR_STATUS.UPCOMING);

      // Get total speakers
      const { count: totalSpeakers } = await supabase
        .from(TABLES.USERS)
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'speaker')
        .eq('is_active', true);

      // Get total categories (hardcoded for now as mentioned in requirements)
      const totalCategories = 6;

      return {
        success: true,
        data: {
          totalUpcoming: totalUpcoming || 0,
          totalSpeakers: totalSpeakers || 0,
          totalCategories
        }
      };
    } catch (error) {
      console.error('Get webinar stats error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get featured webinar (most registered)
  static async getFeaturedWebinar() {
    try {
      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .select(`
          *,
          user_webinars!inner(count)
        `)
        .gte('date', new Date().toISOString().split('T')[0])
        .lte('date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .eq('status', WEBINAR_STATUS.UPCOMING)
        .order('user_webinars.count', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get featured webinar error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get top speakers
  static async getTopSpeakers() {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select(`
          id,
          full_name,
          profile_image_url,
          user_webinars!inner(
            webinars!inner(
              user_webinars!inner(watch_time_minutes)
            )
          )
        `)
        .eq('user_type', 'speaker')
        .eq('is_active', true)
        .limit(5);

      if (error) throw error;

      // Calculate total watch time for each speaker
      const speakersWithStats = data.map(speaker => {
        const totalWatchTime = speaker.user_webinars?.reduce((total, uw) => {
          return total + (uw.webinars?.user_webinars?.reduce((sum, userWebinar) => 
            sum + (userWebinar.watch_time_minutes || 0), 0) || 0);
        }, 0) || 0;

        return {
          ...speaker,
          totalWatchTime,
          upcomingWebinars: speaker.user_webinars?.length || 0
        };
      });

      // Sort by total watch time
      speakersWithStats.sort((a, b) => b.totalWatchTime - a.totalWatchTime);

      return { success: true, data: speakersWithStats };
    } catch (error) {
      console.error('Get top speakers error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create new webinar (for employees)
  static async createWebinar(webinarData, createdBy) {
    try {
      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .insert({
          ...webinarData,
          created_by: createdBy
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Create webinar error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update webinar status
  static async updateWebinarStatus(webinarId, status) {
    try {
      const { data, error } = await supabase
        .from(TABLES.WEBINARS)
        .update({ status })
        .eq('id', webinarId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Update webinar status error:', error);
      return { success: false, error: error.message };
    }
  }
}
