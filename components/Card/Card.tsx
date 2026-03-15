import { styled } from '@mui/material/styles';
import type { CSSProperties, JSX } from 'react';

const Container = styled('div')(({ theme }) => ({
  height: '100%',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '10px',
}));

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
