import { RealtimeChannel } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/classes';
import type { PrayerCity } from '@/interfaces/globalPrayerMap';
import { getPrayerMapCities } from '@/services/prayerMapApi';
import { getActiveGlobalPrayerSessions } from '@/services/prayerSessionsApi';

export const useGlobalPrayerMap = () => {
  // ── Prayer map data ──────────────────────────────────────────────────────
  const [prayerCities, setPrayerCities] = useState<PrayerCity[]>([]);
  const [mapLoading, setMapLoading] = useState(true);

  const refreshPrayerCities = useCallback(async () => {
    const cities = await getPrayerMapCities();
    setPrayerCities(cities);
    setMapLoading(false);
  }, []);

  useEffect(() => {
    void refreshPrayerCities();
  }, [refreshPrayerCities]);

  // ── Live prayer sessions ─────────────────────────────────────────────────
  const [activeOnlineUsers, setActiveOnlineUsers] = useState(0);

  const refreshSessions = useCallback(async () => {
    const result = await getActiveGlobalPrayerSessions();
    setActiveOnlineUsers(result.activeOnlineUsers);
  }, []);

  useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel('global-prayer-map-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'global_prayer_sessions' },
        () => void refreshSessions(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refreshSessions]);

  return { prayerCities, mapLoading, activeOnlineUsers };
};
