import type { NextPage } from "next";
import { MainLayout } from "@/components/Templates";
import { Meta } from "@/components";
import { ContactSection } from "@/components/Sections";

const Contact: NextPage = () => {
  return (
    <MainLayout>
      <Meta pageTitle="Contact" />
      <ContactSection />
    </MainLayout>
  );
};

export default Contact;
