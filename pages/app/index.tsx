import { AppLayout } from "@/layouts";
import Dashboard from "@/sections/Dashboard";
import type { NextPage } from "next";

const App: NextPage = () => {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
};

export default App;
