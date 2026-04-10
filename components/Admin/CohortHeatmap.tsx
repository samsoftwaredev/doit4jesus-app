import {
  Box,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface CohortDisplayRow {
  cohortWeek: string;
  usersInCohort: number;
  retentionByWeek: number[];
}

const Grid = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'thin',
  paddingBottom: theme.spacing(1),
}));

const Cell = styled(Box)<{ intensity: number; compact?: boolean }>(({
  theme,
  intensity,
  compact,
}) => {
  const successRgb =
    theme.palette.mode === 'dark' ? '129,199,132' : '76,175,80';
  const alpha = Math.max(0.05, intensity);
  return {
    width: compact ? 40 : 56,
    minWidth: compact ? 40 : 56,
    height: compact ? 28 : 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `rgba(${successRgb},${alpha})`,
    borderRadius: 4,
    fontSize: compact ? 10 : 12,
    fontWeight: 600,
    color:
      intensity > 0.5
        ? theme.palette.success.contrastText
        : theme.palette.text.primary,
  };
});

const HeaderCell = styled(Box)<{ compact?: boolean }>(({ theme, compact }) => ({
  width: compact ? 40 : 56,
  minWidth: compact ? 40 : 56,
  textAlign: 'center',
  fontSize: compact ? 9 : 11,
  fontWeight: 600,
  color: theme.palette.text.secondary,
  flexShrink: 0,
}));

const RowLabel = styled(Box)<{ compact?: boolean }>(({ theme, compact }) => ({
  minWidth: compact ? 60 : 80,
  fontSize: compact ? 10 : 12,
  fontWeight: 600,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  position: 'sticky',
  left: 0,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
}));

interface CohortHeatmapProps {
  cohorts: CohortDisplayRow[];
  title?: string;
}

const CohortHeatmap = ({
  cohorts,
  title = 'Cohort Retention',
}: CohortHeatmapProps) => {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const compact = isPhone || isTablet;

  if (!cohorts.length) {
    return (
      <Box p={2}>
        <Typography variant="body2" color="text.secondary">
          No cohort data available.
        </Typography>
      </Box>
    );
  }

  const maxWeeks = Math.max(...cohorts.map((c) => c.retentionByWeek.length));
  const weekHeaders = Array.from({ length: maxWeeks }, (_, i) => `W${i}`);

  return (
    <Box>
      {title && (
        <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
          {title}
        </Typography>
      )}
      {compact && (
        <Typography
          variant="caption"
          color="text.secondary"
          mb={0.5}
          display="block"
        >
          Scroll horizontally to see all weeks →
        </Typography>
      )}
      <Grid>
        {/* header row */}
        <Box display="flex" gap={0.5} mb={0.5} sx={{ width: 'max-content' }}>
          <RowLabel compact={compact}>Cohort</RowLabel>
          <HeaderCell compact={compact} sx={{ minWidth: compact ? 40 : 56 }}>
            Size
          </HeaderCell>
          {weekHeaders.map((w) => (
            <HeaderCell compact={compact} key={w}>
              {w}
            </HeaderCell>
          ))}
        </Box>

        {cohorts.map((row) => (
          <Box
            key={row.cohortWeek}
            display="flex"
            gap={0.5}
            mb={0.5}
            sx={{ width: 'max-content' }}
          >
            <RowLabel compact={compact}>{row.cohortWeek}</RowLabel>
            <Box
              sx={{
                width: compact ? 40 : 56,
                minWidth: compact ? 40 : 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: compact ? 10 : 12,
                color: 'text.primary',
              }}
            >
              {row.usersInCohort}
            </Box>
            {row.retentionByWeek.map((pct, i) => (
              <Tooltip
                key={i}
                title={`${(pct * 100).toFixed(1)}% retained`}
                arrow
              >
                <Cell compact={compact} intensity={pct}>
                  {(pct * 100).toFixed(0)}%
                </Cell>
              </Tooltip>
            ))}
            {/* fill empty cells for shorter rows */}
            {Array.from({ length: maxWeeks - row.retentionByWeek.length }).map(
              (_, i) => (
                <Box
                  key={`empty-${i}`}
                  sx={{
                    width: compact ? 40 : 56,
                    height: compact ? 28 : 36,
                  }}
                />
              ),
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default CohortHeatmap;
