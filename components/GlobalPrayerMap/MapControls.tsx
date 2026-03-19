import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { alpha } from '@mui/material/styles';

import type { PrayerMapView } from '@/interfaces/globalPrayerMap';

import { MAP_COLORS } from './helpers/constants';

interface Props {
  view: PrayerMapView;
  onChange: (view: PrayerMapView) => void;
  translations: Record<string, string>;
}

const MapControls = ({ view, onChange, translations: t }: Props) => (
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
        color: MAP_COLORS.textSecondary,
        borderColor: MAP_COLORS.divider,
        px: 1.5,
        py: 0.5,
        '&.Mui-selected': {
          bgcolor: alpha(MAP_COLORS.successMain, 0.18),
          color: MAP_COLORS.successLight,
          borderColor: alpha(MAP_COLORS.successMain, 0.4),
          '&:hover': {
            bgcolor: alpha(MAP_COLORS.successMain, 0.26),
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

export default MapControls;
