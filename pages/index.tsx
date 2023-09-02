import type { NextPage } from "next";
import { Meta, Hero, Features, Community, HomeNavbar } from "@/components";
import { MainLayout } from "@/layouts";

const Home: NextPage = () => {
  return (
    <MainLayout topNavbar={<HomeNavbar />}>
      <Meta />
      <Hero />
      <Features />
      <Community />
    </MainLayout>
  );
};

export default Home;
