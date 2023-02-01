import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { Container } from "./hero.style";

const Hero = () => {
  return (
    <Container>
      <div className="line" />
      <Typography className="title" variant="h1">
        Pray <span className="em">Every Day</span> this Year
      </Typography>
      <Typography variant="h6" gutterBottom>
        And for the rest of your life!
      </Typography>
      <Link className="cta" href="/app">
        Start Praying
      </Link>
    </Container>
  );
};

export default Hero;
