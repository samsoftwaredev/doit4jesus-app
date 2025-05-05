import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Rosary } from '@/classes/Rosary';
import { db } from '@/classes/SupabaseDB';
import { ROSARY_DAYS } from '@/constants/mysteries';
import { NAV_APP_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { LANG } from '@/interfaces/index';
import { capitalizeFirstLetter } from '@/utils/helpers';

import Loading from '../Loading';
import styles from './TodaysRosary.module.scss';

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
    const rosaryId = rosary.getRosaryState(language).mysteryAudio;
    let { data, error } = await db
      .getYouTubeVideo()
      .select('*')
      .eq('video_id', rosaryId);
    if (data) return data[0];
    console.error(error);
  };

  const getEvents = async (id: string) => {
    let { data, error } = await db
      .getEvents()
      .select('*')
      .eq('event_source', id);
    if (data) return data[0];
    console.error(error);
  };

  const goToRosary = async () => {
    navigate.push(eventURL);
  };

  const init = async (language: LANG) => {
    const youtube = await getYoutubeVideo(language);
    if (youtube) {
      const events = await getEvents(youtube.id);
      if (events) {
        setEventURL(`${NAV_APP_LINKS.event.link}/${events.slug}`);
        setImage(events.picture_url ?? '');
      }
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
      <Box
        className={styles.bg}
        style={{ backgroundImage: `url("${image}")` }}
      />
      <Box className={styles.content} onClick={goToRosary}>
        <Box>
          <Typography fontSize="small" fontWeight="light">
            {t.todaysRosary} - {weekDay}
          </Typography>
          <Typography my={2} component="h1" variant="h4">
            {t[todayMystery as keyof typeof t]}
          </Typography>
          <Button color="success" variant="contained">
            {t.prayTodaysRosary}
          </Button>
        </Box>
        <Box>
          <Image
            width="0"
            height="0"
            sizes="100vw"
            className={styles.image}
            src={image}
            alt="Today's Rosary"
          />
        </Box>
      </Box>
    </div>
  );
};

export default TodayRosary;
