import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/router";
import { EventTypes } from "@/interfaces";
import { useEffect, useState } from "react";
import { db, supabase } from "@/class/SupabaseDB";
import { normalizeEvent, normalizeVideo } from "normalize";
import { toast } from "react-toastify";
import { usePresenceContext } from "@/context/PresenceContext";
import Loading from "@/components/Loading";
import { useAudioContext } from "@/context/AudioContext";
import { RealtimeChannel } from "@supabase/supabase-js";

const LiveEvent: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { setChannel } = usePresenceContext();
  const { setAudioPlayer } = useAudioContext();
  const channel: RealtimeChannel | undefined =
    typeof slug === "string" ? supabase.channel(slug) : undefined;
  const [isLoading, setIsLoading] = useState(true);

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
        setAudioPlayer({
          audio: video.videoId,
          audioTitle: video.title,
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

  return null;
};

export default LiveEvent;
