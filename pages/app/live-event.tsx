import type { NextPage } from "next";
import { AppLayout } from "@/components/Templates";
import { useEffect, useState } from "react";
import { DataEvent, EventTypes, VideoEvent } from "@/interfaces";
import { normalizeEvent, normalizeVideo } from "@/utils";
import { db, supabase } from "classes/SupabaseDB";
import { toast } from "react-toastify";
import { usePresenceContext } from "@/context/PresenceContext";
import Loading from "@/components/Loading";
import { useAudioContext } from "@/context/AudioContext";
import { Container, Typography } from "@mui/material";
import EventSection from "@/components/Sections/EventSection";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import moment from "moment";
import { useUserContext } from "@/context/UserContext";
import dayjs from "dayjs";

const LiveEvent: NextPage = () => {
  const { user } = useUserContext();
  const { setChannel } = usePresenceContext();
  const { setAudioPlayer, setHideMusicPlayer, setCallbackOnCompleteVideo } =
    useAudioContext();
  const liveEvent = supabase.channel("live-event");
  const [isLoading, setIsLoading] = useState(true);
  const [dataEvent, setDataEvent] = useState<VideoEvent & DataEvent>();
  const timeRemaining = moment(dataEvent?.startedAt) > moment();

  const getYouTube = async (id: string | null) => {
    if (!id) return;
    const { data, error } = await db.getYouTubeVideo().select("*").eq("id", id);
    if (data) return normalizeVideo(data)[0];
    if (error) toast.error("Unable to display video");
  };

  const getEvent = async () => {
    const { data, error } = await db
      .getEvents()
      .select("*")
      .order("started_at", { ascending: true })
      .limit(1);
    if (data) return normalizeEvent(data)[0];
    if (error) toast.error("Unable to get event");
  };

  const registerRosaryCompleted = async () => {
    if (user?.userId) {
      const { error } = await db
        .getRosaryStats()
        .insert({
          completed_at: dayjs().format("MM/DD/YYYY"),
          user_id: user.userId,
        })
        .eq("user_id", user.userId!)
        .select();
      if (error) toast.error("Unable to store rosary count");
    }
  };

  setCallbackOnCompleteVideo(() => {
    registerRosaryCompleted();
  });

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
        <Loading isPage={false} />
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
      <Container className="container-box" maxWidth="lg">
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
