import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IosShareIcon from '@mui/icons-material/IosShare';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import BadgeShareCardPreview from '@/components/BadgeShareCardPreview';
import Dialog from '@/components/Dialog';
import { useLanguageContext } from '@/context/LanguageContext';
import { AchievementBadge } from '@/interfaces';
import { BadgeShareCardData } from '@/utils/badgeShareCardGenerator';

interface Props {
  badge: AchievementBadge | null;
  open: boolean;
  shareUrl: string;
  shareText: string;
  userName: string;
  onClose: () => void;
  onShare: (badge: AchievementBadge) => Promise<void>;
  onCopy: (badge: AchievementBadge) => Promise<void>;
}

const AchievementShareModal = ({
  badge,
  open,
  shareUrl,
  shareText,
  userName,
  onClose,
  onShare,
  onCopy,
}: Props) => {
  const theme = useTheme();
  const { t } = useLanguageContext();

  if (!badge) return null;

  const shareCardData: BadgeShareCardData = {
    appName: 'DoIt4Jesus',
    badgeName: badge.name,
    badgeDescription: badge.description,
    verseReference: badge.verseReference,
    verseText: badge.verseText,
    earnedAtLabel: badge.earnedAt
      ? `${t.achievementEarnedOn} ${new Date(badge.earnedAt).toLocaleDateString()}`
      : badge.requirementLabel,
    earnedByLabel: t.achievementEarnedBy,
    userName,
    shareEncouragementLabel: t.achievementShareEncouragement,
    shareMessage: badge.shareMessage,
    colors: {
      backgroundStart: theme.palette.background.default,
      backgroundMid: theme.palette.primary.dark,
      backgroundEnd: theme.palette.gold.dark,
      halo: alpha(theme.palette.gold.light, 0.82),
      shapeOverlay: alpha(
        theme.palette.common.white,
        theme.palette.mode === 'dark' ? 0.08 : 0.16,
      ),
      border: alpha(
        theme.palette.common.white,
        theme.palette.mode === 'dark' ? 0.22 : 0.32,
      ),
      accent: theme.palette.gold.light,
      title: theme.palette.common.white,
      body: alpha(theme.palette.common.white, 0.94),
      muted: alpha(theme.palette.common.white, 0.78),
      panel: alpha(theme.palette.background.default, 0.36),
      panelStrong: alpha(theme.palette.background.default, 0.78),
    },
  };

  return (
    <Dialog
      open={open}
      handleClose={onClose}
      modalTitle={
        badge.isEarned
          ? t.achievementShareModalTitle
          : t.achievementPreviewModalTitle
      }
      fullWidth
    >
      <Stack spacing={3}>
        <BadgeShareCardPreview data={shareCardData} />

        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            mb={1.5}
          >
            <Chip
              label={badge.isEarned ? t.achievementEarned : t.achievementLocked}
              sx={{
                bgcolor: badge.isEarned
                  ? alpha(theme.palette.success.main, 0.18)
                  : alpha(theme.palette.warning.main, 0.18),
                color: badge.isEarned
                  ? theme.palette.success.light
                  : theme.palette.warning.light,
              }}
            />
            <Chip
              label={badge.requirementLabel}
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.text.primary, 0.2) }}
            />
          </Stack>
          <Typography variant="h6" fontWeight={700} color="primary" mb={1}>
            {badge.name}
          </Typography>
          <Typography color="text.secondary" mb={2}>
            {badge.description}
          </Typography>
          <Typography
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            }}
          >
            {badge.verseText}
            {'\n'}
            <Box component="span" sx={{ color: theme.palette.gold.main }}>
              {badge.verseReference}
            </Box>
          </Typography>
        </Box>

        {badge.isEarned ? (
          <>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="contained"
                startIcon={<IosShareIcon />}
                onClick={() => onShare(badge)}
              >
                {t.achievementShareWithFriends}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={() => onCopy(badge)}
              >
                {t.achievementCopyLink}
              </Button>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                component="a"
                href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                variant="text"
                startIcon={<WhatsAppIcon />}
              >
                {t.achievementWhatsApp}
              </Button>
              <Button
                component="a"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                variant="text"
                startIcon={<XIcon />}
              >
                X
              </Button>
              <Button
                component="a"
                href={`mailto:?subject=${encodeURIComponent(`${t.achievementEmailSubjectPrefix} ${badge.name}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`}
                variant="text"
                startIcon={<SendIcon />}
              >
                {t.achievementEmail}
              </Button>
            </Stack>
          </>
        ) : (
          <Typography color="text.secondary">
            {t.achievementLockedPreviewDescription}
          </Typography>
        )}
      </Stack>
    </Dialog>
  );
};

export default AchievementShareModal;
