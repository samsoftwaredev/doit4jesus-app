import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import type { JSX } from 'react';

const marquee = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(-200%); }
`;

const Container = styled('div')({
  overflow: 'hidden',
  width: '100%',
});

const MovingTextWrapper = styled('div')({
  animation: `${marquee} 20s linear infinite`,
});

interface Props {
  children?: JSX.Element | string;
}

const MovingText = ({ children }: Props) => {
  return (
    <Container>
      <MovingTextWrapper>{children}</MovingTextWrapper>
    </Container>
  );
};

export default MovingText;
