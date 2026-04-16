import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Button, Stack, Typography, alpha } from '@mui/material';

import { NAV_APP_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';

const NoDataAvailable = () => {
  const { t } = useLanguageContext();

  return (
    <Stack
      alignItems="center"
      spacing={2}
      py={6}
      sx={{
        borderRadius: 4,
        bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
        color: 'text.secondary',
      }}
    >
      <SearchOffIcon
        sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.4 }}
      />
      <Typography variant="h6" fontWeight={700}>
        {t.noDataAvailable}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {t.noDataDescription}
      </Typography>
      <Button
        variant="contained"
        color="success"
        href={NAV_APP_LINKS.dashboard.link}
      >
        {t.dashboard}
      </Button>
    </Stack>
  );
};

export default NoDataAvailable;
