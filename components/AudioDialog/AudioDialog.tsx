import { css } from "@/utils/helpers";
import { Box, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import styles from "./audioDialog.module.scss";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
}

const AudioDialog = ({
  children,
  title = "",
  isOpen = false,
  onClose,
}: Props) => {
  return (
    <Box className={css(isOpen ? styles.open : styles.close, styles.container)}>
      <Box className={styles.header}>
        <Typography variant="h5" component="h3">
          {title}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <Box className={styles.content}>{children}</Box>
    </Box>
  );
};

export default AudioDialog;
