import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Rosary } from '@/class/Rosary';
import { db } from '@/class/SupabaseDB';
import { ROSARY_DAYS } from '@/constants/mysteries';
import { NAV_APP_LINKS } from '@/constants/nav';
import { capitalizeFirstLetter } from '@/utils/helpers';

import styles from './TodaysRosary.module.scss';

const TodayRosary = () => {
  let eventURL = '';
  const navigate = useRouter();
  const rosary = new Rosary();
  const todayMystery = rosary.getRosaryState().mystery;
  const [image, setImage] = useState<string>('');
  const weekDayNum = dayjs().day();
  const weekDay = capitalizeFirstLetter(Object.keys(ROSARY_DAYS)[weekDayNum]);

  const getYoutubeVideo = async () => {
    const rosaryId = rosary.getRosaryState().mysteryAudio;
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

  const init = async () => {
    const youtube = await getYoutubeVideo();
    if (youtube) {
      const events = await getEvents(youtube.id);
      if (events) {
        eventURL = `${NAV_APP_LINKS.event.link}/${events.slug}`;
        setImage(events.picture_url ?? '');
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div style={{ position: 'relative', padding: '20px 0' }}>
      <Box
        className={styles.bg}
        style={{ backgroundImage: `url("${image}")` }}
      />
      <Box className={styles.content}>
        <Box>
          <Typography fontSize="small" fontWeight="light">
            Today&apos;s Rosary - {weekDay}
          </Typography>
          <Typography my={2} component="h1" variant="h4">
            {todayMystery}
          </Typography>
          <Button onClick={goToRosary} color="success" variant="contained">
            Pray Today&apos;s Rosary
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
