import type { NextPage } from "next";
import { MainLayout } from "@/layouts";
import { HomeNavbar } from "../components";

const About: NextPage = () => {
  return <MainLayout topNavbar={<HomeNavbar />}>About</MainLayout>;
};

export default About;
