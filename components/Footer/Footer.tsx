import styles from "./footer.module.scss";
import { useRouter } from "next/router";
import { NAV_FOOTER_LINKS } from "@/constants";
import { Button, Container } from "@mui/material";

const currentYear = new Date().getFullYear();

const Footer = () => {
  const router = useRouter();

  const goToPage = (link: string) => {
    router.push(link);
  };

  return (
    <Container maxWidth={false}>
      <div className={styles.logo}>DoIt4Jesus &copy; {currentYear}</div>
      <ul className={styles.links}>
        {NAV_FOOTER_LINKS.map(({ link, label, value }) => (
          <li className={styles.item} key={value}>
            <Button onClick={() => goToPage(link)}>{label}</Button>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default Footer;
