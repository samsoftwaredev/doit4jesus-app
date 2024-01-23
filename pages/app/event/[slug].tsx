import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import { EventSection } from "@/sections";
import ProtectedRoute from "@/components/ProtectedRoute";
import events from "@/data/events.json";
import { useRouter } from "next/router";

const LiveEvent: NextPage = () => {
  const router = useRouter();
  const eventId = router.query.slug;
  const event = events.find(({ id }) => id === eventId);

  return (
    <ProtectedRoute>
      <AppLayout>
        {event ? <EventSection event={event} /> : "No event found"}
      </AppLayout>
    </ProtectedRoute>
  );
};

export default LiveEvent;
