import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { supabase } from '@/classes/SupabaseDB';
import GlobalPrayerMap from '@/components/GlobalPrayerMap';
import { useLanguageContext } from '@/context/LanguageContext';
import { GlobalPrayerSessionsDB } from '@/interfaces/databaseTable';
import type { PrayerCity } from '@/interfaces/globalPrayerMap';
import { getPrayerCityOptions } from '@/services/prayerCityApi';
import {
  getPrayerMapCities,
  joinPrayerSession,
  startPrayerSession,
} from '@/services/prayerMapApi';
import { getActiveGlobalPrayerSessions } from '@/services/prayerSessionsApi';

const SectionGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,
});

const prayerTypes = [
  'Rosary',
  'Chaplet',
  'Divine Mercy',
  'Scripture Reflection',
];

const getCountryFlag = (countryCode?: string | null): string => {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  return countryCode
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
};

const GlobalPrayerMapSection = () => {
  const theme = useTheme();
  const { t } = useLanguageContext();

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
  const [sessions, setSessions] = useState<GlobalPrayerSessionsDB[]>([]);
  // Canonical city options from backend
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [selectedCityKey, setSelectedCityKey] = useState<string>('');
  // Fetch canonical city options for dropdown
  useEffect(() => {
    getPrayerCityOptions().then((opts) => {
      setCityOptions(opts);
      if (opts.length > 0) {
        setSelectedCityKey(`${opts[0].city}-${opts[0].countryCode}`);
      }
    });
  }, []);
  const [selectedPrayerType, setSelectedPrayerType] = useState(prayerTypes[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshSessions = useCallback(async () => {
    const data = await getActiveGlobalPrayerSessions();
    setSessions(data);
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

  const activeSessions = useMemo(
    () => sessions.filter((s) => s.is_active),
    [sessions],
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleJoinSession = async (sessionId: number) => {
    const updatedCount = await joinPrayerSession(sessionId);
    if (updatedCount === null) {
      toast.error(t.unableToJoinSession);
      return;
    }

    toast.success(t.joinedPrayerSession);
    void refreshSessions();
    void refreshPrayerCities();
  };

  const handleStartSession = async () => {
    const selectedCity = cityOptions.find(
      (city) => `${city.city}-${city.countryCode}` === selectedCityKey,
    );
    if (!selectedCity) return;

    setIsSubmitting(true);
    const sessionId = await startPrayerSession({
      city: selectedCity.city,
      countryCode: selectedCity.countryCode,
      countryName: selectedCity.countryName,
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      prayerType: selectedPrayerType,
    });
    setIsSubmitting(false);

    if (!sessionId) {
      toast.error(t.unableToStartSession);
      return;
    }

    toast.success(t.sessionLive);
    void refreshSessions();
    void refreshPrayerCities();
  };

  return (
    <Container className="container-box" maxWidth="md">
      <SectionGrid>
        {/* ── D3 Global Prayer Map ──────────────────────────────────────── */}
        <GlobalPrayerMap cities={mapLoading ? undefined : prayerCities} />

        {/* ── Start a session ───────────────────────────────────────────── */}
        <Card>
          <Box sx={{ p: 2 }}>
            <Typography fontWeight={700} mb={1.5}>
              {t.startLivePrayerSession}
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <FormControl fullWidth>
                <InputLabel id="global-prayer-city-label">{t.city}</InputLabel>
                <Select
                  labelId="global-prayer-city-label"
                  label={t.city}
                  value={selectedCityKey}
                  onChange={(event) => setSelectedCityKey(event.target.value)}
                >
                  {cityOptions.map((city) => (
                    <MenuItem
                      key={`${city.city}-${city.countryCode}`}
                      value={`${city.city}-${city.countryCode}`}
                    >
                      {getCountryFlag(city.countryCode)} {city.city},{' '}
                      {city.countryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="global-prayer-type-label">
                  {t.prayerType}
                </InputLabel>
                <Select
                  labelId="global-prayer-type-label"
                  label={t.prayerType}
                  value={selectedPrayerType}
                  onChange={(event) =>
                    setSelectedPrayerType(event.target.value)
                  }
                >
                  {prayerTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleStartSession}
                disabled={isSubmitting}
              >
                {isSubmitting ? t.starting : t.startPrayer}
              </Button>
            </Stack>
          </Box>
        </Card>

        {/* ── Active sessions ───────────────────────────────────────────── */}
        <Card>
          <Box sx={{ p: 2 }}>
            <Typography fontWeight={700} mb={1}>
              {t.sessionDetails}
            </Typography>
            {activeSessions.length > 0 ? (
              <Stack spacing={1.2}>
                {activeSessions.map((session) => (
                  <Box
                    key={session.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.text.primary, 0.14)}`,
                      background: alpha(theme.palette.primary.main, 0.05),
                    }}
                  >
                    <Typography fontWeight={700}>
                      {getCountryFlag(session.country_code)} {session.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.prayerTypeLabel} {session.prayer_type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {t.numberOfParticipants} {session.participants_count}
                    </Typography>
                    <Button
                      onClick={() => handleJoinSession(session.id)}
                      size="small"
                      variant="outlined"
                    >
                      {t.joinSession}
                    </Button>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">
                {t.noActiveSessionsYet}
              </Typography>
            )}
          </Box>
        </Card>
      </SectionGrid>
    </Container>
  );
};

export default GlobalPrayerMapSection;
