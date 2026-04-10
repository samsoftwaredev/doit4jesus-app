import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Divider,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';

import { ROSARY_LENGTH } from '@/constants/mysteries';
import { useLanguageContext } from '@/context/LanguageContext';
import { LANG } from '@/interfaces';
import { theme } from '@/styles/mui-overwrite';

const STORAGE_KEY = 'rosaryLength';

const MusicSettings = () => {
  const { t, lang, setLang } = useLanguageContext();
  const [open, setOpen] = useState(false);
  const [rosaryLength, setRosaryLength] = useState<string>(
    ROSARY_LENGTH.medium,
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === ROSARY_LENGTH.short || saved === ROSARY_LENGTH.medium) {
      setRosaryLength(saved);
    }
  }, []);

  const handleRosaryLengthChange = (value: string) => {
    setRosaryLength(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  const handleLanguageChange = (value: string) => {
    setLang(value as LANG);
  };

  return (
    <>
      <Tooltip title={t.settings}>
        <span>
          <IconButton
            aria-label={t.settings}
            onClick={() => setOpen(true)}
            sx={{ color: theme.palette.info.dark }}
          >
            <SettingsIcon />
          </IconButton>
        </span>
      </Tooltip>

      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Box sx={{ p: 3, maxWidth: 480, mx: 'auto' }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            {t.settings}
          </Typography>

          {/* Rosary Type */}
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            {t.rosaryType}
          </Typography>
          <RadioGroup
            value={rosaryLength}
            onChange={(e) => handleRosaryLengthChange(e.target.value)}
          >
            <FormControlLabel
              value={ROSARY_LENGTH.medium}
              control={<Radio />}
              label={t.defaultRosary}
            />
            <FormControlLabel
              value={ROSARY_LENGTH.short}
              control={<Radio />}
              label={t.shortRosary}
            />
          </RadioGroup>

          <Divider sx={{ my: 2 }} />

          {/* Language */}
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            {t.language}
          </Typography>
          <Select
            value={lang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value={LANG.en}>🇺🇸 {t.english}</MenuItem>
            <MenuItem value={LANG.es}>🇪🇸 {t.spanish}</MenuItem>
          </Select>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default MusicSettings;
