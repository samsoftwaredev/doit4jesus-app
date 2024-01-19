import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import { LiveEvent as LiveEventSection } from "@/sections";
import ProtectedRoute from "@/components/ProtectedRoute";

const LiveEvent: NextPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <LiveEventSection />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default LiveEvent;
