import type { NextPage } from "next";
import { Meta, Hero, Features, Community } from "@/components";
import { MainLayout } from "@/layouts";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Meta />
      <Hero />
      <Features />
      <Community />
    </MainLayout>
  );
};

export default Home;
