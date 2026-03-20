import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Chip, Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { Alert, AlertSeverity } from '@/interfaces/kpi';

const SEVERITY_COLOR: Record<AlertSeverity, 'error' | 'warning' | 'info'> = {
  critical: 'error',
  warning: 'warning',
  info: 'info',
};

const SEVERITY_ICON: Record<AlertSeverity, React.ReactNode> = {
  critical: <ErrorOutlineIcon fontSize="small" />,
  warning: <WarningAmberIcon fontSize="small" />,
  info: <InfoOutlinedIcon fontSize="small" />,
};

const Item = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

interface AlertsListProps {
  alerts: Alert[];
  loading?: boolean;
}

const AlertsList = ({ alerts, loading }: AlertsListProps) => {
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" gap={1}>
        {[0, 1].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={56}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>
    );
  }

  if (alerts.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No active alerts — all metrics within thresholds.
      </Typography>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {alerts.map((alert) => (
        <Item key={alert.id}>
          {SEVERITY_ICON[alert.severity]}
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography variant="subtitle2" fontWeight={600}>
                {alert.title}
              </Typography>
              <Chip
                label={alert.severity}
                color={SEVERITY_COLOR[alert.severity]}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {alert.message}
            </Typography>
          </Box>
        </Item>
      ))}
    </Box>
  );
};

export default AlertsList;
