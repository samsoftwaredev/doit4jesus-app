import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import { EventSection } from "@/sections";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/router";
import { EventTypes, Event, VideoEvent } from "@/interfaces";
import { useEffect, useState } from "react";
import { db } from "@/class/SupabaseDB";
import { normalizeEvent, normalizeVideo } from "normalize";
import { toast } from "react-toastify";

const LiveEvent: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
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

  const getEvent = async (slugId: string) => {
    const { data, error } = await db.getEvents().select("*").eq("slug", slugId);
    if (!error) return normalizeEvent(data)[0];
    console.error(error);
    toast.error("Unable to get event");
  };

  const getData = async (slugId: string) => {
    const event = await getEvent(slugId);
    if (event?.eventType === EventTypes.youtubeVideo) {
      const video = await getYouTube(event.eventSource);
      if (video) {
        setEventVideo({
          ...event,
          ...video,
        });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (slug && !Array.isArray(slug)) {
      getData(slug);
    }
  }, []);

  if (isLoading)
    return (
      <AppLayout>
        <p>Loading...</p>
      </AppLayout>
    );

  return (
    <ProtectedRoute>
      <AppLayout>
        {eventVideo ? <EventSection event={eventVideo} /> : "No event found"}
      </AppLayout>
    </ProtectedRoute>
  );
};

export default LiveEvent;
