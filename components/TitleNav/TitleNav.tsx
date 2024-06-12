import styles from "./titleNav.module.scss";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { css } from "@/utils/helpers";

type Props = {
  title: string;
  description: string;
  subTitle?: string;
  onBack?: () => void;
};

const Card = ({ title, description, subTitle, onBack }: Props) => {
  return (
    <div className={styles.container}>
      <IconButton onClick={onBack}>
        <ArrowBackIosIcon />
      </IconButton>
      <div className="content">
        {subTitle && (
          <Typography className={styles.subTitle}>{subTitle}</Typography>
        )}
        <Typography component="h2" className={css(styles.title)}>
          {title}
        </Typography>
        <Typography variant="body2" className={styles.description}>
          {description}
        </Typography>
      </div>
    </div>
  );
};

export default Card;
