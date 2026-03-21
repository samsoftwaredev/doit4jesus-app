import PublicIcon from '@mui/icons-material/Public';
import {
  Box,
  Chip,
  Grid,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
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
import { getMapColors } from './helpers/constants';

// Heavy SVG + D3 bundle – code-split with next/dynamic
const WorldMapSvg = dynamic(() => import('./WorldMapSvg'), {
  ssr: false,
  loading: () => (
    <Box
      sx={(theme) => ({
        height: { xs: 260, md: 380 },
        borderRadius: 3.5,
        bgcolor: getMapColors(theme).water,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
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

const HeroPanel = styled(Box)(({ theme }) => {
  const colors = getMapColors(theme);
  return {
    borderRadius: 14,
    padding: '16px 16px',
    color: colors.textPrimary,
    background: `linear-gradient(135deg, ${colors.bgDefault} 0%, ${colors.bgPaper} 55%, ${alpha(colors.successDark, 0.45)} 100%)`,
    [theme.breakpoints.up('sm')]: {
      padding: '20px 24px',
    },
  };
});

const MapSection = styled(Box)({
  position: 'relative',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
});

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  /** Optional external city data (falls back to mock). */
  cities?: PrayerCity[];
}

const GlobalPrayerMap = ({ cities: externalCities }: Props) => {
  const { t } = useLanguageContext();
  const theme = useTheme();
  const colors = getMapColors(theme);
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
            bgcolor: alpha(colors.successMain, 0.16),
            color: colors.successLight,
            fontWeight: 700,
          }}
        />
        <Typography
          variant="h5"
          fontWeight={800}
          mb={0.5}
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          {t.prayerMapHeading ?? 'Prayer is happening everywhere'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.textSecondary,
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
          }}
        >
          {t.prayerMapSubheading ??
            'See prayer happening around the world in real time'}
        </Typography>
      </HeroPanel>

      {/* ── Summary cards ────────────────────────────────────────────────── */}
      {isLoading ? (
        <Grid container spacing={1}>
          {[...Array(4)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton
                variant="rounded"
                height={64}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <MapSummaryCards summary={summary} translations={t} />
      )}

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ color: colors.textPrimary }}
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

      <Box sx={{ width: '100%' }}>
        <LocationDetailPanel location={selected} translations={t} />
      </Box>
    </Root>
  );
};

export default GlobalPrayerMap;
