import { Container, Typography } from '@mui/material';
import { db, supabase } from 'classes/SupabaseDB';
import moment from 'moment';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Loading from '@/components/Loading';
import EventSection from '@/components/Sections/EventSection';
import { AppLayout } from '@/components/Templates';
import { useAudioContext } from '@/context/AudioContext';
import { usePresenceContext } from '@/context/PresenceContext';
import { DataEvent, EventTypes, VideoEvent } from '@/interfaces';
import { normalizeEvent, normalizeVideo } from '@/utils';

const LiveEvent: NextPage = () => {
  const { setChannel } = usePresenceContext();
  const { setAudioPlayer, setHideMusicPlayer } = useAudioContext();
  const liveEvent = supabase.channel('live-event');
  const [isLoading, setIsLoading] = useState(true);
  const [dataEvent, setDataEvent] = useState<VideoEvent & DataEvent>();
  const timeRemaining = moment(dataEvent?.startedAt) > moment();

  const getYouTube = async (id: string | null) => {
    if (!id) return;
    const { data, error } = await db.getYouTubeVideo().select('*').eq('id', id);
    if (data) return normalizeVideo(data)[0];
    if (error) toast.error('Unable to display video');
  };

  const getEvent = async () => {
    const { data, error } = await db
      .getEvents()
      .select('*')
      .order('started_at', { ascending: true })
      .limit(1);
    if (data) return normalizeEvent(data)[0];
    if (error) toast.error('Unable to get event');
  };

  const getData = async () => {
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
    setIsLoading(false);
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
          <Typography>This event has not started</Typography>
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
          <Typography variant="h3" color="secondary">
            No Data
          </Typography>
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
