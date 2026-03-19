import PublicIcon from '@mui/icons-material/Public';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Box, Chip, Stack, Typography, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { PrayerMapSummary } from '@/interfaces/globalPrayerMap';

import { MAP_COLORS } from './helpers/constants';

const StatCard = styled(Box)({
  flex: 1,
  minWidth: 120,
  padding: '10px 14px',
  borderRadius: 12,
  background: MAP_COLORS.bgPaper,
  border: `1px solid ${MAP_COLORS.divider}`,
});

interface Props {
  summary: PrayerMapSummary;
  translations: Record<string, string>;
}

const MapSummaryCards = ({ summary, translations: t }: Props) => (
  <Stack
    direction="row"
    spacing={1}
    sx={{
      overflowX: 'auto',
      pb: 0.5,
      '&::-webkit-scrollbar': { display: 'none' },
    }}
  >
    <StatCard>
      <Chip
        icon={<PublicIcon sx={{ fontSize: 15 }} />}
        label={t.prayerMapTotalPrayers ?? 'Total Prayers'}
        size="small"
        sx={{
          mb: 0.5,
          bgcolor: alpha(MAP_COLORS.successMain, 0.15),
          color: MAP_COLORS.successLight,
          fontWeight: 600,
          fontSize: '0.65rem',
        }}
      />
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ color: MAP_COLORS.textPrimary }}
      >
        {summary.totalPrayers.toLocaleString()}
      </Typography>
    </StatCard>

    <StatCard>
      <Chip
        icon={<WhatshotIcon sx={{ fontSize: 15 }} />}
        label={t.prayerMapMostActiveCity ?? 'Most Active City'}
        size="small"
        sx={{
          mb: 0.5,
          bgcolor: alpha('#ff9800', 0.15),
          color: '#ffb74d',
          fontWeight: 600,
          fontSize: '0.65rem',
        }}
      />
      <Typography
        variant="body1"
        fontWeight={700}
        noWrap
        sx={{ color: MAP_COLORS.textPrimary }}
      >
        {summary.mostActiveCity}
      </Typography>
    </StatCard>

    <StatCard>
      <Chip
        icon={<TravelExploreIcon sx={{ fontSize: 15 }} />}
        label={t.prayerMapMostActiveCountry ?? 'Top Country'}
        size="small"
        sx={{
          mb: 0.5,
          bgcolor: alpha('#42a5f5', 0.15),
          color: '#90caf9',
          fontWeight: 600,
          fontSize: '0.65rem',
        }}
      />
      <Typography
        variant="body1"
        fontWeight={700}
        noWrap
        sx={{ color: MAP_COLORS.textPrimary }}
      >
        {summary.mostActiveCountry}
      </Typography>
    </StatCard>

    <StatCard>
      <Chip
        icon={<RadioButtonCheckedIcon sx={{ fontSize: 15 }} />}
        label={t.prayerMapLiveSessions ?? 'Live Sessions'}
        size="small"
        sx={{
          mb: 0.5,
          bgcolor: alpha('#ef5350', 0.15),
          color: '#ef9a9a',
          fontWeight: 600,
          fontSize: '0.65rem',
        }}
      />
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ color: MAP_COLORS.textPrimary }}
      >
        {summary.totalLiveSessions}
      </Typography>
    </StatCard>
  </Stack>
);

export default MapSummaryCards;
