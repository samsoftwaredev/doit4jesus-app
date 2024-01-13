import type { NextPage } from "next";
import { MainLayout } from "@/layouts";
import { HomeNavbar, Meta } from "../components";
import AboutSection from "@/sections/AboutSection";

const About: NextPage = () => {
  return (
    <MainLayout topNavbar={<HomeNavbar />}>
      <Meta pageTitle="About" />
      <AboutSection />
    </MainLayout>
  );
};

export default About;
