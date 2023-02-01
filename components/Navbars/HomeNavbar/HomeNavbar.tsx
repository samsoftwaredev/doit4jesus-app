import Link from "next/link";
import { NAV_MAIN_LINKS, PAGES } from "@/constants";
import { Logo } from "@/components";
import styles from "./homeNavbar.module.scss";

const HomeNavbar = () => {
  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <Link href={PAGES.home.link} className={styles.link}>
          <Logo />
        </Link>
      </div>
      <div className={styles.linkContainer}>
        <ul className={styles.item}>
          {Object.values(NAV_MAIN_LINKS).map(({ value, label, link }) => (
            <li key={value} className={styles.itemLink}>
              <Link href={link}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default HomeNavbar;
