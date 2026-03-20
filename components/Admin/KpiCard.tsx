import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Wrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 150,
  height: '100%',
  transition: theme.transitions.create(['box-shadow', 'border-color'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
  },
}));

interface KpiCardProps {
  label: string;
  description?: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  unit?: string;
  loading?: boolean;
}

const KpiCard = ({
  label,
  description,
  value,
  change,
  changeLabel,
  unit,
  loading,
}: KpiCardProps) => {
  if (loading) {
    return (
      <Wrapper>
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={32} />
        <Skeleton width="80%" height={12} />
        <Skeleton width="50%" height={14} />
      </Wrapper>
    );
  }

  const isPositive = (change ?? 0) >= 0;

  return (
    <Wrapper>
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700} color="text.primary">
        {unit === '$' && '$'}
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit === '%' && '%'}
      </Typography>
      {description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ lineHeight: 1.3, opacity: 0.8 }}
        >
          {description}
        </Typography>
      )}
      {change !== undefined && (
        <Box display="flex" alignItems="center" gap={0.5}>
          {isPositive ? (
            <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
          )}
          <Typography
            variant="caption"
            color={isPositive ? 'success.main' : 'error.main'}
            fontWeight={600}
          >
            {isPositive ? '+' : ''}
            {change}%
          </Typography>
          {changeLabel && (
            <Typography variant="caption" color="text.secondary">
              {changeLabel}
            </Typography>
          )}
        </Box>
      )}
    </Wrapper>
  );
};

export default KpiCard;
