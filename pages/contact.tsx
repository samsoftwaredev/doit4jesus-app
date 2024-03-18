import type { NextPage } from "next";
import { MainLayout } from "@/layouts";
import { Meta } from "../components";
import { ContactSection } from "@/sections";

const Contact: NextPage = () => {
  return (
    <MainLayout>
      <Meta pageTitle="Contact" />
      <ContactSection />
    </MainLayout>
  );
};

export default Contact;
