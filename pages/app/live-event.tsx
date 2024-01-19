import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import { LiveEvent } from "@/sections";
import ProtectedRoute from "@/components/ProtectedRoute";

const Rosary: NextPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <LiveEvent />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Rosary;
