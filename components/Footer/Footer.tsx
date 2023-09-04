import styles from "./footer.module.scss";
import { useRouter } from "next/router";
import { NAV_FOOTER_LINKS } from "@/constants";
import { Box, Button, Container, Grid } from "@mui/material";
import Logo from "../Logo/Logo";

const currentYear = new Date().getFullYear();

const Footer = () => {
  const router = useRouter();

  const goToAbout = () => {
    router.push(NAV_FOOTER_LINKS.about.link);
  };
  const goToBlog = () => {
    router.push(NAV_FOOTER_LINKS.blog.link);
  };
  const goToContact = () => {
    router.push(NAV_FOOTER_LINKS.contact.link);
  };

  return (
    <Container maxWidth={false}>
      <Grid
        height="100px"
        container
        justifyContent="space-between"
        alignItems="center"
        flex="row"
      >
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        <div className={styles.logo}>
          &copy; {currentYear} DoIt4Jesus. All rights reserved.
        </div>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={goToAbout}>About</Button>
        <Button onClick={goToBlog}>Blog</Button>
        <Button onClick={goToContact}>Contact</Button>
      </Grid>
    </Container>
  );
};

export default Footer;
