import styles from './card.module.scss';

interface Props {
  children: JSX.Element | JSX.Element[] | string;
}

const Card = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Card;
