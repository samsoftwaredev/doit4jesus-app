import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { MapTooltipData } from '@/interfaces/globalPrayerMap';

import { MAP_COLORS } from './helpers/constants';

const TooltipBox = styled(Box)({
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 20,
  padding: '10px 14px',
  borderRadius: 10,
  background: MAP_COLORS.tooltipBg,
  border: `1px solid ${MAP_COLORS.tooltipBorder}`,
  backdropFilter: 'blur(8px)',
  maxWidth: 220,
  transition: 'opacity 0.15s ease, transform 0.15s ease',
});

interface Props {
  data: MapTooltipData | null;
  containerRect: DOMRect | null;
}

const MapTooltip = ({ data, containerRect }: Props) => {
  if (!data || !containerRect) return null;

  const left = data.x + 14;
  const top = data.y - 10;

  return (
    <TooltipBox sx={{ left, top, opacity: 1 }}>
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ color: MAP_COLORS.textPrimary, lineHeight: 1.3 }}
      >
        {data.name}
      </Typography>
      {data.countryName && (
        <Typography
          variant="caption"
          sx={{ color: MAP_COLORS.textSecondary, display: 'block', mb: 0.5 }}
        >
          {data.countryName}
        </Typography>
      )}
      <Stack spacing={0.3} mt={0.5}>
        <StatRow label="Prayers" value={data.prayerCount.toLocaleString()} />
        <StatRow label="Active" value={String(data.activeUsers)} />
        {data.liveSessions > 0 && (
          <StatRow
            label="Live sessions"
            value={String(data.liveSessions)}
            accent
          />
        )}
      </Stack>
    </TooltipBox>
  );
};

const StatRow = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <Stack direction="row" justifyContent="space-between" spacing={2}>
    <Typography
      variant="caption"
      sx={{ color: MAP_COLORS.textSecondary, fontSize: '0.7rem' }}
    >
      {label}
    </Typography>
    <Typography
      variant="caption"
      fontWeight={700}
      sx={{
        color: accent ? MAP_COLORS.successLight : MAP_COLORS.textPrimary,
        fontSize: '0.7rem',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

export default MapTooltip;
