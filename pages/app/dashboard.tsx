import { AppLayout } from "@/components/Templates";
import type { NextPage } from "next";
import AppWrapper from "@/components/AppWrapper";
import DashboardSection from "@/components/Sections/DashboardSection";

const Dashboard: NextPage = () => {
  return (
    <AppLayout>
      <DashboardSection />
    </AppLayout>
  );
};

const DashboardPageWrapper = () => {
  return (
    <AppWrapper>
      <Dashboard />
    </AppWrapper>
  );
};

export default DashboardPageWrapper;
