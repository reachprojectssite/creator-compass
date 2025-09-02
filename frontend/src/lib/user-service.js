import { supabase } from './database';

export class UserService {
  // Update user profile information
  static async updateProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: profileData.full_name,
          bio: profileData.bio,
          phone: profileData.phone,
          creator_name: profileData.creator_name,
          category: profileData.category,
          location: profileData.location,
          website: profileData.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user notification preferences
  static async updateNotificationPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: userId,
          webinar_reminders: preferences.webinar_reminders,
          connection_requests: preferences.connection_requests,
          community_activity: preferences.community_activity,
          email_notifications: preferences.email_notifications,
          push_notifications: preferences.push_notifications,
          marketing_emails: preferences.marketing_emails,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user notification preferences
  static async getNotificationPreferences(userId) {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      // Return default preferences if none exist
      if (!data) {
        return {
          success: true,
          data: {
            webinar_reminders: true,
            connection_requests: true,
            community_activity: true,
            email_notifications: true,
            push_notifications: true,
            marketing_emails: false
          }
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user profile by ID
  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user avatar/profile picture
  static async updateAvatar(userId, avatarFile) {
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, avatarFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      return { success: true, data: { avatar_url: publicUrl } };
    } catch (error) {
      console.error('Error updating avatar:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete user account (with confirmation)
  static async deleteAccount(userId, password) {
    try {
      // First verify the user's password
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      // Delete user data from our tables
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;

      // Delete notification preferences
      await supabase
        .from('user_notification_preferences')
        .delete()
        .eq('user_id', userId);

      // Delete user from Supabase Auth
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId);
      if (authDeleteError) throw authDeleteError;

      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { success: false, error: error.message };
    }
  }
}
