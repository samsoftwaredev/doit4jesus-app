import { db } from "@/class/SupabaseDB";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Event } from "@/interfaces/index";
import { AppLayout } from "@/layouts";
import Dashboard from "@/sections/Dashboard";
import type { NextPage } from "next";
import { normalizeEvent } from "normalize/dbTables";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const App: NextPage = () => {
  const [events, setEvents] = useState<Event[] | null>(null);

  const getEvents = async () => {
    const { data, error } = await db
      .getEvents()
      .select("*")
      .order("started_at", { ascending: true });
    if (!error) setEvents(normalizeEvent(data));
    else {
      console.error(error);
      toast.error("Unable to get list of events");
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <ProtectedRoute>
      <AppLayout>
        <Dashboard events={events} />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default App;
