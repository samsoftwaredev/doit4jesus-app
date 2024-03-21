import type { NextPage } from "next";
import {
  Meta,
  Hero,
  Features,
  Community,
  WhyPrayRosary,
  CallToAction,
  // RosaryWeapon,
} from "@/components";
import { MainLayout } from "@/components/Templates";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Meta />
      <Hero />
      <Features />
      {/* <RosaryWeapon /> */}
      <Community />
      <WhyPrayRosary />
      <CallToAction />
    </MainLayout>
  );
};

export default Home;
