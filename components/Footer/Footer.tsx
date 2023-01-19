import { NAV_FOOTER_LINKS } from "@/constants";
import Link from "next/link";
import styles from "./footer.module.scss";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className={styles.container}>
      <div className={styles.logo}>DoIt4Jesus &copy; {year}</div>
      <ul className={styles.links}>
        {NAV_FOOTER_LINKS.map(({ link, label, value }) => (
          <li className={styles.item} key={value}>
            <Link href={link}>
              <a>{label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
