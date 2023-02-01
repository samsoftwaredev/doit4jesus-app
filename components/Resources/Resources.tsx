import { Box, Typography } from "@mui/material";

const resources = [
  {
    id: "1",
    thumbnail: "",
    title: "Rosary",
    description:
      "Daily Prayer: Complete Catholic and Christian Guide to Praying Every Day",
  },
  {
    id: "2",
    thumbnail: "",
    title:
      "The Solemnity of Mary, Mother of God 2023 – Church Teaching, Mass Readings, Prayers",
    description:
      "New Year’s is a day of new beginnings, goals, celebrations, and reflections. And it’s also one of the most special days in the Church – ",
  },
  {
    id: "3",
    thumbnail: "",
    title:
      "Daily Prayer: Complete Catholic and Christian Guide to Praying Every Day",
    description: `Our habits matter. Just as habits (good and bad) can impact our health, our career and our relationships with others, they can also affect our prayer life and our relationship with God.
      And our relationship with God can imp...`,
  },
];

const Resources = () => {
  return (
    <Box className="">
      {resources.map(({ id, thumbnail, title, description }) => (
        <Box key={id}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="h6">{description}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Resources;
