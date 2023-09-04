import { MainNavbar, Footer } from "@/components";
import { ReactNode } from "react";
import styles from "./mainLayout.module.scss";

interface Props {
  children?: ReactNode;
  topNavbar?: ReactNode;
}

const MainLayout = ({ children, topNavbar = <MainNavbar /> }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {topNavbar}
        {children}
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
