import styles from "./confessionGuide.module.scss";
import CardDeck from "../../components/CardDeck";
import { CardProps } from "@/interfaces/index";
import { TitleNav } from "../../components";
import { useState } from "react";
import examOfConscience from "../../data/examOfConscience.json";
import { MainLayout } from "@/layouts/index";
import { useRouter } from "next/router";
import { NAV_APP_LINKS } from "@/constants/nav";

const overview: CardProps[] = examOfConscience;

const ConfessionGuide = () => {
  const router = useRouter();
  const [cards, setCards] = useState(overview);

  const onEnd = () => {
    // TODO: do something on end
  };

  const handelBack = () => {
    router.push(NAV_APP_LINKS.app.link);
  };

  return (
    <MainLayout>
      <TitleNav
        onBack={handelBack}
        title="Confession"
        description="A Step by Step Guide"
      />
      <CardDeck items={cards} onEnd={onEnd} />
    </MainLayout>
  );
};

export default ConfessionGuide;
