import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import { EventSection } from "@/sections";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { Event, EventTypes, VideoEvent } from "@/interfaces";
import { normalizeEvent, normalizeVideo } from "normalize";
import { db, supabase } from "@/class/SupabaseDB";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import { PresenceContextProvider } from "@/context/PresenceContext";
import { useUserContext } from "@/context/UserContext";

const LiveEvent: NextPage = () => {
  const { user } = useUserContext();
  const liveEvent = supabase.channel("live-event"); // set your topic here
  const [isLoading, setIsLoading] = useState(true);
  const [eventVideo, setEventVideo] = useState<(VideoEvent & Event) | null>(
    null
  );

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
      .order("started_at", { ascending: false })
      .limit(1);
    if (!error) return normalizeEvent(data)[0];
    console.error(error);
    toast.error("Unable to get event");
  };

  const getData = async () => {
    const eventRes = await getEvent();
    if (eventRes?.eventType === EventTypes.youtubeVideo) {
      const videoRes = await getYouTube(eventRes.eventSource);
      if (videoRes) setEventVideo({ ...eventRes, ...videoRes });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <p>Loading...</p>
      </AppLayout>
    );
  }

  return (
    <ProtectedRoute>
      <PresenceContextProvider channel={liveEvent} user={user!}>
        <AppLayout>
          {eventVideo ? <EventSection event={eventVideo} /> : "No live event"}
        </AppLayout>
      </PresenceContextProvider>
    </ProtectedRoute>
  );
};

export default LiveEvent;
