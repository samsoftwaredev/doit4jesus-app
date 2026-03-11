# Database Migrations for Push Notifications

## Required Tables

### 1. `push_subscriptions` table

```sql
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index for faster lookups
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- RLS Policies
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON push_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. `notification_settings` table

```sql
CREATE TABLE notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT false,
  daily_reminder_time TIME NOT NULL DEFAULT '20:00:00',
  streak_protection BOOLEAN DEFAULT true,
  streak_reminder_hours_before INTEGER DEFAULT 2 CHECK (streak_reminder_hours_before >= 1 AND streak_reminder_hours_before <= 12),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index for faster lookups
CREATE INDEX idx_notification_settings_user_id ON notification_settings(user_id);
CREATE INDEX idx_notification_settings_enabled ON notification_settings(enabled) WHERE enabled = true;

-- RLS Policies
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification settings"
  ON notification_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification settings"
  ON notification_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification settings"
  ON notification_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notification settings"
  ON notification_settings FOR DELETE
  USING (auth.uid() = user_id);
```

## Environment Variables

Add to `.env.local`:

```env
# Web Push VAPID Keys
# Generate with: npx web-push generate-vapid-keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_SUBJECT=mailto:your-email@example.com
```

## How to Run Migrations

### Option 1: Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Copy and paste the SQL above
5. Run each CREATE TABLE statement

### Option 2: Supabase CLI

```bash
# Create migration file
supabase migration new add_push_notifications

# Add the SQL above to the generated file
# Then run:
supabase db push
```

## Testing

After running migrations, test with:

```sql
-- Check tables were created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('push_subscriptions', 'notification_settings');

-- Test insert (replace with your user_id)
INSERT INTO notification_settings (user_id, enabled, daily_reminder_time)
VALUES ('your-user-id-here', true, '20:00:00');
```
