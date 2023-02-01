import Image from "next/image";
import { Box, Typography } from "@mui/material";
import { findPeace, prayMore, prayWell } from "@/public/assets/images/hero";
import { Container, Item, Items } from "./features.style";

const features = [
  {
    thumbnail: findPeace,
    title: "Find Peace.",
    description:
      "Let God bring you His peace with the Calm Praylist, Daily Gospel, Rosary, & Night Prayer",
  },
  {
    thumbnail: prayWell,
    title: "Pray Your Way.",
    description:
      "Choose from 5,000+ sessions, 5-30 minute lengths, 3 guides, and 9 background music options including Gregorian chant",
  },
  {
    thumbnail: prayMore,
    title: "Build a Habit.",
    description:
      "Build a real habit of prayer every day by setting goals, journaling, tracking streaks, and setting reminders",
  },
];

const Features = () => {
  return (
    <Container>
      <div className="line" />
      <Typography className="title" variant="h5" gutterBottom>
        Let's do this together...
      </Typography>
      <Items>
        {features.map(({ thumbnail, title, description }) => (
          <Item key={title}>
            <Box px={5} className="imageContainer">
              <Image
                className="profileImage"
                alt={title}
                src={thumbnail}
                quality={100}
              />
            </Box>
            <Typography className="item-title" variant="h5" gutterBottom>
              {title}
            </Typography>
            <Typography
              className="description"
              variant="subtitle1"
              gutterBottom
            >
              {description}
            </Typography>
          </Item>
        ))}
      </Items>
    </Container>
  );
};

export default Features;
