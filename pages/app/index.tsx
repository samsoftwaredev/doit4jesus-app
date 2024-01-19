import ProtectedRoute from "@/components/ProtectedRoute";
import { AppLayout } from "@/layouts";
import Dashboard from "@/sections/Dashboard";
import type { NextPage } from "next";

const App: NextPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default App;
