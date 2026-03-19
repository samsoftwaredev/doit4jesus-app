import PlaceIcon from '@mui/icons-material/Place';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Box, Button, Chip, Stack, Typography, alpha } from '@mui/material';

import type { SelectedLocationDetail } from '@/interfaces/globalPrayerMap';

import { MAP_COLORS } from './helpers/constants';

interface Props {
  location: SelectedLocationDetail | null;
  translations: Record<string, string>;
  onJoinSession?: () => void;
}

const LocationDetailPanel = ({
  location,
  translations: t,
  onJoinSession,
}: Props) => {
  if (!location) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: MAP_COLORS.bgPaper,
          border: `1px solid ${MAP_COLORS.divider}`,
          textAlign: 'center',
        }}
      >
        <PlaceIcon
          sx={{
            fontSize: 36,
            color: MAP_COLORS.successMain,
            opacity: 0.4,
            mb: 0.5,
          }}
        />
        <Typography variant="body2" sx={{ color: MAP_COLORS.textSecondary }}>
          {t.prayerMapSelectLocation ?? 'Click a marker to view details'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: MAP_COLORS.bgPaper,
        border: `1px solid ${alpha(MAP_COLORS.successMain, 0.25)}`,
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ color: MAP_COLORS.textPrimary, mb: 0.5 }}
      >
        {location.name}
      </Typography>
      {location.countryName && (
        <Typography
          variant="caption"
          sx={{ color: MAP_COLORS.textSecondary, display: 'block', mb: 1 }}
        >
          {location.countryName}
        </Typography>
      )}

      <Stack spacing={0.8}>
        <DetailRow
          label={t.prayerMapTotalPrayers ?? 'Total Prayers'}
          value={location.prayerCount.toLocaleString()}
        />
        <DetailRow
          label={t.prayerMapActiveUsers ?? 'Active Users'}
          value={String(location.activeUsers)}
        />
        {location.liveSessions > 0 && (
          <Chip
            icon={<RadioButtonCheckedIcon sx={{ fontSize: 14 }} />}
            label={`${location.liveSessions} ${t.prayerMapLiveSessions ?? 'live sessions'}`}
            size="small"
            sx={{
              width: 'fit-content',
              bgcolor: alpha(MAP_COLORS.successMain, 0.15),
              color: MAP_COLORS.successLight,
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        )}
      </Stack>

      {onJoinSession && location.liveSessions > 0 && (
        <Button
          variant="contained"
          size="small"
          onClick={onJoinSession}
          sx={{
            mt: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: MAP_COLORS.successMain,
            '&:hover': { bgcolor: MAP_COLORS.successDark },
          }}
        >
          {t.joinSession ?? 'Join Session'}
        </Button>
      )}
    </Box>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography
      variant="caption"
      sx={{ color: MAP_COLORS.textSecondary, fontSize: '0.75rem' }}
    >
      {label}
    </Typography>
    <Typography
      variant="caption"
      fontWeight={700}
      sx={{ color: MAP_COLORS.textPrimary, fontSize: '0.75rem' }}
    >
      {value}
    </Typography>
  </Stack>
);

export default LocationDetailPanel;
