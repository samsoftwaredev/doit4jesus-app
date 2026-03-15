import styled from '@emotion/styled';
import { ReactNode } from 'react';

import { Footer, HomeNavbar } from '@/components';

const Container = styled('div')({
  position: 'relative',
  minHeight: '100vh',
  marginBottom: '140px',
  '@media (min-width: 768px)': {
    marginBottom: '100px',
  },
});

const Content = styled('div')({
  paddingBottom: '2.5rem',
});

const FooterWrapper = styled('div')({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: '2.5rem',
});

interface Props {
  children?: ReactNode;
  topNavbar?: ReactNode;
}

const MainLayout = ({ children, topNavbar = <HomeNavbar /> }: Props) => {
  return (
    <Container>
      <Content>
        {topNavbar}
        {children}
      </Content>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </Container>
  );
};

export default MainLayout;
