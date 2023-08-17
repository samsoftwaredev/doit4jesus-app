import styles from "./confessionGuide.module.scss";
import CardDeck from "../CardDeck";
import { CardProps } from "@/interfaces/index";
import { TitleNav } from "..";
import { useState } from "react";
import examOfConscience from "../../data/examOfConscience.json";

const overview: CardProps[] = examOfConscience;

const ConfessionGuide = () => {
  const [cards, setCards] = useState(overview);
  const onEnd = () => {
    // TODO: do something on end
  };
  return (
    <div className={styles.container}>
      <TitleNav title="Confession" description="A Step by Step Guide" />
      <CardDeck items={cards} onEnd={onEnd} />
    </div>
  );
};

export default ConfessionGuide;
