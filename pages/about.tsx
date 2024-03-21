import type { NextPage } from "next";
import { MainLayout } from "@/components/Templates";
import { Meta } from "@/components";
import AboutSection from "@/components/Sections/AboutSection";

const About: NextPage = () => {
  return (
    <MainLayout>
      <Meta pageTitle="About" />
      <AboutSection />
    </MainLayout>
  );
};

export default About;
