// Push Notification Utilities
import { supabase } from '@/classes';

export interface NotificationSettings {
  enabled: boolean;
  dailyReminderTime: string; // HH:MM format
  streakProtection: boolean;
  streakReminderHoursBefore: number;
}

/**
 * Request notification permission from browser
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.error('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }

  return Notification.permission;
};

/**
 * Register service worker for push notifications
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.error('Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully');
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

/**
 * Subscribe to push notifications
 */
export const subscribeToPushNotifications = async (
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
};

/**
 * Save push subscription to database
 */
export const savePushSubscription = async (
  userId: string,
  subscription: PushSubscription
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('push_subscriptions').upsert({
      user_id: userId,
      subscription: subscription.toJSON(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to save push subscription:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return false;
  }
};

/**
 * Save notification settings to database
 */
export const saveNotificationSettings = async (
  userId: string,
  settings: NotificationSettings
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('notification_settings').upsert({
      user_id: userId,
      enabled: settings.enabled,
      daily_reminder_time: settings.dailyReminderTime,
      streak_protection: settings.streakProtection,
      streak_reminder_hours_before: settings.streakReminderHoursBefore,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to save notification settings:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving notification settings:', error);
    return false;
  }
};

/**
 * Get notification settings from database
 */
export const getNotificationSettings = async (
  userId: string
): Promise<NotificationSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Failed to get notification settings:', error);
      return null;
    }

    return {
      enabled: data.enabled,
      dailyReminderTime: data.daily_reminder_time,
      streakProtection: data.streak_protection,
      streakReminderHoursBefore: data.streak_reminder_hours_before,
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return null;
  }
};

/**
 * Show local notification (for testing/immediate feedback)
 */
export const showLocalNotification = (title: string, body: string, url?: string) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const notification = new Notification(title, {
    body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: { url: url || '/app/dashboard' },
  });

  notification.onclick = () => {
    window.open(notification.data.url, '_blank');
    notification.close();
  };
};

/**
 * Calculate streak expiry time
 */
export const calculateStreakExpiry = (lastPrayerDate: string): Date => {
  const lastPrayer = new Date(lastPrayerDate);
  const expiry = new Date(lastPrayer);
  expiry.setHours(23, 59, 59, 999); // End of the next day
  expiry.setDate(expiry.getDate() + 1);
  return expiry;
};

/**
 * Check if user needs streak protection reminder
 */
export const needsStreakReminder = (
  lastPrayerDate: string,
  hoursBefore: number
): boolean => {
  const expiry = calculateStreakExpiry(lastPrayerDate);
  const reminderTime = new Date(expiry);
  reminderTime.setHours(reminderTime.getHours() - hoursBefore);
  
  const now = new Date();
  return now >= reminderTime && now < expiry;
};

/**
 * Initialize push notifications
 * Call this when user enables notifications
 */
export const initializePushNotifications = async (userId: string): Promise<boolean> => {
  try {
    // Request permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.error('Notification permission denied');
      return false;
    }

    // Register service worker
    const registration = await registerServiceWorker();
    if (!registration) {
      return false;
    }

    // Subscribe to push
    const subscription = await subscribeToPushNotifications(registration);
    if (!subscription) {
      return false;
    }

    // Save subscription to database
    const saved = await savePushSubscription(userId, subscription);
    if (!saved) {
      return false;
    }

    console.log('Push notifications initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
    return false;
  }
};
