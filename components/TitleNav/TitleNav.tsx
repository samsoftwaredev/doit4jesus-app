import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  margin: '5px 0px',
}));

const Title = styled(Typography)({
  textOverflow: 'ellipsis',
  height: '39px',
  fontSize: '1.7em',
});

const SubTitle = styled(Typography)({
  height: '15px',
  fontSize: '0.7em',
});

const Description = styled(Typography)({
  height: '15px',
  textOverflow: 'ellipsis',
  fontSize: '0.9em',
});

type Props = {
  title: string;
  description: string;
  subTitle?: string;
  onBack?: () => void;
};

const Card = ({ title, description, subTitle, onBack }: Props) => {
  return (
    <Container>
      <IconButton onClick={onBack}>
        <ArrowBackIosIcon />
      </IconButton>
      <div>
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
        <Title>{title}</Title>
        <Description variant="body2">{description}</Description>
      </div>
    </Container>
  );
};

export default Card;
