import type { NextPage } from "next";
import { MainLayout } from "@/layouts";
import { HomeNavbar } from "../components";

const Contact: NextPage = () => {
  return <MainLayout topNavbar={<HomeNavbar />}>Contact</MainLayout>;
};

export default Contact;
