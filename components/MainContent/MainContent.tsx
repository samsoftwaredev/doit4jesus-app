import { Ocean } from "@/components/index";
import styles from "./mainContent.module.scss";
import { css } from "@/utils/helpers";
import useWindowSize from "@/hooks/useWindowSize";
import { phoneViewWidth } from "@/constants/devices";

interface Props {
  children: JSX.Element[] | JSX.Element;
  alignContent?: "center" | "left" | "right";
}

const MainContent = ({ children, alignContent = "center" }: Props) => {
  const { width } = useWindowSize();
  const isPhone = typeof width === "number" ? width < phoneViewWidth : false;
  return (
    <div className={styles.container}>
      {!isPhone && <Ocean />}
      <div className={css(styles.content, styles[`content-${alignContent}`])}>
        {children}
      </div>
    </div>
  );
};

export default MainContent;
