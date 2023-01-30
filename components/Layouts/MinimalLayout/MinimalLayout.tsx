import { ReactNode } from "react";
import { Box } from "@mui/material";
import { Footer, HomeNavbar } from "@/components";
import styles from "./minimalLayout.module.scss";

interface Props {
  children?: ReactNode;
}

const MinimalLayout = ({ children }: Props) => {
  return (
    <Box className={styles.container}>
      <HomeNavbar />
      <Box className={styles.children}>{children}</Box>
      <Footer />
    </Box>
  );
};

export default MinimalLayout;
