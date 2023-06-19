import styles from "./ocean.module.scss";
import eucharistColumn from "@/public/assets/images/dream/eucharist-column.svg";
import maryColumn from "@/public/assets/images/dream/mary-column.svg";
import ship from "@/public/assets/images/dream/ship.svg";
import { css } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import Pulse from "../Pulse";

const Ocean = () => {
  return (
    <div className={css(styles.ocean, styles.container)}>
      {/* <div className={styles.stars} /> */}
      <Link href="/app/catholic-church" className={styles.shipLink}>
        <Image
          src={ship}
          alt="The Catholic Church as a ship"
          className={styles.ship}
        />
      </Link>
      <Link
        href="/app/confession"
        className={css(styles.eucharistColumn, styles.column)}
      >
        <Pulse />
        <Image src={eucharistColumn} alt="The Holy Eucharist Column" />
      </Link>
      <Link
        href="/app/rosary"
        className={css(styles.maryColumn, styles.column)}
      >
        <Pulse />
        <Image src={maryColumn} alt="The Virgin Mary Column" />
      </Link>
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className={styles.wave} />
    </div>
  );
};
export default Ocean;
