import ChurchIcon from '@mui/icons-material/Church';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import {
  Box,
  Card,
  CardContent,
  Link,
  SvgIconProps,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ComponentType } from 'react';

type Vocation = 'married' | 'single' | 'religious';

const VocationCard = styled(Card)({
  borderRadius: '10px',
  transition: 'transform 300ms',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.01)',
  },
});

interface VocationOption {
  label: string;
  value: Vocation;
  description: string;
  Icon: ComponentType<SvgIconProps>;
}

const vocations: VocationOption[] = [
  {
    label: 'Married',
    value: 'married',
    description:
      'Examine your conscience in light of your duties as a spouse and parent, including fidelity, family life, and the sacrament of Matrimony.',
    Icon: FavoriteIcon,
  },
  {
    label: 'Single',
    value: 'single',
    description:
      'Examine your conscience regarding chastity, personal virtue, vocation discernment, and your responsibilities as a single person.',
    Icon: PersonIcon,
  },
  {
    label: 'Religious Order',
    value: 'religious',
    description:
      'Examine your conscience regarding the evangelical counsels of poverty, chastity, and obedience, and your duties in religious life and ministry.',
    Icon: ChurchIcon,
  },
];

interface Props {
  onVocationSelected: (vocation: Vocation) => void;
}

const SelectVocation = ({ onVocationSelected }: Props) => {
  return (
    <>
      <Typography my={2} color="text.primary" variant="h5">
        Select your state in life:
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {vocations.map(({ label, value, description, Icon }) => (
          <VocationCard
            key={value}
            sx={{ textDecoration: 'none' }}
            // @ts-expect-error MUI polymorphic component prop
            component={Link}
            onClick={() => onVocationSelected(value)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 2 }}>
              <Icon sx={{ fontSize: 48, color: 'primary.main' }} />
              <CardContent
                sx={{ flex: '1 0 auto', p: 0, '&:last-child': { pb: 0 } }}
              >
                <Typography variant="h5">{label}</Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {description}
                </Typography>
              </CardContent>
            </Box>
          </VocationCard>
        ))}
      </Box>
    </>
  );
};

export default SelectVocation;
