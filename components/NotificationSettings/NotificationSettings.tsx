import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useUserContext } from '@/context/UserContext';
import {
  NotificationSettings as NotificationSettingsType,
  getNotificationSettings,
  initializePushNotifications,
  saveNotificationSettings,
  showLocalNotification,
} from '@/utils/notifications';

import styles from './NotificationSettings.module.scss';

const NotificationSettings = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettingsType>({
    enabled: false,
    dailyReminderTime: '20:00',
    streakProtection: true,
    streakReminderHoursBefore: 2,
  });

  useEffect(() => {
    if (user?.userId) {
      loadSettings();
    }
  }, [user?.userId]);

  const loadSettings = async () => {
    if (!user?.userId) return;

    const savedSettings = await getNotificationSettings(user.userId);
    if (savedSettings) {
      setSettings(savedSettings);
    }
  };

  const handleEnableNotifications = async (enabled: boolean) => {
    if (!user?.userId) return;

    setLoading(true);
    try {
      if (enabled) {
        // Initialize push notifications
        const success = await initializePushNotifications(user.userId);
        if (!success) {
          toast.error('Failed to enable notifications. Please check your browser permissions.');
          setLoading(false);
          return;
        }

        // Show test notification
        showLocalNotification(
          'Notifications Enabled! 🎉',
          'You will now receive daily rosary reminders and streak protection alerts.',
          '/app/dashboard'
        );
      }

      const newSettings = { ...settings, enabled };
      const saved = await saveNotificationSettings(user.userId, newSettings);

      if (saved) {
        setSettings(newSettings);
        toast.success(enabled ? 'Notifications enabled!' : 'Notifications disabled');
      } else {
        toast.error('Failed to save notification settings');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.userId) return;

    setLoading(true);
    try {
      const saved = await saveNotificationSettings(user.userId, settings);
      if (saved) {
        toast.success('Notification settings saved!');
        
        // Show preview notification
        showLocalNotification(
          'Settings Updated! ✅',
          `Daily reminder: ${settings.dailyReminderTime}. Streak protection: ${settings.streakProtection ? 'ON' : 'OFF'}`,
          '/app/dashboard'
        );
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = () => {
    showLocalNotification(
      'Test Notification 🔔',
      'This is how your daily reminder will look!',
      '/app/dashboard'
    );
  };

  return (
    <Card className={styles.container}>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          🔔 Notification Settings
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Get reminders to pray your daily rosary and protect your prayer streak.
        </Typography>

        {/* Enable/Disable Toggle */}
        <Box mt={3} mb={3}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enabled}
                onChange={(e) => handleEnableNotifications(e.target.checked)}
                disabled={loading}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  Enable Push Notifications
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Receive daily reminders and streak alerts
                </Typography>
              </Box>
            }
          />
        </Box>

        {settings.enabled && (
          <>
            {/* Daily Reminder Time */}
            <Box mt={3}>
              <FormControl fullWidth>
                <InputLabel>Daily Reminder Time</InputLabel>
                <Select
                  value={settings.dailyReminderTime}
                  label="Daily Reminder Time"
                  onChange={(e) =>
                    setSettings({ ...settings, dailyReminderTime: e.target.value })
                  }
                  disabled={loading}
                >
                  <MenuItem value="06:00">6:00 AM</MenuItem>
                  <MenuItem value="07:00">7:00 AM</MenuItem>
                  <MenuItem value="08:00">8:00 AM</MenuItem>
                  <MenuItem value="09:00">9:00 AM</MenuItem>
                  <MenuItem value="12:00">12:00 PM (Noon)</MenuItem>
                  <MenuItem value="18:00">6:00 PM</MenuItem>
                  <MenuItem value="19:00">7:00 PM</MenuItem>
                  <MenuItem value="20:00">8:00 PM</MenuItem>
                  <MenuItem value="21:00">9:00 PM</MenuItem>
                  <MenuItem value="22:00">10:00 PM</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Streak Protection */}
            <Box mt={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.streakProtection}
                    onChange={(e) =>
                      setSettings({ ...settings, streakProtection: e.target.checked })
                    }
                    disabled={loading}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      Streak Protection 🔥
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Get reminded if you haven't prayed today
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {settings.streakProtection && (
              <Box mt={2} ml={5}>
                <FormControl fullWidth>
                  <InputLabel>Reminder Hours Before Midnight</InputLabel>
                  <Select
                    value={settings.streakReminderHoursBefore}
                    label="Reminder Hours Before Midnight"
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        streakReminderHoursBefore: e.target.value as number,
                      })
                    }
                    disabled={loading}
                  >
                    <MenuItem value={1}>1 hour before (11:00 PM)</MenuItem>
                    <MenuItem value={2}>2 hours before (10:00 PM)</MenuItem>
                    <MenuItem value={3}>3 hours before (9:00 PM)</MenuItem>
                    <MenuItem value={4}>4 hours before (8:00 PM)</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                  Only sends if you haven't prayed your rosary today
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box mt={4} display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveSettings}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleTestNotification}
                disabled={loading}
              >
                Test Notification
              </Button>
            </Box>
          </>
        )}

        {/* Browser Compatibility Notice */}
        {!('Notification' in window) && (
          <Box mt={3} p={2} bgcolor="warning.light" borderRadius={2}>
            <Typography variant="body2" color="warning.dark">
              ⚠️ Your browser doesn't support push notifications. Please use Chrome, Firefox,
              Safari, or Edge.
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default NotificationSettings;
