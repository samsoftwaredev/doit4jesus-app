import Link from "next/link";
import { MAIN_LINKS, APP_LINKS, PAGES } from "@/constants";
import styles from "./mainNavbar.module.scss";
import { Logo } from "@/components";

interface Props {
  type?: "main" | "app";
}

const MainNavbar = ({ type = "main" }: Props) => {
  const displayContent = {
    main: {
      section: "",
      navLinks: MAIN_LINKS,
    },
    app: {
      section: "",
      navLinks: APP_LINKS,
    },
  };
  const data = displayContent[type];
  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <Link href={PAGES.home.link}>
          <a className={styles.link}>
            <Logo />
            <span>{data.section}</span>
          </a>
        </Link>
      </div>
      <div className={styles.linkContainer}>
        <ul className={styles.item}>
          {data.navLinks.map(({ value, label, link }) => (
            <li key={value} className={styles.itemLink}>
              <Link href={link}>
                <a>{label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MainNavbar;
