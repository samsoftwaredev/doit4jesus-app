import PublicIcon from '@mui/icons-material/Public';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  FormControl,
  InputLabel,
  LinearProgress,
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
import { GLOBAL_PRAYER_CITY_OPTIONS } from '@/constants';
import { useUserContext } from '@/context/UserContext';
import { GlobalPrayerSessionsDB } from '@/interfaces/databaseTable';
import {
  getActiveGlobalPrayerSessions,
  joinGlobalPrayerSession,
  startOrJoinGlobalPrayerSession,
} from '@/services';

const PrayerMapGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '10px',
});

const HeroPanel = styled(Box)(({ theme }) => ({
  borderRadius: 10,
  padding: theme.spacing(2.5),
  color: theme.palette.common.white,
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.dark,
    0.92,
  )}, ${alpha(theme.palette.primary.main, 0.88)} 55%, ${alpha(
    theme.palette.warning.main,
    0.82,
  )})`,
}));

const WorldMap = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 420,
  borderRadius: 14,
  overflow: 'hidden',
  background: `radial-gradient(circle at 30% 20%, ${alpha(
    theme.palette.info.light,
    0.16,
  )}, transparent 35%), radial-gradient(circle at 80% 70%, ${alpha(
    theme.palette.primary.light,
    0.2,
  )}, transparent 35%), linear-gradient(180deg, #031424 0%, #020912 100%)`,
  border: `1px solid ${alpha(theme.palette.primary.light, 0.26)}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: `repeating-linear-gradient(90deg, ${alpha(
      theme.palette.common.white,
      0.08,
    )} 0, ${alpha(theme.palette.common.white, 0.08)} 1px, transparent 1px, transparent 10%), repeating-linear-gradient(0deg, ${alpha(
      theme.palette.common.white,
      0.08,
    )} 0, ${alpha(theme.palette.common.white, 0.08)} 1px, transparent 1px, transparent 10%)`,
    opacity: 0.2,
    pointerEvents: 'none',
  },
  '@media (max-width: 768px)': {
    height: 320,
  },
}));

const ContinentGlow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: alpha(theme.palette.info.light, 0.22),
  filter: 'blur(18px)',
  pointerEvents: 'none',
}));

const MarkerButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'markerSize',
})<{ markerSize: number }>(({ theme, markerSize }) => ({
  minWidth: markerSize,
  width: markerSize,
  height: markerSize,
  borderRadius: '50%',
  padding: 0,
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  color: theme.palette.common.white,
  background: `radial-gradient(circle, ${alpha(
    theme.palette.warning.light,
    0.95,
  )} 0%, ${alpha(theme.palette.warning.main, 0.8)} 48%, ${alpha(
    theme.palette.primary.main,
    0.45,
  )} 100%)`,
  boxShadow: `0 0 20px ${alpha(theme.palette.warning.light, 0.7)}`,
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: -10,
    borderRadius: '50%',
    border: `1px solid ${alpha(theme.palette.warning.light, 0.7)}`,
    animation: 'pulsePrayerMarker 2.1s ease-out infinite',
  },
  '@keyframes pulsePrayerMarker': {
    '0%': {
      transform: 'scale(0.85)',
      opacity: 0.8,
    },
    '100%': {
      transform: 'scale(1.75)',
      opacity: 0,
    },
  },
}));

const prayerTypes = [
  'Rosary',
  'Chaplet',
  'Divine Mercy',
  'Scripture Reflection',
];

type SessionCluster = {
  id: string;
  latitude: number;
  longitude: number;
  participantsCount: number;
  sessions: GlobalPrayerSessionsDB[];
  cityLabel: string;
  prayerTypeLabel: string;
};

const getCountryFlag = (countryCode?: string | null): string => {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  return countryCode
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
};

const coordinateToPosition = (latitude: number, longitude: number) => ({
  top: `${((90 - latitude) / 180) * 100}%`,
  left: `${((longitude + 180) / 360) * 100}%`,
});

const clusterPrayerSessions = (
  sessions: GlobalPrayerSessionsDB[],
  clusterDegrees = 9,
): SessionCluster[] => {
  const bucket = new Map<string, SessionCluster>();

  sessions.forEach((session) => {
    const key = `${Math.round(session.latitude / clusterDegrees)}:${Math.round(
      session.longitude / clusterDegrees,
    )}`;
    const existing = bucket.get(key);

    if (!existing) {
      bucket.set(key, {
        id: key,
        latitude: session.latitude,
        longitude: session.longitude,
        participantsCount: session.participants_count,
        sessions: [session],
        cityLabel: session.city,
        prayerTypeLabel: session.prayer_type,
      });
      return;
    }

    const newParticipantCount =
      existing.participantsCount + session.participants_count;
    existing.latitude =
      (existing.latitude * existing.sessions.length + session.latitude) /
      (existing.sessions.length + 1);
    existing.longitude =
      (existing.longitude * existing.sessions.length + session.longitude) /
      (existing.sessions.length + 1);
    existing.participantsCount = newParticipantCount;
    existing.sessions.push(session);
    existing.cityLabel =
      existing.sessions.length > 1
        ? `${existing.sessions.length} cities`
        : existing.sessions[0].city;
    existing.prayerTypeLabel =
      existing.sessions.length > 1
        ? 'Mixed Prayers'
        : existing.sessions[0].prayer_type;
  });

  return Array.from(bucket.values()).sort(
    (a, b) => b.participantsCount - a.participantsCount,
  );
};

const GlobalPrayerMapSection = () => {
  const theme = useTheme();
  const { user } = useUserContext();
  const [sessions, setSessions] = useState<GlobalPrayerSessionsDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    null,
  );
  const [selectedCityKey, setSelectedCityKey] = useState(
    `${GLOBAL_PRAYER_CITY_OPTIONS[0].city}-${GLOBAL_PRAYER_CITY_OPTIONS[0].countryCode}`,
  );
  const [selectedPrayerType, setSelectedPrayerType] = useState(prayerTypes[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOnline = Boolean(user?.userId);

  const refreshSessions = useCallback(async () => {
    const data = await getActiveGlobalPrayerSessions();
    setSessions(data);
    setIsLoading(false);
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
        () => {
          void refreshSessions();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refreshSessions]);

  const clusters = useMemo(() => clusterPrayerSessions(sessions), [sessions]);

  const selectedCluster =
    clusters.find((cluster) => cluster.id === selectedClusterId) ?? clusters[0];

  const totalParticipants = useMemo(
    () =>
      sessions.reduce((sum, session) => sum + session.participants_count, 0),
    [sessions],
  );

  const totalSessions = sessions.length;

  const handleJoinSession = async (sessionId: number) => {
    const updatedCount = await joinGlobalPrayerSession(sessionId);
    if (updatedCount === null) {
      toast.error('Unable to join this prayer session right now.');
      return;
    }

    toast.success('You joined this global prayer session.');
    void refreshSessions();
  };

  const handleStartSession = async () => {
    const selectedCity = GLOBAL_PRAYER_CITY_OPTIONS.find(
      (city) => `${city.city}-${city.countryCode}` === selectedCityKey,
    );
    if (!selectedCity) return;

    setIsSubmitting(true);
    const sessionId = await startOrJoinGlobalPrayerSession({
      city: selectedCity.city,
      countryCode: selectedCity.countryCode,
      countryName: selectedCity.countryName,
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      prayerType: selectedPrayerType,
      createdBy: user?.userId,
    });
    setIsSubmitting(false);

    if (!sessionId) {
      toast.error('Unable to start a global prayer session.');
      return;
    }

    toast.success('Prayer session is now live on the global map.');
    void refreshSessions();
  };

  return (
    <Container className="container-box" maxWidth="md">
      <PrayerMapGrid>
        <Card>
          <HeroPanel>
            <Chip
              icon={<PublicIcon />}
              label="Global Prayer Map"
              sx={{
                mb: 1.5,
                bgcolor: alpha(theme.palette.common.white, 0.16),
                color: theme.palette.common.white,
              }}
            />
            <Typography variant="h4" fontWeight={700} mb={1}>
              Prayer is happening everywhere.
            </Typography>
            <Typography sx={{ color: alpha(theme.palette.common.white, 0.88) }}>
              Thousands of people are praying with you right now.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} mt={2}>
              <Chip
                icon={<RadioButtonCheckedIcon />}
                label={`${totalParticipants} people praying`}
                sx={{
                  bgcolor: alpha(theme.palette.warning.light, 0.3),
                  color: theme.palette.common.white,
                }}
              />
              <Chip
                icon={<PublicIcon />}
                label={`${totalSessions} active city sessions`}
                sx={{
                  bgcolor: alpha(theme.palette.info.light, 0.28),
                  color: theme.palette.common.white,
                }}
              />
            </Stack>
          </HeroPanel>
        </Card>

        <Card>
          <Box sx={{ p: 2 }}>
            <Typography fontWeight={700} mb={1}>
              Live Global Map
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Tap a glowing city marker to view and join live prayer sessions.
            </Typography>

            {isLoading ? (
              <LinearProgress />
            ) : (
              <WorldMap>
                <ContinentGlow
                  sx={{ width: 220, height: 110, top: '15%', left: '8%' }}
                />
                <ContinentGlow
                  sx={{ width: 180, height: 90, top: '48%', left: '24%' }}
                />
                <ContinentGlow
                  sx={{ width: 210, height: 110, top: '26%', left: '46%' }}
                />
                <ContinentGlow
                  sx={{ width: 160, height: 85, top: '40%', left: '68%' }}
                />
                <ContinentGlow
                  sx={{ width: 120, height: 70, top: '66%', left: '78%' }}
                />

                {clusters.map((cluster) => {
                  const pos = coordinateToPosition(
                    cluster.latitude,
                    cluster.longitude,
                  );
                  const markerSize = Math.min(
                    42,
                    Math.max(16, 14 + cluster.participantsCount / 4),
                  );

                  return (
                    <MarkerButton
                      key={cluster.id}
                      markerSize={isOnline ? markerSize : 14}
                      onClick={() => setSelectedClusterId(cluster.id)}
                      sx={{
                        top: pos.top,
                        left: pos.left,
                        zIndex: cluster.participantsCount,
                        '&::after': {
                          animationPlayState: isOnline ? 'running' : 'paused',
                        },
                      }}
                    >
                      <Typography fontSize={11} fontWeight={700}>
                        {cluster.sessions.length > 1
                          ? cluster.sessions.length
                          : ''}
                      </Typography>
                    </MarkerButton>
                  );
                })}
              </WorldMap>
            )}
          </Box>
        </Card>

        <Card>
          <Box sx={{ p: 2 }}>
            <Typography fontWeight={700} mb={1.5}>
              Start a Live Prayer Session
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <FormControl fullWidth>
                <InputLabel id="global-prayer-city-label">City</InputLabel>
                <Select
                  labelId="global-prayer-city-label"
                  label="City"
                  value={selectedCityKey}
                  onChange={(event) => setSelectedCityKey(event.target.value)}
                >
                  {GLOBAL_PRAYER_CITY_OPTIONS.map((city) => (
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
                  Prayer Type
                </InputLabel>
                <Select
                  labelId="global-prayer-type-label"
                  label="Prayer Type"
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
                {isSubmitting ? 'Starting...' : 'Start Prayer'}
              </Button>
            </Stack>
          </Box>
        </Card>

        <Card>
          <Box sx={{ p: 2 }}>
            <Typography fontWeight={700} mb={1}>
              Session Details
            </Typography>
            {selectedCluster ? (
              <Stack spacing={1.2}>
                <Typography color="text.secondary">
                  {selectedCluster.cityLabel} •{' '}
                  {selectedCluster.prayerTypeLabel}
                </Typography>
                {selectedCluster.sessions.map((session) => (
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
                      Prayer Type: {session.prayer_type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Live users connected: {session.participants_count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Number of participants: {session.participants_count}
                    </Typography>
                    <Button
                      onClick={() => handleJoinSession(session.id)}
                      size="small"
                      variant="outlined"
                    >
                      Join Session
                    </Button>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">
                No active prayer sessions yet. Start one above and light up the
                world map.
              </Typography>
            )}
          </Box>
        </Card>
      </PrayerMapGrid>
    </Container>
  );
};

export default GlobalPrayerMapSection;
