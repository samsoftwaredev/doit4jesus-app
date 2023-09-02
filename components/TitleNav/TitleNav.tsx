import styles from "./titleNav.module.scss";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { css } from "@/utils/helpers";

type Props = { title: string; description: string; onBack: () => void };

const Card = ({ title, description, onBack }: Props) => {
  return (
    <div className={styles.container}>
      <IconButton onClick={onBack}>
        <ArrowBackIosIcon />
      </IconButton>
      <div className="content">
        <Typography variant="h4" className={css(styles.title)}>
          {title}
        </Typography>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
};

export default Card;
