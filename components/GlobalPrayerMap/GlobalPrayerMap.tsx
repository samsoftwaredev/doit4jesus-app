import PublicIcon from '@mui/icons-material/Public';
import {
  Box,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLanguageContext } from '@/context/LanguageContext';
import { MOCK_PRAYER_CITIES } from '@/data/mockPrayerCities';
import type {
  MapTooltipData,
  PrayerCity,
  PrayerMapView,
  SelectedLocationDetail,
} from '@/interfaces/globalPrayerMap';

import LocationDetailPanel from './LocationDetailPanel';
import MapControls from './MapControls';
import MapSummaryCards from './MapSummaryCards';
import MapTooltip from './MapTooltip';
import { aggregateByCountry, computeSummary } from './helpers/aggregation';
import { MAP_COLORS } from './helpers/constants';

// Heavy SVG + D3 bundle – code-split with next/dynamic
const WorldMapSvg = dynamic(() => import('./WorldMapSvg'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: { xs: 260, md: 380 },
        borderRadius: 3.5,
        bgcolor: MAP_COLORS.water,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearProgress sx={{ width: '50%' }} />
    </Box>
  ),
});

// ── Styled containers ────────────────────────────────────────────────────────

const Root = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

const HeroPanel = styled(Box)({
  borderRadius: 14,
  padding: '20px 24px',
  color: MAP_COLORS.textPrimary,
  background: `linear-gradient(135deg, ${MAP_COLORS.bgDefault} 0%, ${MAP_COLORS.bgPaper} 55%, ${alpha(MAP_COLORS.successDark, 0.45)} 100%)`,
});

const MapSection = styled(Box)({
  position: 'relative',
});

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  /** Optional external city data (falls back to mock). */
  cities?: PrayerCity[];
}

const GlobalPrayerMap = ({ cities: externalCities }: Props) => {
  const { t } = useLanguageContext();
  const [view, setView] = useState<PrayerMapView>('city');
  const [tooltip, setTooltip] = useState<MapTooltipData | null>(null);
  const [selected, setSelected] = useState<SelectedLocationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState<PrayerCity[]>([]);

  // Load data (external or mock)
  useEffect(() => {
    if (externalCities) {
      setCities(externalCities);
      setIsLoading(false);
      return;
    }
    // Simulate a short load for the mock data
    const timer = setTimeout(() => {
      setCities(MOCK_PRAYER_CITIES);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [externalCities]);

  const countriesData = useMemo(() => aggregateByCountry(cities), [cities]);
  const summary = useMemo(
    () =>
      cities.length > 0
        ? computeSummary(cities)
        : {
            totalPrayers: 0,
            mostActiveCity: '—',
            mostActiveCountry: '—',
            totalLiveSessions: 0,
          },
    [cities],
  );

  const handleTooltip = useCallback(
    (data: MapTooltipData | null) => setTooltip(data),
    [],
  );
  const handleSelect = useCallback(
    (detail: SelectedLocationDetail | null) => setSelected(detail),
    [],
  );

  return (
    <Root>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroPanel>
        <Chip
          icon={<PublicIcon />}
          label={t.prayerMapTitle ?? 'Global Prayer Map'}
          sx={{
            mb: 1,
            bgcolor: alpha(MAP_COLORS.successMain, 0.16),
            color: MAP_COLORS.successLight,
            fontWeight: 700,
          }}
        />
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          {t.prayerMapHeading ?? 'Prayer is happening everywhere'}
        </Typography>
        <Typography sx={{ color: MAP_COLORS.textSecondary }}>
          {t.prayerMapSubheading ??
            'See prayer happening around the world in real time'}
        </Typography>
      </HeroPanel>

      {/* ── Summary cards ────────────────────────────────────────────────── */}
      {isLoading ? (
        <Stack direction="row" spacing={1}>
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={64}
              sx={{ flex: 1, borderRadius: 3 }}
            />
          ))}
        </Stack>
      ) : (
        <MapSummaryCards summary={summary} translations={t} />
      )}

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ color: MAP_COLORS.textPrimary }}
        >
          {view === 'city'
            ? (t.prayerMapCityView ?? 'City View')
            : (t.prayerMapCountryView ?? 'Country View')}
        </Typography>
        <MapControls view={view} onChange={setView} translations={t} />
      </Stack>

      {/* ── Map + detail ─────────────────────────────────────────────────── */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems="stretch"
      >
        <MapSection sx={{ flex: 1, minWidth: 0 }}>
          {isLoading ? (
            <Skeleton
              variant="rounded"
              height={380}
              sx={{ borderRadius: 3.5 }}
            />
          ) : (
            <>
              <WorldMapSvg
                cities={cities}
                countriesData={countriesData}
                view={view}
                onTooltip={handleTooltip}
                onSelect={handleSelect}
              />
              <MapTooltip data={tooltip} containerRect={null} />
            </>
          )}
        </MapSection>
      </Stack>

      <Stack>
        <Box sx={{ width: { xs: '100%', md: 260 }, flexShrink: 0 }}>
          <LocationDetailPanel location={selected} translations={t} />
        </Box>
      </Stack>
    </Root>
  );
};

export default GlobalPrayerMap;
