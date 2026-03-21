import { Box, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import type { MapTooltipData } from '@/interfaces/globalPrayerMap';

import { getMapColors } from './helpers/constants';

const TooltipBox = styled(Box)(({ theme }) => {
  const colors = getMapColors(theme);
  return {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 20,
    padding: '8px 12px',
    borderRadius: 10,
    background: colors.tooltipBg,
    border: `1px solid ${colors.tooltipBorder}`,
    backdropFilter: 'blur(8px)',
    maxWidth: 200,
    transition: 'opacity 0.15s ease, transform 0.15s ease',
  };
});

interface Props {
  data: MapTooltipData | null;
  containerRect: DOMRect | null;
}

const MapTooltip = ({ data, containerRect }: Props) => {
  const theme = useTheme();
  const colors = getMapColors(theme);

  if (!data || !containerRect) return null;

  // Keep tooltip within bounds on small screens
  const left = Math.min(data.x + 14, (containerRect.width ?? 300) - 210);
  const top = data.y - 10;

  return (
    <TooltipBox sx={{ left: Math.max(0, left), top, opacity: 1 }}>
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ color: colors.textPrimary, lineHeight: 1.3 }}
      >
        {data.name}
      </Typography>
      {data.countryName && (
        <Typography
          variant="caption"
          sx={{ color: colors.textSecondary, display: 'block', mb: 0.5 }}
        >
          {data.countryName}
        </Typography>
      )}
      <Stack spacing={0.3} mt={0.5}>
        <StatRow
          label="Prayers"
          value={data.prayerCount.toLocaleString()}
          textSecondary={colors.textSecondary}
          textPrimary={colors.textPrimary}
        />
        <StatRow
          label="Active"
          value={String(data.activeUsers)}
          textSecondary={colors.textSecondary}
          textPrimary={colors.textPrimary}
        />
        {data.liveSessions > 0 && (
          <StatRow
            label="Live sessions"
            value={String(data.liveSessions)}
            textSecondary={colors.textSecondary}
            textPrimary={colors.successLight}
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
  textSecondary,
  textPrimary,
}: {
  label: string;
  value: string;
  accent?: boolean;
  textSecondary: string;
  textPrimary: string;
}) => (
  <Stack direction="row" justifyContent="space-between" spacing={2}>
    <Typography
      variant="caption"
      sx={{ color: textSecondary, fontSize: '0.7rem' }}
    >
      {label}
    </Typography>
    <Typography
      variant="caption"
      fontWeight={700}
      sx={{
        color: textPrimary,
        fontSize: '0.7rem',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

export default MapTooltip;
