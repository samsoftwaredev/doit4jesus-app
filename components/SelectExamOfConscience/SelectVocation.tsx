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

import { useLanguageContext } from '@/context/LanguageContext';

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

const vocations: Omit<VocationOption, 'label' | 'description'>[] = [
  {
    value: 'married',
    Icon: FavoriteIcon,
  },
  {
    value: 'single',
    Icon: PersonIcon,
  },
  {
    value: 'religious',
    Icon: ChurchIcon,
  },
];

interface Props {
  onVocationSelected: (vocation: Vocation) => void;
}

const SelectVocation = ({ onVocationSelected }: Props) => {
  const { t } = useLanguageContext();

  const vocationLabels: Record<
    Vocation,
    { label: string; description: string }
  > = {
    married: { label: t.married, description: t.marriedDescription },
    single: { label: t.single, description: t.singleDescription },
    religious: { label: t.religiousOrder, description: t.religiousDescription },
  };

  return (
    <>
      <Typography my={2} color="text.primary" variant="h5">
        {t.selectStateInLife}
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {vocations.map(({ value, Icon }) => (
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
                <Typography variant="h5">
                  {vocationLabels[value].label}
                </Typography>
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
                  {vocationLabels[value].description}
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
