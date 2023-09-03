import { MainNavbar, Footer } from "@/components";
import { ReactNode } from "react";
import styles from "./mainLayout.module.scss";
import { theme } from "@/styles/mui-overwrite";
import { ThemeProvider } from "@mui/material";

interface Props {
  children?: ReactNode;
  topNavbar?: ReactNode;
}

const MainLayout = ({ children, topNavbar = <MainNavbar /> }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <div className={styles.content}>
          {topNavbar}
          {children}
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
