import FitScreenIcon from '@mui/icons-material/FitScreen';
import { IconButton, Tooltip } from '@mui/material';
import { usePathname } from 'next/navigation';

import { NAV_APP_LINKS } from '@/constants/nav';
import { useAudioContext } from '@/context/AudioContext';
import { useLanguageContext } from '@/context/LanguageContext';

const MusicVideo = () => {
  const { t } = useLanguageContext();
  const pathname = usePathname();
  const { goToEvent, audioPlayer } = useAudioContext();

  return (
    <Tooltip title={t.viewVideo}>
      <span>
        <IconButton
          color="info"
          disabled={
            pathname.includes(NAV_APP_LINKS.event.link) ||
            audioPlayer?.audio === undefined
          }
          onClick={goToEvent}
        >
          <FitScreenIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default MusicVideo;
