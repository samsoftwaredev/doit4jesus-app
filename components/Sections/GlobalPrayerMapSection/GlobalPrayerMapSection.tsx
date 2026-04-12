import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/classes/SupabaseDB';
import GlobalPrayerMap from '@/components/GlobalPrayerMap';
import { GlobalPrayerSessionsDB } from '@/interfaces/databaseTable';
import type { PrayerCity } from '@/interfaces/globalPrayerMap';
import { getPrayerCityOptions } from '@/services/prayerCityApi';
import { getPrayerMapCities } from '@/services/prayerMapApi';
import { getActiveGlobalPrayerSessions } from '@/services/prayerSessionsApi';

const SectionGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,
});

const GlobalPrayerMapSection = () => {
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

  return (
    <Container className="container-box" maxWidth="md">
      <SectionGrid>
        {/* ── D3 Global Prayer Map ──────────────────────────────────────── */}
        <GlobalPrayerMap
          activeUsers={activeOnlineUsers}
          cities={mapLoading ? undefined : prayerCities}
        />
      </SectionGrid>
    </Container>
  );
};

export default GlobalPrayerMapSection;
