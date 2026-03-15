import { styled } from '@mui/material/styles';

import { useLanguageContext } from '@/context/LanguageContext';

const Container = styled('div')({
  width: '90%',
  position: 'relative',
  height: '50px',
  margin: 'auto',
});

const Bar = styled('div')(({ theme }) => ({
  top: '50%',
  position: 'absolute',
  width: '100%',
  backgroundColor: theme.palette.divider,
  height: '2px',
}));

const Text = styled('div')(({ theme }) => ({
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
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
}));

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
