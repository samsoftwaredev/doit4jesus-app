import { Container, Typography } from '@mui/material';
import moment from 'moment';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { supabase } from '@/classes/SupabaseDB';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Loading from '@/components/Loading';
import EventSection from '@/components/Sections/EventSection';
import { AppLayout } from '@/components/Templates';
import { useAudioContext } from '@/context/AudioContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { usePresenceContext } from '@/context/PresenceContext';
import { DataEvent, EventTypes, VideoEvent } from '@/interfaces';
import { fetchNextEvent, fetchVideo } from '@/services/eventsApi';
import { normalizeEvent, normalizeVideo } from '@/utils';

const LiveEvent: NextPage = () => {
  const { t } = useLanguageContext();
  const { setChannel } = usePresenceContext();
  const { setAudioPlayer, setHideMusicPlayer } = useAudioContext();
  const liveEvent = supabase.channel('live-event');
  const [isLoading, setIsLoading] = useState(true);
  const [dataEvent, setDataEvent] = useState<VideoEvent & DataEvent>();
  const timeRemaining = moment(dataEvent?.startedAt) > moment();

  const getYouTube = async (id: string | null) => {
    if (!id) {
      console.error('getYouTube: No video ID provided');
      return;
    }

    try {
      const data = await fetchVideo(id);
      if (data) return normalizeVideo(data)[0];
    } catch (error) {
      console.error('Exception in getYouTube:', error);
      toast.error(t.unableToDisplayVideo);
    }
  };

  const getEvent = async () => {
    try {
      const data = await fetchNextEvent();
      if (data) return normalizeEvent(data)[0];
    } catch (error) {
      console.error('Exception in getEvent:', error);
      toast.error(t.unableToGetEvent);
    }
  };

  const getData = async () => {
    try {
      const eventRes = await getEvent();
      if (eventRes?.eventType === EventTypes.youtubeVideo) {
        const videoRes = await getYouTube(eventRes.eventSource);
        if (videoRes) {
          setDataEvent({
            ...eventRes,
            ...videoRes,
          });
          setAudioPlayer({
            audio: videoRes.videoId,
            audioTitle: videoRes.title,
            id: eventRes.slug,
          });
        }
      }
    } catch (error) {
      console.error('Error in getData:', error);
      toast.error(t.unableToLoadEventData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    setChannel(liveEvent);
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <Loading isFeature />
      </AppLayout>
    );
  }

  if (timeRemaining) {
    setHideMusicPlayer(true);
    return (
      <AppLayout>
        <Container className="container-box" maxWidth="lg">
          <Typography>{t.eventNotStarted}</Typography>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container className="container-box" maxWidth="md">
        {typeof dataEvent === 'object' ? (
          <EventSection videoEvent={dataEvent} />
        ) : (
          <Typography variant="h3">{t.noData}</Typography>
        )}
      </Container>
    </AppLayout>
  );
};

const LiveEventWrapper = () => {
  return (
    <AppWrapper>
      <LiveEvent />
    </AppWrapper>
  );
};

export default LiveEventWrapper;
