import styles from "./confessionGuide.module.scss";
import CardDeck from "../../components/CardDeck";
import { CardProps } from "@/interfaces/index";
import { TitleNav } from "../../components";
import examOfConscience from "../../data/examOfConscience.json";
import { useRouter } from "next/router";
import { NAV_APP_LINKS } from "@/constants/nav";
import { Alert, Container, LinearProgress } from "@mui/material";
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
        <Alert severity="warning">
          A warning should be given to souls who are inclined to scrupulosity.
          Such souls are disturbed by reading lists of sins, because they
          wrongly think themselves to guilty where they are not. They should
          have permissions of their confessor before they start the examination.
        </Alert>
        <Alert severity="info">
          Note that <b>mortal sin</b> is not committed unless three conditions
          are preset:&nbsp;
          <b>
            sufficient reflection, full consent of will, and a violation of
            God's law in a serious matter
          </b>
          .
        </Alert>
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
