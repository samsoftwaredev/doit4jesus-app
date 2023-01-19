import { Meta, MainNavbar, Footer } from "@/components";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  type?: "main" | "app";
}

const MainLayout = ({ children, type }: Props) => {
  return (
    <div>
      <Meta />
      <MainNavbar type={type} />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
