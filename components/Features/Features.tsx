import { Box, Typography } from "@mui/material";

const features = [
  {
    thumbnail: "",
    title: "Find Peace.",
    description:
      "Let God bring you His peace with the Calm Praylist, Daily Gospel, Rosary, & Night Prayer",
  },
  {
    thumbnail: "",
    title: "Pray Your Way.",
    description:
      "Choose from 5,000+ sessions, 5-30 minute lengths, 3 guides, and 9 background music options including Gregorian chant",
  },
  {
    thumbnail: "",
    title: "Build a Habit.",
    description:
      "Build a real habit of prayer every day by setting goals, journaling, tracking streaks, and setting reminders",
  },
];

const Features = () => {
  return (
    <Box className="">
      {features.map(({ thumbnail, title, description }) => (
        <Box>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Features;
