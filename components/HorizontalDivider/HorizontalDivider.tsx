import styled from '@emotion/styled';

import { useLanguageContext } from '@/context/LanguageContext';

const Container = styled('div')({
  width: '90%',
  position: 'relative',
  height: '50px',
  margin: 'auto',
});

const Bar = styled('div')({
  top: '50%',
  position: 'absolute',
  width: '100%',
  backgroundColor: '#71706a',
  height: '2px',
});

const Text = styled('div')({
  width: '50%',
  height: '50%',
  overflow: 'auto',
  margin: 'auto',
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  textAlign: 'center',
  color: '#163755',
  backgroundColor: 'rgb(255, 255, 255)',
});

const HorizontalDivider = () => {
  const { t } = useLanguageContext();
  return (
    <Container>
      <Bar />
      <Text>{t.or}</Text>
    </Container>
  );
};

export default HorizontalDivider;
