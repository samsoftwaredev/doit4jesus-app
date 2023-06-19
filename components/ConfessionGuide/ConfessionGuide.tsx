import styles from "./confessionGuide.module.scss";
import CardDeck from "../CardDeck";
import { CardProps } from "@/interfaces/index";
import { TitleNav } from "..";
import { useState } from "react";

const overview: CardProps[] = [
  {
    title: "How to Confess as a Catholic?",
    description: (
      <p>
        Your sins are entirely personal. There’s no exact guide for what you
        ought to confess. No universal playbook for the sins you need to atone
        for.
        <br />
        The best guide is your conscience.
        <br />
        Don’t obsess over identifying every small thing that could possibly be
        considered a sin. Prayerfully reflect on major actions that could be
        considered sinful through the lens of the 10 Commandments.
        <br />
        This app will help you evaluate your conscience.
        <br />
        <br />
        As you do this, remember God’s love and mercy for you.
      </p>
    ),
  },
];

const sinsFirstCommandment: CardProps[] = [
  {
    title: "Contraception, IVF and Abortion.",
    description: (
      <p>
        Most readers here know that abortion is murder. But many Catholics do
        not know that contraception (in marriage or out of marriage) is a mortal
        sin. Both sterilization (of the man or woman) and/or the condom (male or
        female) is a mortal sin. These must be confessed to enter sanctifying
        grace.
      </p>
    ),
  },
  {
    title:
      "Masturbation and/or Pornography, before marriage or within marriage.",
    description: (
      <p>
        Some saints have pointed out that sins which exacted physical death in
        the Old Covenant (Judaism) are frequently the sins that cause spiritual
        death in the New Testament (Catholicism.)
      </p>
    ),
  },
  {
    title: "Immodesty, Including Wearing Leggings and Short Shorts.",
    description: (
      <p>
        I could quote countless saints here, but the most succinct description
        is what the Mother of God said at Fatima: “Certain fashions will be
        introduced that will offend Our Lord very much.”—Our Lady of Fatima,
        1917. What are these certain fashions? If not leggings and short shorts,
        then what? Strangely, many Catholic women know this quote from Fatima,
        but they only apply it to women who wear less than themselves.
      </p>
    ),
  },
  {
    title: "Before marriage, making-out or anything more passionate than that.",
    description: (
      <p>
        St. Thomas Aquinas writes: “I answer that a thing is said to be a mortal
        works. One may sin in two ways. First, by reason of its species, and in
        this way a kiss, caress, or touch does not, of its very nature, imply a
        mortal sin, for it is possible to do such things without lustful
        pleasure, either as being the custom of one’s country, or on account of
        some obligation or reasonable cause.
      </p>
    ),
  },
  {
    title: "In marriage, anything unnatural.",
    description: (
      <p>
        The two greatest moral theologians of the Church, St. Thomas Aquinas and
        St. Alphonsus Ligouri both teach that anal sex in marriage is a mortal
        sin. Even Catholic Answers once had an article explaining that any form
        of insertion-based oral-sex is a mortal sin—even in marriage.
      </p>
    ),
  },
];

const ConfessionGuide = () => {
  const [cards, setCards] = useState(overview);
  const onEnd = () => {
    setCards(sinsFirstCommandment);
  };
  return (
    <div className={styles.container}>
      <TitleNav title="Confession" description="A Step by Step Guide" />
      <CardDeck items={cards} onEnd={onEnd} />
    </div>
  );
};

export default ConfessionGuide;
