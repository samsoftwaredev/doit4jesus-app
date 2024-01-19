import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import ProtectedRoute from "@/components/ProtectedRoute";

const AttendingEvents: NextPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <p>Attending Events</p>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default AttendingEvents;
