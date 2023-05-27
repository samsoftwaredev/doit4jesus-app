import styles from "./ocean.module.scss";
import eucharistColumn from "@/public/assets/images/dream/eucharist-column.svg";
import maryColumn from "@/public/assets/images/dream/mary-column.svg";
import ship from "@/public/assets/images/dream/ship.svg";
import { css } from "@/utils/helpers";
import Image from "next/image";

const Ocean = () => {
  return (
    <div className={styles.ocean}>
      <Image
        className={styles.ship}
        src={ship}
        alt="The Catholic Church as a ship"
      />
      <Image
        className={css(styles.eucharistColumn, styles.column)}
        src={eucharistColumn}
        alt="The Holy Eucharist Column"
      />
      <Image
        className={css(styles.maryColumn, styles.column)}
        src={maryColumn}
        alt="The Virgin Mary Column"
      />
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className={styles.wave} />
    </div>
  );
};
export default Ocean;
