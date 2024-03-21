import type { NextPage } from "next";
import { AppLayout } from "@/components/layouts";
import { useRouter } from "next/router";
import { DataEvent, EventTypes, VideoEvent } from "@/interfaces";
import { useEffect, useState } from "react";
import { db, supabase } from "@/class/SupabaseDB";
import { normalizeEvent, normalizeVideo } from "@/utils";
import { toast } from "react-toastify";
import { usePresenceContext } from "@/context/PresenceContext";
import Loading from "@/components/Loading";
import { useAudioContext } from "@/context/AudioContext";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Container, Typography } from "@mui/material";
import EventSection from "@/sections/EventSection";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import moment from "moment";

const LiveEvent: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { setAudioPlayer, setHideMusicPlayer } = useAudioContext();
  const { setChannel } = usePresenceContext();
  const channel: RealtimeChannel | undefined =
    typeof slug === "string" ? supabase.channel(slug) : undefined;
  const [isLoading, setIsLoading] = useState(true);
  const [dataEvent, setDataEvent] = useState<VideoEvent & DataEvent>();
  const timeRemaining = moment(dataEvent?.startedAt) > moment();

  const getYouTube = async (id: string | null) => {
    if (!id) return;
    const { data, error } = await db.getYouTubeVideo().select("*").eq("id", id);
    if (!error) return normalizeVideo(data)[0];
    console.error(error);
    toast.error("Unable to display video");
  };

  const getEvent = async (slugId: string) => {
    const { data, error } = await db.getEvents().select("*").eq("slug", slugId);
    if (!error) return normalizeEvent(data)[0];
    console.error(error);
    toast.error("Unable to get event");
  };

  const getData = async (slugId: string) => {
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
    setIsLoading(false);
  };

  useEffect(() => {
    if (slug && !Array.isArray(slug)) getData(slug);
    setChannel(channel);
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <Loading isPage={false} />
      </AppLayout>
    );
  }

  if (timeRemaining) {
    setHideMusicPlayer(true);
    return (
      <AppLayout>
        <Container className="container-box" maxWidth="lg">
          <Typography color="secondary">
            This event hasn't started yet!
          </Typography>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container maxWidth="lg">
        {typeof dataEvent === "object" ? (
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
