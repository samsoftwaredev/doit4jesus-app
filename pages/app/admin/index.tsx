import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Alert as MuiAlert,
  Typography,
  useTheme,
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { supabase } from '@/classes/SupabaseDB';
import { Loading } from '@/components';
import {
  AlertsList,
  ChartCard,
  CohortHeatmap,
  FilterBar,
  InsightsList,
  KpiCard,
} from '@/components/Admin';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import { AppLayout } from '@/components/Templates';
import { useUserContext } from '@/context/UserContext';
import type {
  AdminFilters,
  EngagementMetrics,
  KpiAlerts,
  KpiCohorts,
  KpiOverview,
  KpiTrends,
} from '@/interfaces';
import { downloadCsv } from '@/lib/admin/csvExport';

// ─── Helpers ────────────────────────────────────────────────────────────────

const daysFromPreset: Record<string, number> = {
  today: 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function apiFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(path, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `API ${res.status}`);
  }
  const json = await res.json();
  if (!json.ok) throw new Error(json.error ?? 'Unknown API error');
  return json.data as T;
}

// ─── Page ───────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useUserContext();

  const isDark = theme.palette.mode === 'dark';
  const textColor = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;
  const gridColor = theme.palette.divider;
  const bgPaper = theme.palette.background.paper;

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.success.main,
  ];

  const tooltipStyle = {
    backgroundColor: bgPaper,
    border: `1px solid ${gridColor}`,
    borderRadius: 8,
    color: textColor,
  };

  /* ── data state ─────────────────────────────────────────────────────────── */
  const [overview, setOverview] = useState<KpiOverview | null>(null);
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [trends, setTrends] = useState<KpiTrends | null>(null);
  const [cohorts, setCohorts] = useState<KpiCohorts | null>(null);
  const [alerts, setAlerts] = useState<KpiAlerts | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminFilters>({
    dateRange: '30d',
    platform: 'all',
    segment: 'all',
  });

  /* ── fetch ──────────────────────────────────────────────────────────────── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const days = daysFromPreset[filters.dateRange] ?? 30;

      const [ovRes, trRes, coRes, alRes] = await Promise.all([
        apiFetch<{ overview: KpiOverview; engagement: EngagementMetrics }>(
          '/api/admin/kpis/overview',
          token,
        ),
        apiFetch<KpiTrends>(`/api/admin/kpis/trends?days=${days}`, token),
        apiFetch<KpiCohorts>('/api/admin/kpis/cohorts?weeks=8', token),
        apiFetch<KpiAlerts>('/api/admin/kpis/alerts', token),
      ]);

      setOverview(ovRes.overview);
      setEngagement(ovRes.engagement);
      setTrends(trRes);
      setCohorts(coRes);
      setAlerts(alRes);
    } catch (err: any) {
      if (err?.message?.includes('401') || err?.message?.includes('403')) {
        router.push('/unauthorized');
        return;
      }
      setError(err.message ?? 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [filters.dateRange, router]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Client-side admin guard — redirect non-admins without flashing content
  useEffect(() => {
    if (user !== undefined && user?.role !== 'admin') {
      router.push('/app');
    }
  }, [user, router]);

  /* ── loading / error states ─────────────────────────────────────────────── */
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <MuiAlert severity="error" sx={{ mb: 2 }}>
          {error}
        </MuiAlert>
        <Button variant="contained" onClick={fetchAll}>
          Retry
        </Button>
      </Container>
    );
  }

  /* ── derived chart data ─────────────────────────────────────────────────── */
  const trendChartData =
    trends?.users.data.map((pt, i) => ({
      date: pt.date,
      Users: pt.value,
      Active: trends.activeUsers.data[i]?.value ?? 0,
      Signups: trends.signups.data[i]?.value ?? 0,
      Rosaries: trends.rosariesCompleted.data[i]?.value ?? 0,
      XP: trends.xpAwarded.data[i]?.value ?? 0,
    })) ?? [];

  const funnelData = engagement?.completionFunnel ?? [];
  const adoptionData = engagement?.featureAdoption ?? [];

  if (user === undefined || user?.role !== 'admin') {
    return (
      <AppLayout>
        <Loading />
      </AppLayout>
    );
  }

  /* ── render ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <Head>
        <title>Admin Dashboard — DoIt4Jesus</title>
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={3}
        >
          <Typography variant="h4" fontWeight={800}>
            Admin Dashboard
          </Typography>
          <FilterBar filters={filters} onChange={(f) => setFilters(f)} />
        </Box>

        {/* ─── KPI cards ────────────────────────── */}
        <Grid container spacing={2} mb={4}>
          {[
            {
              label: 'Total Users',
              description: 'All registered accounts to date',
              value: overview?.totalUsers,
              unit: undefined,
            },
            {
              label: 'DAU',
              description: 'Daily active users (last 24 h)',
              value: overview?.dau,
            },
            {
              label: 'WAU',
              description: 'Weekly active users (last 7 d)',
              value: overview?.wau,
            },
            {
              label: 'MAU',
              description: 'Monthly active users (last 30 d)',
              value: overview?.mau,
            },
            {
              label: 'Signups (7 d)',
              description: 'New registrations in the past week',
              value: overview?.newSignups?.last7d,
            },
            {
              label: 'Signups (30 d)',
              description: 'New registrations in the past month',
              value: overview?.newSignups?.last30d,
            },
            {
              label: 'Retention D1',
              description: 'Users active 1 day after signup',
              value: overview?.retention?.d1,
              unit: '%',
            },
            {
              label: 'Retention D7',
              description: 'Users active 7 days after signup',
              value: overview?.retention?.d7,
              unit: '%',
            },
            {
              label: 'Retention D30',
              description: 'Users active 30 days after signup',
              value: overview?.retention?.d30,
              unit: '%',
            },
            {
              label: 'Signup → Active',
              description: 'Signups that became active users',
              value: overview?.conversion?.signupToActive,
              unit: '%',
            },
            {
              label: 'Churn Rate',
              description: 'Users inactive for 30+ days',
              value: overview?.churnRate,
              unit: '%',
            },
            {
              label: 'Rosary Completion',
              description: 'Rosaries fully completed vs started',
              value: overview?.taskCompletionRate,
              unit: '%',
            },
          ].map((card) => (
            <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                label={card.label}
                description={card.description}
                value={card.value ?? '—'}
                unit={card.unit}
                loading={loading}
              />
            </Grid>
          ))}
        </Grid>

        {/* ─── Growth Trends ────────────────────── */}
        <ChartCard title="Growth Trends" loading={loading}>
          <Box display="flex" justifyContent="flex-end" mb={1}>
            <Button
              size="small"
              startIcon={<CloudDownloadIcon />}
              onClick={() => downloadCsv(trendChartData, 'growth-trends')}
            >
              CSV
            </Button>
          </Box>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={trendChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: textSecondary }}
                stroke={gridColor}
              />
              <YAxis
                tick={{ fontSize: 11, fill: textSecondary }}
                stroke={gridColor}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: textColor }} />
              {['Users', 'Active', 'Signups', 'Rosaries', 'XP'].map(
                (key, i) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={isDark ? 0.2 : 0.1}
                  />
                ),
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ─── Engagement — two charts side by side ─── */}
        <Grid container spacing={3} my={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard title="Completion Funnel" loading={loading}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey="step"
                    tick={{ fontSize: 11, fill: textSecondary }}
                    stroke={gridColor}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: textSecondary }}
                    stroke={gridColor}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="count"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard title="Feature Adoption" loading={loading}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={adoptionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: textSecondary }}
                    stroke={gridColor}
                  />
                  <YAxis
                    dataKey="feature"
                    type="category"
                    tick={{ fontSize: 11, fill: textSecondary }}
                    stroke={gridColor}
                    width={80}
                  />
                  <Tooltip
                    formatter={(v) => `${v}%`}
                    contentStyle={tooltipStyle}
                  />
                  <Bar
                    dataKey="adoptionPct"
                    fill={theme.palette.info.main}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* ─── Cohort Retention ──────────────────── */}
        <ChartCard title="Cohort Retention" loading={loading} sx={{ my: 3 }}>
          {cohorts && (
            <CohortHeatmap
              cohorts={cohorts.rows.map((r) => ({
                cohortWeek: r.cohort,
                usersInCohort: r.size,
                retentionByWeek: r.retention.map((v) => v / 100),
              }))}
              title=""
            />
          )}
        </ChartCard>

        {/* ─── Alerts & Insights ─────────────────── */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <AlertsList alerts={alerts?.alerts ?? []} />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <InsightsList insights={alerts?.insights ?? []} />
            )}
          </Grid>
        </Grid>

        {/* ─── Session Metrics ───────────────────── */}
        {engagement && !loading && (
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Engagement Metrics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg sessions / week:{' '}
              <strong>{engagement.avgSessionsPerWeek.toFixed(1)}</strong>{' '}
              &nbsp;|&nbsp; Avg session duration:{' '}
              <strong>
                {engagement.avgSessionDuration > 0
                  ? `${Math.round(engagement.avgSessionDuration / 60)} min`
                  : 'N/A'}
              </strong>
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

const AdminPage = () => {
  return (
    <AppWrapper>
      <AppLayout>
        <AdminDashboard />
      </AppLayout>
    </AppWrapper>
  );
};

export default AdminPage;
