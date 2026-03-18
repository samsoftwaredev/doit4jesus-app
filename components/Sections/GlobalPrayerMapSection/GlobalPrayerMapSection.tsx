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
import dynamic from 'next/dynamic';
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

const GoogleMapReact = dynamic(() => import('google-map-react'), {
  ssr: false,
});

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

const MapContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 420,
  borderRadius: 14,
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.primary.light, 0.26)}`,
  background: theme.palette.background.default,
  '@media (max-width: 768px)': {
    height: 320,
  },
}));

const MapMarkerButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'markerSize',
})<{ markerSize: number }>(({ theme, markerSize }) => ({
  minWidth: markerSize,
  width: markerSize,
  height: markerSize,
  borderRadius: '50%',
  padding: 0,
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

const MapMarker = ({
  markerSize,
  isOnline,
  clusterSize,
  onClick,
}: {
  lat: number;
  lng: number;
  markerSize: number;
  isOnline: boolean;
  clusterSize: number;
  onClick: () => void;
}) => (
  <MapMarkerButton
    markerSize={isOnline ? markerSize : 14}
    onClick={onClick}
    sx={{
      '&::after': {
        animationPlayState: isOnline ? 'running' : 'paused',
      },
    }}
  >
    <Typography fontSize={11} fontWeight={700}>
      {clusterSize > 1 ? clusterSize : ''}
    </Typography>
  </MapMarkerButton>
);

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
  const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapDefaultCenter = { lat: 18, lng: 10 };
  const mapDefaultZoom = 1;

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
              <MapContainer>
                <GoogleMapReact
                  bootstrapURLKeys={mapApiKey ? { key: mapApiKey } : undefined}
                  defaultCenter={mapDefaultCenter}
                  defaultZoom={mapDefaultZoom}
                  options={{
                    fullscreenControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    zoomControl: true,
                    minZoom: 1,
                    maxZoom: 7,
                    gestureHandling: 'greedy',
                    styles:
                      theme.palette.mode === 'dark'
                        ? [
                            {
                              elementType: 'geometry',
                              stylers: [{ color: '#0b1326' }],
                            },
                            {
                              elementType: 'labels.text.fill',
                              stylers: [{ color: '#8ea3c2' }],
                            },
                            {
                              elementType: 'labels.text.stroke',
                              stylers: [{ color: '#08101f' }],
                            },
                            {
                              featureType: 'administrative',
                              elementType: 'geometry.stroke',
                              stylers: [{ color: '#1d2b47' }],
                            },
                            {
                              featureType: 'poi',
                              stylers: [{ visibility: 'off' }],
                            },
                            {
                              featureType: 'road',
                              stylers: [{ visibility: 'off' }],
                            },
                            {
                              featureType: 'transit',
                              stylers: [{ visibility: 'off' }],
                            },
                            {
                              featureType: 'water',
                              elementType: 'geometry',
                              stylers: [{ color: '#030b18' }],
                            },
                          ]
                        : [],
                  }}
                >
                  {clusters.map((cluster) => {
                    const markerSize = Math.min(
                      42,
                      Math.max(16, 14 + cluster.participantsCount / 4),
                    );

                    return (
                      <MapMarker
                        key={cluster.id}
                        lat={cluster.latitude}
                        lng={cluster.longitude}
                        markerSize={markerSize}
                        isOnline={isOnline}
                        clusterSize={cluster.sessions.length}
                        onClick={() => setSelectedClusterId(cluster.id)}
                      />
                    );
                  })}
                </GoogleMapReact>
              </MapContainer>
            )}
            {!mapApiKey && (
              <Typography color="warning.main" mt={1} variant="caption">
                Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable full map
                loading.
              </Typography>
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
