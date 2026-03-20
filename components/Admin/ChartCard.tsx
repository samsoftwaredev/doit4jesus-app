import {
  Box,
  Skeleton,
  type SxProps,
  type Theme,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { type ReactNode } from 'react';

const Wrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

interface ChartCardProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
  children: ReactNode;
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

const ChartCard = ({
  title,
  subtitle,
  loading,
  error,
  children,
  action,
  sx,
}: ChartCardProps) => (
  <Wrapper sx={sx}>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
    {loading ? (
      <Box>
        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 1 }} />
      </Box>
    ) : error ? (
      <Typography color="error" variant="body2">
        {error}
      </Typography>
    ) : (
      children
    )}
  </Wrapper>
);

export default ChartCard;
