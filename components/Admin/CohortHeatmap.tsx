import { Box, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CohortDisplayRow {
  cohortWeek: string;
  usersInCohort: number;
  retentionByWeek: number[];
}

const Grid = styled(Box)({
  overflowX: 'auto',
});

const Cell = styled(Box)<{ intensity: number }>(({ theme, intensity }) => {
  const successRgb =
    theme.palette.mode === 'dark' ? '129,199,132' : '76,175,80';
  const alpha = Math.max(0.05, intensity);
  return {
    width: 56,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `rgba(${successRgb},${alpha})`,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    color:
      intensity > 0.5
        ? theme.palette.success.contrastText
        : theme.palette.text.primary,
  };
});

const HeaderCell = styled(Box)(({ theme }) => ({
  width: 56,
  textAlign: 'center',
  fontSize: 11,
  fontWeight: 600,
  color: theme.palette.text.secondary,
  flexShrink: 0,
}));

const RowLabel = styled(Box)(({ theme }) => ({
  minWidth: 80,
  fontSize: 12,
  fontWeight: 600,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
}));

interface CohortHeatmapProps {
  cohorts: CohortDisplayRow[];
  title?: string;
}

const CohortHeatmap = ({
  cohorts,
  title = 'Cohort Retention',
}: CohortHeatmapProps) => {
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
      <Grid>
        {/* header row */}
        <Box display="flex" gap={0.5} mb={0.5}>
          <RowLabel>Cohort</RowLabel>
          <HeaderCell sx={{ minWidth: 56 }}>Size</HeaderCell>
          {weekHeaders.map((w) => (
            <HeaderCell key={w}>{w}</HeaderCell>
          ))}
        </Box>

        {cohorts.map((row) => (
          <Box key={row.cohortWeek} display="flex" gap={0.5} mb={0.5}>
            <RowLabel>{row.cohortWeek}</RowLabel>
            <Box
              sx={{
                width: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
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
                <Cell intensity={pct}>{(pct * 100).toFixed(0)}%</Cell>
              </Tooltip>
            ))}
            {/* fill empty cells for shorter rows */}
            {Array.from({ length: maxWeeks - row.retentionByWeek.length }).map(
              (_, i) => (
                <Box key={`empty-${i}`} sx={{ width: 56, height: 36 }} />
              ),
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default CohortHeatmap;
