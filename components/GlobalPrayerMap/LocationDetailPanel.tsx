import PlaceIcon from '@mui/icons-material/Place';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Box, Button, Chip, Stack, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { SelectedLocationDetail } from '@/interfaces/globalPrayerMap';

import { type MapColors, getMapColors } from './helpers/constants';

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
  const theme = useTheme();
  const colors = getMapColors(theme);

  if (!location) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: colors.bgPaper,
          border: `1px solid ${colors.divider}`,
          textAlign: 'center',
        }}
      >
        <PlaceIcon
          sx={{
            fontSize: 36,
            color: colors.successMain,
            opacity: 0.4,
            mb: 0.5,
          }}
        />
        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
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
        bgcolor: colors.bgPaper,
        border: `1px solid ${alpha(colors.successMain, 0.25)}`,
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ color: colors.textPrimary, mb: 0.5 }}
      >
        {location.name}
      </Typography>
      {location.countryName && (
        <Typography
          variant="caption"
          sx={{ color: colors.textSecondary, display: 'block', mb: 1 }}
        >
          {location.countryName}
        </Typography>
      )}

      <Stack spacing={0.8}>
        <DetailRow
          colors={colors}
          label={t.prayerMapTotalPrayers}
          value={location.prayerCount.toLocaleString()}
        />
        <DetailRow
          colors={colors}
          label={t.prayerMapActiveUsers}
          value={String(location.activeUsers)}
        />
        {location.activeUsers > 0 && (
          <Chip
            icon={<RadioButtonCheckedIcon sx={{ fontSize: 14 }} />}
            label={`${location.activeUsers} ${t.prayerMapActiveUsers}`}
            size="small"
            sx={{
              width: 'fit-content',
              bgcolor: alpha(colors.successMain, 0.15),
              color: colors.successLight,
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        )}
      </Stack>

      {onJoinSession && location.activeUsers > 0 && (
        <Button
          variant="contained"
          size="small"
          onClick={onJoinSession}
          sx={{
            mt: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: colors.successMain,
            '&:hover': { bgcolor: colors.successDark },
          }}
        >
          {t.joinSession ?? 'Join Session'}
        </Button>
      )}
    </Box>
  );
};

const DetailRow = ({
  colors,
  label,
  value,
}: {
  colors: MapColors;
  label: string;
  value: string;
}) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography
      variant="caption"
      sx={{ color: colors.textSecondary, fontSize: '0.75rem' }}
    >
      {label}
    </Typography>
    <Typography
      variant="caption"
      fontWeight={700}
      sx={{ color: colors.textPrimary, fontSize: '0.75rem' }}
    >
      {value}
    </Typography>
  </Stack>
);

export default LocationDetailPanel;
