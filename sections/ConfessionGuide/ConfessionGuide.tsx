import styles from "./confessionGuide.module.scss";
import CardDeck from "../../components/CardDeck";
import { CardProps } from "@/interfaces/index";
import { TitleNav } from "../../components";
import examOfConscience from "../../data/examOfConscience.json";
import { useRouter } from "next/router";
import { NAV_APP_LINKS } from "@/constants/nav";
import { Container, LinearProgress } from "@mui/material";
import React from "react";

const ConfessionGuide = () => {
  const sins: CardProps[] = examOfConscience;
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const progress = (activeStep / sins.length) * 100;

  const handelBack = () => {
    router.push(NAV_APP_LINKS.app.link);
  };

  return (
    <>
      <LinearProgress variant="determinate" value={progress} />
      <Container maxWidth="sm">
        <TitleNav
          onBack={handelBack}
          title="Confession"
          description="A Step by Step Guide"
        />
        <CardDeck
          steps={sins}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </Container>
    </>
  );
};

export default ConfessionGuide;
