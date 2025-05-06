import { useLanguageContext } from '@/context/LanguageContext';

import styles from './HorizontalDivider.module.scss';

const HorizontalDivider = () => {
  const { t } = useLanguageContext();
  return (
    <div className={styles.container}>
      <div className={styles.bar} />
      <div className={styles.text}>{t.or}</div>
    </div>
  );
};

export default HorizontalDivider;
