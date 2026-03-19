import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Skeleton,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import type { DailyScripture, ReadingItem } from '@/interfaces/dailyScripture';
import {
  getDailyScripture,
  getScriptureCompletionToday,
  recordScriptureCompletion,
} from '@/services/dailyScripture';
import { awardXP } from '@/services/spiritualXp';

// ─── Styled helpers ─────────────────────────────────────────────────────────

const SeasonChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.7rem',
  height: 22,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.25)
      : alpha(theme.palette.primary.main, 0.12),
}));

const ReadingBlock = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const VerseText = styled(Typography)(({ theme }) => ({
  fontStyle: 'italic',
  lineHeight: 1.7,
  color: theme.palette.text.secondary,
  whiteSpace: 'pre-line',
}));

// ─── Component ──────────────────────────────────────────────────────────────

const DailyScriptureComponent = () => {
  const { lang, t } = useLanguageContext();
  const { user } = useUserContext();

  const [scripture, setScripture] = useState<DailyScripture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [awarding, setAwarding] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  // Fetch scripture + completion status on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(false);

      const data = await getDailyScripture(lang === 'es' ? 'es' : 'en');
      if (cancelled) return;

      if (!data) {
        setError(true);
        setLoading(false);
        return;
      }
      setScripture(data);

      // Check if already completed today
      if (user?.userId) {
        const existing = await getScriptureCompletionToday(
          user.userId,
          data.date,
        );
        if (!cancelled && existing) {
          setCompleted(true);
          setXpAwarded(true);
        }
      }
      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [lang, user?.userId]);

  // Mark as read + award XP
  const handleMarkAsRead = async () => {
    if (!user?.userId || !scripture || completed || awarding) return;
    setAwarding(true);

    await recordScriptureCompletion(user.userId, scripture.date);

    const result = await awardXP(
      user.userId,
      'scripture_reading',
      { date: scripture.date, liturgicalTitle: scripture.liturgicalTitle },
      { idempotencyKey: `scripture_reading:${scripture.date}` },
    );

    setCompleted(true);
    setXpAwarded(!result?.duplicate);
    setAwarding(false);
  };

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box p={2}>
        <Skeleton variant="text" width="60%" height={28} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
        <Skeleton
          variant="rectangular"
          height={80}
          sx={{ mt: 2, borderRadius: 1 }}
        />
      </Box>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (error || !scripture) {
    return (
      <Box p={2}>
        <Alert severity="warning" sx={{ mb: 1 }}>
          {t.dailyScriptureError ?? "Unable to load today's readings."}
        </Alert>
        <Button size="small" onClick={() => window.location.reload()}>
          {t.retry ?? 'Retry'}
        </Button>
      </Box>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <AutoStoriesIcon color="primary" fontSize="small" />
          <Typography fontWeight="bold">
            {t.dailyScripture ?? 'Daily Scripture'}
          </Typography>
        </Box>
        <SeasonChip label={scripture.season} size="small" />
      </Box>

      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        {scripture.liturgicalTitle}
      </Typography>

      {/* Featured verse */}
      {scripture.featuredVerse?.text && (
        <Box
          sx={(theme) => ({
            p: 1.5,
            mb: 2,
            borderRadius: 1,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.primary.main, 0.08)
                : alpha(theme.palette.primary.main, 0.05),
            borderLeft: `3px solid ${theme.palette.primary.main}`,
          })}
        >
          <VerseText variant="body2">
            &ldquo;{scripture.featuredVerse.text}&rdquo;
          </VerseText>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="right"
            mt={0.5}
          >
            — {scripture.featuredVerse.reference}
          </Typography>
        </Box>
      )}

      {/* Readings accordion */}
      {scripture.readings.map((reading: ReadingItem) => (
        <Accordion
          key={reading.type}
          disableGutters
          elevation={0}
          sx={{
            '&:before': { display: 'none' },
            backgroundColor: 'transparent',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {reading.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {reading.reference}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <ReadingBlock>
              <VerseText variant="body2">{reading.text}</VerseText>
            </ReadingBlock>
          </AccordionDetails>
        </Accordion>
      ))}

      <Divider sx={{ my: 1.5 }} />

      {/* Mark-as-read / completed */}
      <Box display="flex" alignItems="center" justifyContent="center">
        {completed ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="body2" color="success.main" fontWeight={600}>
              {t.scriptureCompleted ?? 'Completed'}
              {xpAwarded && ` · +5 XP`}
            </Typography>
          </Box>
        ) : (
          <Button
            variant="contained"
            size="small"
            startIcon={<AutoStoriesIcon />}
            onClick={handleMarkAsRead}
            disabled={awarding || !user?.userId}
          >
            {awarding
              ? (t.loading ?? 'Loading...')
              : (t.markAsRead ?? 'Mark as Read · +5 XP')}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DailyScriptureComponent;
