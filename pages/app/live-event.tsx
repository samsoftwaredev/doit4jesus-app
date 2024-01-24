import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import { EventSection } from "@/sections";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { Event, EventTypes, VideoEvent } from "@/interfaces";
import { normalizeEvent, normalizeVideo } from "normalize";
import { db } from "@/class/SupabaseDB";
import { toast } from "react-toastify";

const LiveEvent: NextPage = () => {
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
      <AppLayout>
        {eventVideo ? <EventSection event={eventVideo} /> : "No live event"}
      </AppLayout>
    </ProtectedRoute>
  );
};

export default LiveEvent;
