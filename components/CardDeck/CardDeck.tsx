import { useState } from "react";
import { Button } from "@mui/material";
import Card from "../Card";
import styles from "./cardDeck.module.scss";
import { CardProps } from "@/interfaces/index";
import { css } from "@/utils";

interface Props {
  items: CardProps[];
}

const CardDeck = ({ items }: Props) => {
  const [counter, setCounter] = useState(0);

  const nextCard = () => {
    if (counter < items.length - 1) setCounter((counter) => counter + 1);
  };

  const prevCard = () => {
    if (counter > 0) setCounter((counter) => counter - 1);
  };

  const onSinAcknowledged = () => {
    nextCard();
  };

  const onSinRejected = () => {
    nextCard();
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
    return <Card {...props} />;
  });

  return (
    <div className={styles.container}>
      <div className={styles.deck}>{deckOfCards}</div>
      <div className={styles.buttons}>
        <Button onClick={prevCard}>Undo</Button>
        <Button onClick={onSinAcknowledged}>Yes</Button>
        <Button onClick={onSinRejected}>No</Button>
      </div>
    </div>
  );
};

export default CardDeck;
