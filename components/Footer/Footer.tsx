import styles from "./footer.module.scss";
import { useRouter } from "next/router";
import { NAV_FOOTER_LINKS } from "@/constants";
import { Button, Container } from "@mui/material";
import Logo from "../Logo/Logo";
import { YouTubeSubscribe } from "../YouTubeVideo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const goToAbout = () => {
    router.push(NAV_FOOTER_LINKS.about.link);
  };
  const goToResources = () => {
    router.push(NAV_FOOTER_LINKS.resources.link);
  };
  const goToContact = () => {
    router.push(NAV_FOOTER_LINKS.contact.link);
  };

  return (
    <Container className={styles.container} maxWidth={false}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.copyRights}>
        &copy; {currentYear} DoIt4Jesus. All rights reserved.
      </div>
      <div className={styles.socialMedia}>
        <YouTubeSubscribe />
      </div>
      <Button className={styles.about} onClick={goToAbout}>
        About
      </Button>
      <Button className={styles.resources} onClick={goToResources}>
        Resources
      </Button>
      <Button className={styles.contact} onClick={goToContact}>
        Contact
      </Button>
    </Container>
  );
};

export default Footer;
