import { Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

import { MainLayout } from '@/components/Templates';
import ship from '@/public/assets/images/dream/ship.svg';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  justifyContent: 'center',
  alignItems: 'center',
  '& img': {
    maxWidth: '200px',
    maxHeight: '200px',
  },
});

interface Props {
  title?: string;
  description?: string;
  imagePath?: string;
  imageAlt?: string;
}

const PageNotFound = ({
  title = '404',
  description = 'Page Not Found',
  imagePath = ship,
  imageAlt = 'Not Found',
}: Props) => {
  return (
    <MainLayout>
      <StyledContainer maxWidth={false}>
        <Image src={imagePath} alt={imageAlt} />
        <Typography variant="h1">{title}</Typography>
        <Typography variant="h6">{description}</Typography>
      </StyledContainer>
    </MainLayout>
  );
};

export default PageNotFound;
