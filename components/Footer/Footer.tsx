import styles from "./footer.module.scss";
import { useRouter } from "next/router";
import { NAV_FOOTER_LINKS } from "@/constants";
import { Button, Container } from "@mui/material";
import Logo from "../Logo/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
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
    <Container className={styles.container} maxWidth={false}>
      <Logo />
      <div className={styles.logo}>
        &copy; {currentYear} DoIt4Jesus. All rights reserved.
      </div>
      <Button onClick={goToAbout}>About</Button>
      <Button onClick={goToBlog}>Blog</Button>
      <Button onClick={goToContact}>Contact</Button>
    </Container>
  );
};

export default Footer;
