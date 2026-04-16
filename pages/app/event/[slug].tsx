import EventBusyIcon from '@mui/icons-material/EventBusy';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Button, Container, Stack, Typography, alpha } from '@mui/material';
import { RealtimeChannel } from '@supabase/supabase-js';
import moment from 'moment';
import type { GetServerSideProps, NextPage } from 'next';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { supabase } from '@/classes/SupabaseDB';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Loading from '@/components/Loading';
import { NoDataAvailable } from '@/components/NoDataAvailable';
import EventSection from '@/components/Sections/EventSection';
import { AppLayout } from '@/components/Templates';
import { useAudioContext } from '@/context/AudioContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { usePresenceContext } from '@/context/PresenceContext';
import { useUserContext } from '@/context/UserContext';
import { DataEvent, EventTypes, VideoEvent } from '@/interfaces';
import { fetchEventBySlug, fetchVideo } from '@/services/eventsApi';
import { normalizeEvent, normalizeVideo } from '@/utils';

const LiveEvent: NextPage = () => {
  const params = useParams();
  const slug = params.slug;
  const { user } = useUserContext();
  const { t } = useLanguageContext();
  const { setAudioPlayer, setHideMusicPlayer } = useAudioContext();
  const { setChannel } = usePresenceContext();
  const channel: RealtimeChannel | undefined =
    typeof slug === 'string' ? supabase.channel(user?.city ?? slug) : undefined;
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
      toast.error('Unable to display video');
    }
  };

  const getEvent = async (slugId: string) => {
    try {
      const data = await fetchEventBySlug(slugId);
      if (data) return normalizeEvent(data)[0];
    } catch (error) {
      console.error('Exception in getEvent:', error);
      toast.error('Unable to get event');
    }
  };

  const getData = async (slugId: string) => {
    try {
      const eventRes = await getEvent(slugId);
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
      console.error('Error in getData:', { slug: slugId, error });
      toast.error('Unable to load event data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug && !Array.isArray(slug)) getData(slug);
    setChannel(channel);
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
          <Stack
            alignItems="center"
            spacing={2}
            py={6}
            sx={{
              borderRadius: 4,
              bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
            }}
          >
            <EventBusyIcon
              sx={{ fontSize: 56, color: 'warning.main', opacity: 0.4 }}
            />
            <Typography variant="h6" fontWeight={700}>
              {t.eventNotStarted}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              {t.eventNotStartedDescription}
            </Typography>
          </Stack>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container maxWidth="lg">
        {typeof dataEvent === 'object' ? (
          <EventSection videoEvent={dataEvent} />
        ) : (
          <NoDataAvailable />
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

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default LiveEventWrapper;
