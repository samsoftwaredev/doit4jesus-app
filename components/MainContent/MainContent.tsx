import { Ocean } from "@/components/index";
import styles from "./mainContent.module.scss";
import { css } from "@/utils/helpers";
import useWindowSize from "@/hooks/useWindowSize";
import { desktopsViewWidth } from "@/constants/devices";

interface Props {
  children?: JSX.Element[] | JSX.Element;
  alignContent?: "center" | "left" | "right";
}

const MainContent = ({ children, alignContent = "center" }: Props) => {
  const { width } = useWindowSize();
  const isDesktop =
    typeof width === "number" ? width < desktopsViewWidth : false;
  return (
    <div className={styles.container}>
      {!isDesktop && <Ocean />}
      <div className={css(styles.content, styles[`content-${alignContent}`])}>
        {children}
      </div>
    </div>
  );
};

export default MainContent;
