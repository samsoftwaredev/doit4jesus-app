import { FOOTER_LINKS } from "@/constants/variables";
import Link from "next/link";
import styles from "./footer.module.scss";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className={styles.container}>
      <div className={styles.logo}>Luisa's Garden &copy; {year}</div>
      <ul className={styles.links}>
        {FOOTER_LINKS.map(({ link, label, value }) => (
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
