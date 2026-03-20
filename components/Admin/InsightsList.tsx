import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { Insight } from '@/interfaces/kpi';

const Item = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

interface InsightsListProps {
  insights: Insight[];
  loading?: boolean;
}

const InsightsList = ({ insights, loading }: InsightsListProps) => {
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" gap={1}>
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={48}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>
    );
  }

  if (insights.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No insights available yet.
      </Typography>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {insights.map((insight) => (
        <Item key={insight.id}>
          {insight.direction === 'up' ? (
            <TrendingUpIcon color="success" fontSize="small" />
          ) : (
            <TrendingDownIcon color="error" fontSize="small" />
          )}
          <Typography variant="body2">{insight.text}</Typography>
        </Item>
      ))}
    </Box>
  );
};

export default InsightsList;
