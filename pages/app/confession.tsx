import { AppLayout } from "@/layouts";
import type { NextPage } from "next";
import { ConfessionGuide } from "@/sections";
import ProtectedRoute from "@/components/ProtectedRoute";

const Confession: NextPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ConfessionGuide />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Confession;
