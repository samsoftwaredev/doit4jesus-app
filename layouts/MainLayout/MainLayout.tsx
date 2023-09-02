import { MainNavbar, Footer } from "@/components";
import { ReactNode } from "react";
import styles from "./mainLayout.module.scss";

interface Props {
  children?: ReactNode;
  type?: "main" | "app";
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <MainNavbar />
        {children}
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
