import styles from "./titleNav.module.scss";
import { Grid, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { css } from "@/utils/helpers";

type Props = { title: string; description: string; onBack: () => void };

const TitleNav = ({ title, description, onBack }: Props) => {
  return (
    <Grid justifyContent="flex-start" my="5px">
      <IconButton onClick={onBack}>
        <ArrowBackIosIcon />
      </IconButton>
      <div className="content">
        <h4 className={css(styles.title)}>{title}</h4>
        <div className={styles.description}>{description}</div>
      </div>
    </Grid>
  );
};

export default TitleNav;
