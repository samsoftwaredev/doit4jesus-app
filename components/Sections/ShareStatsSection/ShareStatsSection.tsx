import { Box, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { supabase } from '@/classes';
import Loading from '@/components/Loading';
import ShareCardPreview from '@/components/ShareCardPreview';
import SocialShareButtons from '@/components/SocialShareButtons';
import { COMPANY } from '@/constants/company';
import { getRandomMotivatingMessage } from '@/constants/milestones';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { getCurrentLevel } from '@/utils/levels';
import { type ShareCardData } from '@/utils/shareCardGenerator';

const ShareStatsSection = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          'get_rosary_streak',
          { body: { user_id: user?.userId } },
        );
        if (!error && data?.streak) {
          setStreak(data.streak);
        }
      } catch (error) {
        console.error('Error fetching streak for share card:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.userId) {
      fetchStreak();
    } else {
      setIsLoading(false);
    }
  }, [user?.userId]);

  if (isLoading) return <Loading />;

  const rosaryCount = user?.stats?.rosaryTotalCount ?? 0;
  const level = getCurrentLevel(rosaryCount);
  const siteUrl =
    typeof window !== 'undefined' ? window.location.origin : 'doit4jesus.com';

  const cardData: ShareCardData = {
    userName: user?.fullName ?? user?.firstName ?? t.prayerWarrior,
    rosariesPrayed: rosaryCount,
    prayerStreak: streak,
    levelName: level.label,
    motivatingMessage: getRandomMotivatingMessage(),
    siteUrl,
  };

  const shareUrl = `${siteUrl}/share/${user?.userId ?? ''}`;
  const shareText = `${cardData.userName} prayed ${rosaryCount} Rosaries. Join the battle at ${COMPANY.nameAbbr}!`;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        color="secondary.main"
        sx={{ mb: 1 }}
      >
        {t.yourPrayerStats}
      </Typography>
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        {t.shareYourAchievements}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <ShareCardPreview data={cardData} />
      </Box>

      <SocialShareButtons
        shareUrl={shareUrl}
        shareText={shareText}
        cardData={cardData}
      />
    </Container>
  );
};

export default ShareStatsSection;
