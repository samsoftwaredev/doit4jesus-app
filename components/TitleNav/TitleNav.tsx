import styles from "./titleNav.module.scss";
import { Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import { css } from "@/utils/helpers";

type Props = { title: string; description: string };

const Card = ({ title, description }: Props) => {
  return (
    <div className={styles.container}>
      <Link
        href={"/app"}
        className={css(styles.button, "button-link button-circle")}
      >
        <ArrowBackIosIcon />
      </Link>
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
