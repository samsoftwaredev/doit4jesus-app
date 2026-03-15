import styled from '@emotion/styled';

import { CardProps } from '@/interfaces';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

interface Props {
  cards: CardProps[];
  counter: number;
  theme?: 'dark' | 'light';
}

const CardCounter = ({ cards, counter, theme = 'dark' }: Props) => {
  if (cards.length === 1) return null;
  if (Array.isArray(cards)) {
    const total = cards.length;
    return (
      <Container>
        {counter}/{total}
      </Container>
    );
  }
  return null;
};

export default CardCounter;
