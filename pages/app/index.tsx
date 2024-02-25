import { db } from "@/class/SupabaseDB";
import Loading from "@/components/Loading";
import Meta from "@/components/Meta";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Event } from "@/interfaces/index";
import { AppLayout } from "@/layouts";
import Dashboard from "@/sections/DashboardSection";
import type { NextPage } from "next";
import { normalizeEvent } from "normalize/dbTables";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const App: NextPage = () => {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getEvents = async () => {
    setIsLoading(true);
    const { data, error } = await db
      .getEvents()
      .select("*")
      .order("started_at", { ascending: true });
    if (!error) setEvents(normalizeEvent(data));
    else {
      console.error(error);
      toast.error("Unable to get list of events");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <Loading isPage={true} />
      </AppLayout>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <Dashboard events={events} />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default App;
