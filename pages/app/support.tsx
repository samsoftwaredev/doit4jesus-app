import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import ProtectedRoute from "@/components/ProtectedRoute";

const Rosary: NextPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <p>Support</p>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Rosary;
