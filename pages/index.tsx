import type { NextPage } from "next";
import {
  Meta,
  Hero,
  Features,
  Community,
  HomeNavbar,
  WhyPrayRosary,
  CallToAction,
} from "@/components";
import { MainLayout } from "@/layouts";

const Home: NextPage = () => {
  return (
    <MainLayout topNavbar={<HomeNavbar />}>
      <Meta />
      <Hero />
      <Features />
      <Community />
      <WhyPrayRosary />
      <CallToAction />
    </MainLayout>
  );
};

export default Home;
