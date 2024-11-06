import { CSSProperties } from 'styled-components';

import styles from './card.module.scss';

interface Props {
  children: JSX.Element | JSX.Element[] | string;
  style?: CSSProperties;
}

const Card = ({ children, style }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content} style={style}>
        {children}
      </div>
    </div>
  );
};

export default Card;
