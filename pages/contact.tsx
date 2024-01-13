import type { NextPage } from "next";
import { MainLayout } from "@/layouts";
import { HomeNavbar, Meta } from "../components";
import { ContactSection } from "@/sections";

const Contact: NextPage = () => {
  return (
    <MainLayout topNavbar={<HomeNavbar />}>
      <Meta pageTitle="Contact" />
      <ContactSection />
    </MainLayout>
  );
};

export default Contact;
