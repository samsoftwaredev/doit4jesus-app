import type { NextPage } from "next";
import { MainLayout } from "@/layouts";
import { HomeNavbar } from "../components";
import AboutSection from "@/sections/AboutSection";

const About: NextPage = () => {
  return (
    <MainLayout topNavbar={<HomeNavbar />}>
      <AboutSection />
    </MainLayout>
  );
};

export default About;
