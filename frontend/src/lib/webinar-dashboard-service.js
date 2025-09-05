export class WebinarDashboardService {
  // Get upcoming webinars
  static async getUpcomingWebinars(userId, options = {}) {
    try {
      const params = new URLSearchParams({
        userId: userId,
        ...options
      });

      const response = await fetch(`/api/webinars/upcoming?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Get upcoming webinars error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get featured webinar
  static async getFeaturedWebinar(userId) {
    try {
      const params = new URLSearchParams({ userId });
      const response = await fetch(`/api/webinars/featured?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Get featured webinar error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get categories with counts
  static async getCategories() {
    try {
      const response = await fetch('/api/webinars/categories');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Get categories error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get featured speakers
  static async getFeaturedSpeakers(limit = 3) {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      const response = await fetch(`/api/speakers/featured?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Get featured speakers error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get webinar statistics
  static async getStatistics(userId) {
    try {
      const params = new URLSearchParams({ userId });
      const response = await fetch(`/api/webinars/statistics?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Get statistics error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register for webinar
  static async registerForWebinar(userId, webinarId) {
    try {
      const response = await fetch('/api/webinars/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, webinarId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Register for webinar error:', error);
      return { success: false, error: error.message };
    }
  }

  // Unregister from webinar
  static async unregisterFromWebinar(userId, webinarId) {
    try {
      const params = new URLSearchParams({ userId, webinarId });
      const response = await fetch(`/api/webinars/register?${params}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Unregister from webinar error:', error);
      return { success: false, error: error.message };
    }
  }

  // Search webinars
  static async searchWebinars(userId, searchTerm, category = null) {
    try {
      const params = new URLSearchParams({
        userId,
        search: searchTerm,
        ...(category && { category })
      });

      const response = await fetch(`/api/webinars/upcoming?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Search webinars error:', error);
      return { success: false, error: error.message };
    }
  }
}
