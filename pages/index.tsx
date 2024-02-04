import type { NextPage } from "next";
import {
  Meta,
  Hero,
  Features,
  Community,
  HomeNavbar,
  WhyPrayRosary,
  CallToAction,
  // RosaryWeapon,
} from "@/components";
import { MainLayout } from "@/layouts";

const Home: NextPage = () => {
  return (
    <MainLayout topNavbar={<HomeNavbar />}>
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
