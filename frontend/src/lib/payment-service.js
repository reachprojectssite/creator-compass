import { supabase } from './database';

// Note: In production, you would load this from environment variables
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export class PaymentService {
  // Initialize Stripe (client-side)
  static async initializeStripe() {
    if (typeof window === 'undefined') return null;
    
    try {
      // Dynamically import Stripe to avoid SSR issues
      const { loadStripe } = await import('@stripe/stripe-js');
      return await loadStripe(STRIPE_PUBLISHABLE_KEY);
    } catch (error) {
      console.error('Error loading Stripe:', error);
      return null;
    }
  }

  // Create a payment method setup intent (secure - no sensitive data stored)
  static async createSetupIntent(userId) {
    try {
      // This should be called from your backend API, not directly from frontend
      // For security, the actual Stripe API calls should happen server-side
      const response = await fetch('/api/payments/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) throw new Error('Failed to create setup intent');
      
      const { clientSecret } = await response.json();
      return { success: true, clientSecret };
    } catch (error) {
      console.error('Error creating setup intent:', error);
      return { success: false, error: error.message };
    }
  }

  // Confirm payment method setup (secure - uses Stripe's secure elements)
  static async confirmPaymentMethodSetup(clientSecret, paymentMethod) {
    try {
      const stripe = await this.initializeStripe();
      if (!stripe) throw new Error('Stripe not initialized');

      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: paymentMethod
      });

      if (error) throw error;

      return { success: true, setupIntent };
    } catch (error) {
      console.error('Error confirming payment method setup:', error);
      return { success: false, error: error.message };
    }
  }

  // Save payment method reference to database (only stores Stripe payment method ID, not card details)
  static async savePaymentMethod(userId, paymentMethodId, cardInfo) {
    try {
      // Only store non-sensitive information
      const { data, error } = await supabase
        .from('user_payment_methods')
        .upsert({
          user_id: userId,
          stripe_payment_method_id: paymentMethodId,
          card_brand: cardInfo.brand,
          card_last4: cardInfo.last4,
          card_exp_month: cardInfo.expMonth,
          card_exp_year: cardInfo.expYear,
          is_default: false, // New payment methods are not default by default
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error saving payment method:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user's saved payment methods (only non-sensitive data)
  static async getPaymentMethods(userId) {
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return { success: false, error: error.message };
    }
  }

  // Set default payment method
  static async setDefaultPaymentMethod(userId, paymentMethodId) {
    try {
      // First, unset all other payment methods as default
      await supabase
        .from('user_payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Then set the selected one as default
      const { data, error } = await supabase
        .from('user_payment_methods')
        .update({ is_default: true })
        .eq('user_id', userId)
        .eq('stripe_payment_method_id', paymentMethodId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error setting default payment method:', error);
      return { success: false, error: error.message };
    }
  }

  // Remove payment method (only removes from our database, Stripe handles the actual deletion)
  static async removePaymentMethod(userId, paymentMethodId) {
    try {
      // This should be called from your backend API to also remove from Stripe
      const response = await fetch('/api/payments/remove-payment-method', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ userId, paymentMethodId })
      });

      if (!response.ok) throw new Error('Failed to remove payment method');

      // Remove from our database
      const { error } = await supabase
        .from('user_payment_methods')
        .delete()
        .eq('user_id', userId)
        .eq('stripe_payment_method_id', paymentMethodId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error removing payment method:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user's current subscription plan
  static async getCurrentPlan(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Return free plan if no subscription found
      if (!data) {
        return {
          success: true,
          data: {
            plan_name: 'Free',
            plan_type: 'free',
            status: 'active',
            current_period_end: null,
            cancel_at_period_end: false
          }
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error getting current plan:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper method to get auth token
  static async getAuthToken() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Validate card information (client-side validation only)
  static validateCardInfo(cardInfo) {
    const errors = [];

    if (!cardInfo.number || cardInfo.number.length < 13) {
      errors.push('Card number is invalid');
    }

    if (!cardInfo.expMonth || cardInfo.expMonth < 1 || cardInfo.expMonth > 12) {
      errors.push('Expiration month is invalid');
    }

    if (!cardInfo.expYear || cardInfo.expYear < new Date().getFullYear()) {
      errors.push('Expiration year is invalid');
    }

    if (!cardInfo.cvc || cardInfo.cvc.length < 3 || cardInfo.cvc.length > 4) {
      errors.push('CVC is invalid');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
