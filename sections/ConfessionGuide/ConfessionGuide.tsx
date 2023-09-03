import styles from "./confessionGuide.module.scss";
import CardDeck from "../../components/CardDeck";
import { CardProps } from "@/interfaces/index";
import { TitleNav } from "../../components";
import examOfConscience from "../../data/examOfConscience.json";
import { useRouter } from "next/router";
import { NAV_APP_LINKS } from "@/constants/nav";
import { Container } from "@mui/material";

const ConfessionGuide = () => {
  const sins: CardProps[] = examOfConscience;
  const router = useRouter();

  const handelBack = () => {
    router.push(NAV_APP_LINKS.app.link);
  };

  return (
    <Container maxWidth="sm">
      <TitleNav
        onBack={handelBack}
        title="Confession"
        description="A Step by Step Guide"
      />
      <CardDeck steps={sins} />
    </Container>
  );
};

export default ConfessionGuide;
