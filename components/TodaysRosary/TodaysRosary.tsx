import { Rosary } from "@/class/Rosary";
import { db } from "@/class/SupabaseDB";
import { NAV_APP_LINKS } from "@/constants/nav";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

const TodayRosary = () => {
  const navigate = useRouter();
  const rosary = new Rosary();
  const todayMystery = rosary.getRosaryState().mystery;

  const getYoutubeVideo = async () => {
    const rosaryId = rosary.getRosaryState().mysteryAudio;
    let { data, error } = await db
      .getYouTubeVideo()
      .select("*")
      .eq("video_id", rosaryId);
    if (data) return data[0];
    console.error(error);
  };

  const getEvents = async (id: string) => {
    let { data, error } = await db
      .getEvents()
      .select("*")
      .eq("event_source", id);
    if (data) return data[0];
    console.error(error);
  };

  const goToRosary = async () => {
    const youtube = await getYoutubeVideo();
    if (youtube) {
      const rosary = await getEvents(youtube.id);
      if (rosary) {
        navigate.push(`${NAV_APP_LINKS.event.link}/${rosary.slug}`);
      }
    }
  };

  return (
    <>
      <Typography fontSize="small" fontWeight="light">
        Today's Rosary
      </Typography>
      <Typography my={2} component="h1" variant="h4">
        {todayMystery}
      </Typography>
      <Button onClick={goToRosary} color="success" variant="outlined">
        Pray Today's Rosary
      </Button>
    </>
  );
};

export default TodayRosary;
