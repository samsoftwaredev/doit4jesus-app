import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import type { PrayerMapView } from '@/interfaces/globalPrayerMap';

import { getMapColors } from './helpers/constants';

interface Props {
  view: PrayerMapView;
  onChange: (view: PrayerMapView) => void;
  translations: Record<string, string>;
}

const MapControls = ({ view, onChange, translations: t }: Props) => {
  const theme = useTheme();
  const colors = getMapColors(theme);

  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={(_, v) => v && onChange(v as PrayerMapView)}
      size="small"
      sx={{
        '& .MuiToggleButton-root': {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.75rem',
          color: colors.textSecondary,
          borderColor: colors.divider,
          px: 1.5,
          py: 0.5,
          '&.Mui-selected': {
            bgcolor: alpha(colors.successMain, 0.18),
            color: colors.successLight,
            borderColor: alpha(colors.successMain, 0.4),
            '&:hover': {
              bgcolor: alpha(colors.successMain, 0.26),
            },
          },
        },
      }}
    >
      <ToggleButton value="city">
        <LocationCityIcon sx={{ fontSize: 16, mr: 0.5 }} />
        {t.prayerMapCityView ?? 'City'}
      </ToggleButton>
      <ToggleButton value="country">
        <PublicIcon sx={{ fontSize: 16, mr: 0.5 }} />
        {t.prayerMapCountryView ?? 'Country'}
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default MapControls;
