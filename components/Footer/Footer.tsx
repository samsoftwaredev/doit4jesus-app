import styles from "./footer.module.scss";
import { useRouter } from "next/router";
import { NAV_FOOTER_LINKS } from "@/constants";
import { Button, Container } from "@mui/material";
import Logo from "../Logo/Logo";
import { YouTubeSubscribe } from "../YouTubeVideo";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

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
      <Link passHref href={NAV_FOOTER_LINKS.about.link}>
        <Button className={styles.about}>About</Button>
      </Link>
      <Link passHref href={NAV_FOOTER_LINKS.resources.link}>
        <Button className={styles.resources}>Resources</Button>
      </Link>
      <Link passHref href={NAV_FOOTER_LINKS.contact.link}>
        <Button className={styles.contact}>Contact</Button>
      </Link>
    </Container>
  );
};

export default Footer;
