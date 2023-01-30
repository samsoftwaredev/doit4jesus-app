import type { NextPage } from "next";
import {
  Meta,
  MinimalLayout,
  Hero,
  Features,
  Resources,
  Community,
} from "@/components";

const Home: NextPage = () => {
  return (
    <>
      <Meta />
      <MinimalLayout>
        <Hero />
        <Features />
        <Community />
        <Resources />
      </MinimalLayout>
    </>
  );
};

export default Home;
