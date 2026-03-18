import { Box, Button, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Rosary } from '@/classes/Rosary';
import { db } from '@/classes/SupabaseDB';
import { ROSARY_DAYS } from '@/constants/mysteries';
import { NAV_APP_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { LANG } from '@/interfaces/index';
import { capitalizeFirstLetter } from '@/utils/helpers';

import Loading from '../Loading';

const BgBox = styled(Box)({
  borderRadius: '10px',
  filter: 'blur(8px)',
  height: '370px',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
});

const ContentBox = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  gap: '1em',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.black, 0.5)
      : alpha(theme.palette.common.black, 0.35),
  zIndex: 2,
  padding: '20px',
  textAlign: 'center',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column-reverse',
  '@media (min-width: 768px)': {
    flexDirection: 'row',
  },
}));

const RosaryImage = styled(Image)({
  width: '100%',
  height: 'auto',
  maxHeight: '200px',
  borderRadius: '10px',
});

const TodayRosary = () => {
  const { lang, t } = useLanguageContext();
  const [eventURL, setEventURL] = useState('');
  const navigate = useRouter();
  const rosary = new Rosary();
  const todayMystery = rosary.getRosaryState(lang).mystery;
  const [image, setImage] = useState<string>();
  const weekDayNum = dayjs().day();
  const weekDayName = Object.keys(ROSARY_DAYS)[weekDayNum];
  const weekDay = capitalizeFirstLetter(t[weekDayName as keyof typeof t]);

  const getYoutubeVideo = async (language: LANG) => {
    try {
      const rosaryId = rosary.getRosaryState(language).mysteryAudio;
      let { data, error } = await db
        .getYouTubeVideo()
        .select('*')
        .eq('video_id', rosaryId);
      if (error)
        console.error('Error in TodaysRosary (getYoutubeVideo):', error);
      if (data) return data[0];
    } catch (error) {
      console.error('Error in TodaysRosary (getYoutubeVideo):', error);
    }
  };

  const getEvents = async (id: string) => {
    try {
      let { data, error } = await db
        .getEvents()
        .select('*')
        .eq('event_source', id);
      if (error) console.error('Error in TodaysRosary (getEvents):', error);
      if (data) return data[0];
    } catch (error) {
      console.error('Error in TodaysRosary (getEvents):', error);
    }
  };

  const goToRosary = async () => {
    navigate.push(eventURL);
  };

  const init = async (language: LANG) => {
    try {
      const youtube = await getYoutubeVideo(language);
      if (youtube) {
        const events = await getEvents(youtube.id);
        if (events) {
          setEventURL(`${NAV_APP_LINKS.event.link}/${events.slug}`);
          setImage(events.picture_url ?? '');
        }
      }
    } catch (error) {
      console.error('Error in TodaysRosary (init):', error);
    }
  };

  useEffect(() => {
    init(lang);

    const interval = setInterval(
      () => {
        init(lang); // Call every 2 minutes
      },
      2 * 60 * 1000,
    ); // 2 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [lang]);

  if (image === undefined) return <Loading isFeature />;

  return (
    <div style={{ position: 'relative', padding: '20px 0' }}>
      <BgBox style={{ backgroundImage: `url("${image}")` }} />
      <ContentBox onClick={goToRosary}>
        <Box>
          <Typography
            fontSize="small"
            fontWeight="light"
            sx={{ color: 'white' }}
          >
            {t.todaysRosary} - {weekDay}
          </Typography>
          <Typography
            sx={{ color: 'white' }}
            my={2}
            component="h1"
            variant="h4"
          >
            {t[todayMystery as keyof typeof t]}
          </Typography>
          <Button color="success" variant="contained">
            {t.prayTodaysRosary}
          </Button>
        </Box>
        <Box>
          <RosaryImage
            width="0"
            height="0"
            sizes="100vw"
            src={image}
            alt="Today's Rosary"
          />
        </Box>
      </ContentBox>
    </div>
  );
};

export default TodayRosary;
