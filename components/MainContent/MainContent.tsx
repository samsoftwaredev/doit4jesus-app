import { Ocean } from "@/components/index";
import styles from "./mainContent.module.scss";
import { css } from "@/utils/helpers";

interface Props {
  children?: JSX.Element[] | JSX.Element;
  alignContent?: "center" | "left" | "right";
}

const MainContent = ({ children, alignContent = "center" }: Props) => {
  return (
    <div className={styles.container}>
      <Ocean />
      <div className={css(styles.content, styles[`content-${alignContent}`])}>
        {children}
      </div>
    </div>
  );
};

export default MainContent;
