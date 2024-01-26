import styles from "./loading.module.scss";
import Logo from "../Logo";
import { Box, CircularProgress } from "@mui/material";

interface Props {
  isPage?: boolean;
}

const Loading = ({ isPage = true }: Props) => {
  if (isPage) {
    return (
      <Box className={styles.container}>
        <Box className={styles.content}>
          <Logo type="white" />
          <CircularProgress sx={{ px: "1em" }} color="secondary" />
        </Box>
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <CircularProgress color="secondary" />
    </Box>
  );
};

export default Loading;
