import styles from "./card.module.scss";

interface Props {
  children: JSX.Element | JSX.Element[] | string;
}

const Card = ({ children }: Props) => {
  return <div className={styles.container}>{children}</div>;
};

export default Card;
