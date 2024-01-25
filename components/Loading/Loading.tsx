import styles from "./loading.module.scss";
import Logo from "../Logo";
import { CircularProgress } from "@mui/material";

interface Props {
  isPage?: boolean;
}

const Loading = ({ isPage = true }: Props) => {
  if (isPage) {
    return (
      <div className={styles.container}>
        <Logo type="white" />
        <CircularProgress sx={{ px: "1em" }} color="secondary" />
      </div>
    );
  }
  return <CircularProgress color="secondary" />;
};

export default Loading;
