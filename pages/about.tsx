import type { NextPage } from "next";
import { MainLayout } from "@/components/layouts";
import { Meta } from "../components";
import AboutSection from "@/sections/AboutSection";

const About: NextPage = () => {
  return (
    <MainLayout>
      <Meta pageTitle="About" />
      <AboutSection />
    </MainLayout>
  );
};

export default About;
