import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Card = styled(Box)(({ theme }) => ({
  height: '100%',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '10px',
  padding: '20px',
  overflow: 'hidden',
}));

export default Card;
