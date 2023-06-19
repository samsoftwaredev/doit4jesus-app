import { CardProps } from "@/interfaces/index";
import styles from "./cardCounter.module.scss";
import { css } from "@/utils/helpers";

interface Props {
  cards: CardProps[];
  counter: number;
  theme?: "dark" | "light";
}

const CardCounter = ({ cards, counter, theme = "dark" }: Props) => {
  if (cards.length === 1) return null;
  if (Array.isArray(cards)) {
    const total = cards.length;
    return (
      <div className={css(styles.container, styles[`theme-${theme}`])}>
        {counter}/{total}
      </div>
    );
  }
  return null;
};

export default CardCounter;
