import { CardProps } from "@/interfaces";
import styles from "./card.module.scss";

type Props = CardProps & { classNames: string };

const Card = ({ classNames, title, description }: Props) => {
  return (
    <div className={[styles.container, classNames].join(" ")}>
      <h4>{title}</h4>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default Card;
