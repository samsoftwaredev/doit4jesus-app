import styled from '@emotion/styled';
import type { CSSProperties, JSX } from 'react';

const Container = styled('div')({
  height: '100%',
  color: '#ffffff',
  backgroundColor: '#163755',
  borderRadius: '10px',
});

const Content = styled('div')({
  padding: '20px',
  overflow: 'hidden',
});

interface Props {
  children: JSX.Element | JSX.Element[] | string;
  style?: CSSProperties;
}

const Card = ({ children, style }: Props) => {
  return (
    <Container>
      <Content style={style}>{children}</Content>
    </Container>
  );
};

export default Card;
