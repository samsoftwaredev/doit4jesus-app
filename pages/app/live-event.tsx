import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import LiveEvent from "@/sections/LiveEvent";

const Rosary: NextPage = () => {
  return (
    <AppLayout>
      <LiveEvent />
    </AppLayout>
  );
};

export default Rosary;
