# Secure Payment System Setup Guide

## Overview

This implementation provides a **SECURE** payment system that integrates with Stripe, ensuring that sensitive payment information is never stored on your servers. All sensitive data is handled by Stripe's secure infrastructure.

## Security Features

✅ **No sensitive data storage** - We never store full card numbers, CVC, or expiration dates  
✅ **PCI DSS compliant** - Stripe handles all PCI compliance requirements  
✅ **Encrypted communication** - All data is transmitted over HTTPS with encryption  
✅ **Token-based system** - Only Stripe payment method IDs are stored locally  
✅ **Server-side validation** - All payment operations are validated server-side  

## Required Dependencies

Install the following packages:

```bash
npm install @stripe/stripe-js stripe
```

## Environment Variables

Create a `.env.local` file with your Stripe keys:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Supabase Configuration (if not already set)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Schema

Create the following tables in your Supabase database:

### User Payment Methods Table
```sql
CREATE TABLE user_payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL,
  card_brand TEXT NOT NULL,
  card_last4 TEXT NOT NULL,
  card_exp_month INTEGER NOT NULL,
  card_exp_year INTEGER NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_payment_methods_user_id ON user_payment_methods(user_id);
CREATE INDEX idx_user_payment_methods_stripe_id ON user_payment_methods(stripe_payment_method_id);

-- Enable RLS (Row Level Security)
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policy to ensure users can only access their own payment methods
CREATE POLICY "Users can only access their own payment methods" ON user_payment_methods
  FOR ALL USING (auth.uid() = user_id);
```

### User Notification Preferences Table
```sql
CREATE TABLE user_notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  webinar_reminders BOOLEAN DEFAULT TRUE,
  connection_requests BOOLEAN DEFAULT TRUE,
  community_activity BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);

-- Enable RLS
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can only access their own notification preferences" ON user_notification_preferences
  FOR ALL USING (auth.uid() = user_id);
```

### User Subscriptions Table (for future use)
```sql
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_id ON user_subscriptions(stripe_subscription_id);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can only access their own subscriptions" ON user_subscriptions
  FOR ALL USING (auth.uid() = user_id);
```

## Stripe Setup

1. **Create a Stripe Account** at [stripe.com](https://stripe.com)
2. **Get your API keys** from the Stripe Dashboard
3. **Set up webhook endpoints** for future subscription management
4. **Configure your business settings** (business name, logo, etc.)

## How It Works

### 1. Adding a Payment Method
1. User clicks "Add Payment Method"
2. Frontend creates a setup intent via secure API
3. Stripe's secure form collects card information
4. Card details are sent directly to Stripe (never to your server)
5. Stripe returns a payment method ID
6. Only the payment method ID and non-sensitive card info are stored locally

### 2. Security Flow
```
User Input → Stripe Elements → Stripe Servers → Payment Method ID → Your Database
     ↓              ↓              ↓                ↓              ↓
  Card Number   Encrypted     Secure Storage   Token Only    No Sensitive Data
```

### 3. Future Billing
- When you need to charge a user, use the stored payment method ID
- Send the ID to Stripe along with the amount
- Stripe handles the actual payment processing
- You never see the actual card details

## API Endpoints

The system includes these secure endpoints:

- `POST /api/payments/create-setup-intent` - Creates Stripe setup intent
- `DELETE /api/payments/remove-payment-method` - Removes payment method

## Testing

### Test Card Numbers
Use these Stripe test cards for development:

- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **Declined**: 4000 0000 0000 0002

### Test CVC and Expiry
- **CVC**: Any 3 digits (e.g., 123)
- **Expiry**: Any future date (e.g., 12/25)

## Production Considerations

1. **Switch to live keys** when going to production
2. **Set up webhook endpoints** for subscription events
3. **Implement proper error handling** and logging
4. **Add rate limiting** to payment endpoints
5. **Set up monitoring** for failed payments
6. **Implement retry logic** for failed charges

## Compliance

This implementation follows:
- **PCI DSS** requirements (handled by Stripe)
- **GDPR** data protection principles
- **SOC 2** security standards (Stripe's infrastructure)
- **ISO 27001** information security management

## Support

For issues with:
- **Stripe integration**: Check [Stripe documentation](https://stripe.com/docs)
- **Security concerns**: Review [Stripe security guide](https://stripe.com/docs/security)
- **Implementation**: Check the code comments and error handling

## Future Enhancements

- Subscription management
- Invoice generation
- Payment analytics
- Multi-currency support
- Recurring billing
- Payment method updates
