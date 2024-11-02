import styles from './HorizontalDivider.module.scss';

const HorizontalDivider = () => {
  return (
    <div className={styles.container}>
      <div className={styles.bar} />
      <div className={styles.text}>OR</div>
    </div>
  );
};

export default HorizontalDivider;
