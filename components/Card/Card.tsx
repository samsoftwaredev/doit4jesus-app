import { CardProps } from "@/interfaces";
import styles from "./card.module.scss";

type Props = CardProps;

const Card = ({ title, question }: Props) => {
  return (
    <div className={[styles.container].join(" ")}>
      <h4>{title}</h4>
      <div>{question}</div>
    </div>
  );
};

export default Card;
