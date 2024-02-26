import styles from "./movingText.module.scss";

interface Props {
  children?: JSX.Element | string;
}

const MovingText = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.movingText}>{children}</div>
    </div>
  );
};

export default MovingText;
