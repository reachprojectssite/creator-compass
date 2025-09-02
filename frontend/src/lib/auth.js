import { supabase, TABLES, USER_TYPES } from './database';
import bcrypt from 'bcryptjs';

export class AuthService {
  // Enhanced email validation (server-side)
  static validateEmail(email) {
    // Basic checks
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: 'Email is too long (maximum 254 characters)' };
    }
    
    // Trim whitespace
    const trimmedEmail = email.trim();
    if (trimmedEmail !== email) {
      return { isValid: false, error: 'Email cannot contain leading or trailing spaces' };
    }
    
    // Check for @ symbol
    if (!trimmedEmail.includes('@')) {
      return { isValid: false, error: 'Email must contain @ symbol' };
    }
    
    // Split email into local and domain parts
    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) {
      return { isValid: false, error: 'Email can only contain one @ symbol' };
    }
    
    const [localPart, domain] = parts;
    
    // Validate local part (before @)
    if (!localPart || localPart.length === 0) {
      return { isValid: false, error: 'Email must have content before @ symbol' };
    }
    
    if (localPart.length > 64) {
      return { isValid: false, error: 'Part before @ is too long (maximum 64 characters)' };
    }
    
    // Check for valid characters in local part
    const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
    if (!localPartRegex.test(localPart)) {
      return { isValid: false, error: 'Invalid characters in email address' };
    }
    
    // Check for consecutive dots
    if (localPart.includes('..')) {
      return { isValid: false, error: 'Email cannot contain consecutive dots' };
    }
    
    // Check for dots at start or end of local part
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return { isValid: false, error: 'Email cannot start or end with a dot' };
    }
    
    // Validate domain part (after @)
    if (!domain || domain.length === 0) {
      return { isValid: false, error: 'Email must have a domain after @ symbol' };
    }
    
    if (domain.length > 253) {
      return { isValid: false, error: 'Domain part is too long (maximum 253 characters)' };
    }
    
    // Check for valid domain format
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domain)) {
      return { isValid: false, error: 'Invalid domain format' };
    }
    
    // Check for at least one dot in domain
    if (!domain.includes('.')) {
      return { isValid: false, error: 'Domain must contain at least one dot (e.g., .com, .org)' };
    }
    
    // Check for valid TLD (top-level domain)
    const tld = domain.split('.').pop();
    if (!tld || tld.length < 2) {
      return { isValid: false, error: 'Domain must have a valid top-level domain (e.g., .com, .org)' };
    }
    
    // Check for valid TLD characters
    const tldRegex = /^[a-zA-Z]{2,}$/;
    if (!tldRegex.test(tld)) {
      return { isValid: false, error: 'Top-level domain must contain only letters' };
    }
    
    // Check for consecutive dots in domain
    if (domain.includes('..')) {
      return { isValid: false, error: 'Domain cannot contain consecutive dots' };
    }
    
    // Check for dots at start or end of domain
    if (domain.startsWith('.') || domain.endsWith('.')) {
      return { isValid: false, error: 'Domain cannot start or end with a dot' };
    }
    
    // Check for common disposable email domains (optional security measure)
    const disposableDomains = [
      'tempmail.org', '10minutemail.com', 'guerrillamail.com', 
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ];
    
    if (disposableDomains.some(disposable => domain.toLowerCase().includes(disposable))) {
      return { isValid: false, error: 'Please use a valid email address (disposable emails not allowed)' };
    }
    
    return { isValid: true, email: trimmedEmail };
  }

  // User registration
  static async registerUser(userData) {
    try {
      const { email, full_name, password, university, interests, consent_events, consent_newsletter } = userData;
      
      // Validate email server-side
      const emailValidation = this.validateEmail(email);
      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.error };
      }
      
      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      // Create user with validated email
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .insert({
          email: emailValidation.email, // Use validated/trimmed email
          full_name,
          password_hash,
          university,
          interests: interests ? [interests] : [],
          user_type: USER_TYPES.CONSUMER,
          auth_method: 'email' // Flag to identify traditional users
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create user experience record
      const { error: expError } = await supabase
        .from('user_exp')
        .insert({
          user_id: user.id,
          total_exp: 0,
          current_level: 1,
          exp_to_next_level: 1
        });

      if (expError) throw expError;

      // Add to newsletter if consented
      if (consent_events || consent_newsletter) {
        await supabase
          .from('newsletter_subscribers')
          .upsert({
            email: emailValidation.email, // Use validated/trimmed email
            full_name,
            consent_events: consent_events || false,
            consent_newsletter: consent_newsletter || false
          });
      }

      // Create a session token for the new user
      const sessionToken = btoa(`${user.id}:${Date.now()}:${Math.random()}`);
      
      // Store session in database
      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: sessionToken,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        // Don't fail registration if session creation fails
      }

      return { success: true, user, sessionToken };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  // User login
  static async loginUser(email, password) {
    try {
      // Get user with password hash
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (userError || !user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Check if user is OAuth-only
      if (user.auth_method === 'oauth') {
        return { success: false, error: 'This account was created with Google. Please use "Continue with Google" to sign in.' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Create a session token (simple timestamp-based token for now)
      const sessionToken = btoa(`${user.id}:${Date.now()}:${Math.random()}`);
      
      // Store session in database (optional, for server-side validation)
      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: sessionToken,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });

      if (sessionError) {
        console.warn('Session storage error (non-critical):', sessionError);
      }

      return { success: true, user, sessionToken };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      // Check for session token in localStorage
      if (typeof window !== 'undefined') {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
          // Validate session token with server
          const response = await fetch('/api/auth/validate-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionToken }),
          });

          if (response.ok) {
            const userData = await response.json();
            return userData;
          } else {
            // Session is invalid, clear it
            localStorage.removeItem('sessionToken');
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Logout user
  static async logoutUser() {
    try {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
      }

      // Clear server-side session
      const { error } = await supabase.auth.signOut();
      if (error) console.warn('Server logout error (non-critical):', error);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  static async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  static async isAuthenticated() {
    try {
      // Check localStorage first for client-side session
      if (typeof window !== 'undefined') {
        const isAuth = localStorage.getItem('isAuthenticated');
        const currentUser = localStorage.getItem('currentUser');
        if (isAuth === 'true' && currentUser) {
          return true;
        }
      }

      // Fallback to server-side session check
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return !!session;
    } catch (error) {
      console.error('Check auth error:', error);
      return false;
    }
  }
}

// Experience and leveling system
export class ExperienceService {
  // Calculate Fibonacci sequence for level requirements
  static getExpForLevel(level) {
    if (level <= 1) return 0;
    if (level === 2) return 1;
    
    let a = 1, b = 1;
    for (let i = 3; i <= level; i++) {
      const temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  }

  // Add experience to user
  static async addExperience(userId, expAmount, reason = '') {
    try {
      // Get current user experience
      const { data: userExp, error: expError } = await supabase
        .from('user_exp')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (expError) throw expError;

      let newTotalExp = userExp.total_exp + expAmount;
      let newLevel = userExp.current_level;
      let expToNextLevel = userExp.exp_to_next_level;

      // Check for level up
      while (newTotalExp >= expToNextLevel) {
        newLevel++;
        expToNextLevel = this.getExpForLevel(newLevel + 1);
      }

      // Update user experience
      const { error: updateError } = await supabase
        .from('user_exp')
        .update({
          total_exp: newTotalExp,
          current_level: newLevel,
          exp_to_next_level: expToNextLevel
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Create notification for level up
      if (newLevel > userExp.current_level) {
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            title: 'Level Up!',
            message: `Congratulations! You've reached level ${newLevel}!`,
            type: 'level_up'
          });
      }

      return { 
        success: true, 
        newTotalExp, 
        newLevel, 
        expToNextLevel,
        leveledUp: newLevel > userExp.current_level
      };
    } catch (error) {
      console.error('Add experience error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user experience summary
  static async getUserExperience(userId) {
    try {
      const { data, error } = await supabase
        .from('user_exp')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If user experience doesn't exist, create default experience
        if (error.code === 'PGRST116') { // No rows returned
          const { data: newExp, error: createError } = await supabase
            .from('user_exp')
            .insert({
              user_id: userId,
              total_exp: 0,
              current_level: 1,
              exp_to_next_level: 1
            })
            .select()
            .single();

          if (createError) throw createError;
          return { success: true, data: newExp };
        }
        throw error;
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Get user experience error:', error);
      return { success: false, error: error.message };
    }
  }
}
