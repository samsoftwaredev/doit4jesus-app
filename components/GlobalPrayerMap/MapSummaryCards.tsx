import PublicIcon from '@mui/icons-material/Public';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Box, Chip, Grid, Typography, alpha } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import type { PrayerMapSummary } from '@/interfaces/globalPrayerMap';

import { getMapColors } from './helpers/constants';

const StatCard = styled(Box)(({ theme }) => {
  const colors = getMapColors(theme);
  return {
    padding: '10px 14px',
    borderRadius: 12,
    background: colors.bgPaper,
    border: `1px solid ${colors.divider}`,
    height: '100%',
  };
});

interface Props {
  summary: PrayerMapSummary;
  translations: Record<string, string>;
}

const MapSummaryCards = ({ summary, translations: t }: Props) => {
  const theme = useTheme();
  const colors = getMapColors(theme);

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard>
          <Chip
            icon={<PublicIcon sx={{ fontSize: 15 }} />}
            label={t.prayerMapTotalPrayers}
            size="small"
            sx={{
              mb: 0.5,
              bgcolor: alpha(colors.successMain, 0.15),
              color: colors.successLight,
              fontWeight: 600,
              fontSize: '0.65rem',
            }}
          />
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ color: colors.textPrimary }}
          >
            {summary.totalPrayers.toLocaleString()}
          </Typography>
        </StatCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            sx={{ color: colors.textPrimary }}
          >
            {summary.mostActiveCity}
          </Typography>
        </StatCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            sx={{ color: colors.textPrimary }}
          >
            {summary.mostActiveCountry}
          </Typography>
        </StatCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            sx={{ color: colors.textPrimary }}
          >
            {summary.totalLiveSessions}
          </Typography>
        </StatCard>
      </Grid>
    </Grid>
  );
};

export default MapSummaryCards;
