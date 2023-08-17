import { useId, useState } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import Card from "../Card";
import styles from "./cardDeck.module.scss";
import { CardProps } from "@/interfaces/index";
import { css } from "@/utils";
import { CardCounter } from "..";
import { Check, Close, Undo } from "@mui/icons-material";

interface Props {
  items: CardProps[];
  onEnd?: Function;
}

const CardDeck = ({ items, onEnd }: Props) => {
  const [counter, setCounter] = useState(0);
  const isFirstCard = counter === 0;
  const isLastCard = counter >= items.length - 1;

  const onNextCard = () => {
    if (counter < items.length - 1) setCounter((counter) => counter + 1);
    if (counter === items.length - 1 && typeof onEnd === "function") onEnd();
  };

  const onPrevCard = () => {
    if (counter > 0) setCounter((counter) => counter - 1);
  };

  const onSinAcknowledged = () => {
    onNextCard();
  };

  const onSinRejected = () => {
    onNextCard();
  };

  const deckOfCards = items.map((data, index) => {
    let classNames = "";
    const isPrevPrevCard = index === counter - 2;
    const isPrevCard = index === counter - 1;
    const isNextCard = index === counter + 1;
    const isNextNextCard = index === counter + 2;
    const lastCard = items.length - 1;

    if (index === counter) {
      classNames = styles.currentCard;
    }
    if (counter >= 2 && isPrevPrevCard) {
      classNames = styles.prevPrevCard;
    }
    if (counter >= 1 && isPrevCard) {
      classNames = styles.prevCard;
    }
    if (counter + 1 <= lastCard && isNextCard) {
      classNames = styles.nextCard;
    }
    if (counter + 2 <= lastCard && isNextNextCard) {
      classNames = styles.nextNextCard;
    }
    const props = { ...data, classNames: css(classNames, styles.card) };
    return <Card key={useId()} {...props} />;
  });

  return (
    <div className={styles.container}>
      <CardCounter counter={counter + 1} cards={items} />
      <div className={styles.deck}>{deckOfCards}</div>
      <div className={styles.buttons}>
        <Tooltip title="Yes">
          <span>
            <IconButton
              disabled={isLastCard}
              onClick={onSinAcknowledged}
              aria-label="Yes"
              color="primary"
            >
              <Check fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Undo">
          <span>
            <IconButton
              disabled={isFirstCard}
              onClick={onPrevCard}
              aria-label="Undo"
              color="primary"
            >
              <Undo fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="No">
          <span>
            <IconButton
              disabled={isLastCard}
              onClick={onSinRejected}
              aria-label="No"
              color="primary"
            >
              <Close fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default CardDeck;
