import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import { useEffect, useState } from "react";
import { DataEvent, EventTypes, VideoEvent } from "@/interfaces";
import { normalizeEvent, normalizeVideo } from "@/normalize";
import { db, supabase } from "@/class/SupabaseDB";
import { toast } from "react-toastify";
import { usePresenceContext } from "@/context/PresenceContext";
import Loading from "@/components/Loading";
import { useAudioContext } from "@/context/AudioContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Container, Typography } from "@mui/material";
import EventSection from "@/sections/EventSection";

const LiveEvent: NextPage = () => {
  const { setChannel } = usePresenceContext();
  const { setAudioPlayer } = useAudioContext();
  const liveEvent = supabase.channel("live-event");
  const [isLoading, setIsLoading] = useState(true);
  const [dataEvent, setDataEvent] = useState<VideoEvent & DataEvent>();

  const getYouTube = async (id: string | null) => {
    if (!id) return;
    const { data, error } = await db.getYouTubeVideo().select("*").eq("id", id);
    if (!error) return normalizeVideo(data)[0];
    console.error(error);
    toast.error("Unable to display video");
  };

  const getEvent = async () => {
    const { data, error } = await db
      .getEvents()
      .select("*")
      .order("started_at", { ascending: true })
      .limit(1);
    if (!error) return normalizeEvent(data)[0];
    console.error(error);
    toast.error("Unable to get event");
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

  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
};

export default LiveEvent;
