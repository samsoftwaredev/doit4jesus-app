import styles from "./loading.module.scss";
import Logo from "../Logo";
import { Box, CircularProgress } from "@mui/material";

interface Props {
  isFeature?: boolean;
}

const Loading = ({ isFeature = false }: Props) => {
  if (isFeature) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.content}>
        <Logo type="white" />
        <CircularProgress sx={{ px: "1em" }} color="secondary" />
      </Box>
    </Box>
  );
};

export default Loading;
