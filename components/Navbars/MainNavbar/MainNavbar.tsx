import Link from "next/link";
import { NAV_MAIN_LINKS, NAV_APP_LINKS, PAGES } from "@/constants";
import { Logo } from "@/components";
import styles from "./mainNavbar.module.scss";

interface Props {
  type?: "main" | "app";
}

const MainNavbar = ({ type = "main" }: Props) => {
  const displayContent = {
    main: {
      section: "",
      navLinks: NAV_MAIN_LINKS,
    },
    app: {
      section: "",
      navLinks: NAV_APP_LINKS,
    },
  };
  const data = displayContent[type];
  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <Link href={PAGES.home.link} className={styles.link}>
          <Logo />
          <span>{data.section}</span>
        </Link>
      </div>
      <div className={styles.linkContainer}>
        <ul className={styles.item}>
          {Object.values(data.navLinks).map(({ value, label, link }) => (
            <li key={value} className={styles.itemLink}>
              <Link href={link}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MainNavbar;
