import { ReactNode } from 'react';

import { Footer, HomeNavbar } from '@/components';

import styles from './mainLayout.module.scss';

interface Props {
  children?: ReactNode;
  topNavbar?: ReactNode;
}

const MainLayout = ({ children, topNavbar = <HomeNavbar /> }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {topNavbar}
        {children}
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
