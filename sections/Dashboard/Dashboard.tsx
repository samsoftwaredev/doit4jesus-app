import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import styles from "./dashboard.module.scss";

const eventList = [
  {
    title: "Rosary for the unborn",
    eventDate: new Date().toString(),
    description: `Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry. 
        Lorem Ipsum has been the industry's 
        standard dummy text ever since the 
        1500s, when an unknown printer took 
        a galley of type and scrambled it to 
        make a type specimen book.`,
    image: "",
  },
  {
    title: "Rosary for souls of pulgatory",
    eventDate: new Date().toString(),
    description: `Lorem Ipsum is simply dummy text of 
    the printing and typesetting industry. 
    Lorem Ipsum has been the industry's 
    standard dummy text ever since the 
    1500s, when an unknown printer took 
    a galley of type and scrambled it to 
    make a type specimen book.`,
    image: "",
  },
  {
    title: "Rosary for God's mercy",
    eventDate: new Date().toString(),
    description: `Lorem Ipsum is simply dummy text of 
    the printing and typesetting industry. 
    Lorem Ipsum has been the industry's 
    standard dummy text ever since the 
    1500s, when an unknown printer took 
    a galley of type and scrambled it to 
    make a type specimen book.`,
    image: "",
  },
  {
    title: "Rosary for the forgiveness of sins",
    eventDate: new Date().toString(),
    description: `Lorem Ipsum is simply dummy text of 
    the printing and typesetting industry. 
    Lorem Ipsum has been the industry's 
    standard dummy text ever since the 
    1500s, when an unknown printer took 
    a galley of type and scrambled it to 
    make a type specimen book.`,
    image: "",
  },
  {
    title: "Rosary for cease of war",
    eventDate: new Date().toString(),
    description: `Lorem Ipsum is simply dummy text of 
    the printing and typesetting industry. 
    Lorem Ipsum has been the industry's 
    standard dummy text ever since the 
    1500s, when an unknown printer took 
    a galley of type and scrambled it to 
    make a type specimen book.`,
    image: "",
  },
];

const Dashboard = () => {
  return (
    <Box className={styles.container}>
      {eventList.map(({ title, description, eventDate, image }) => (
        <Card key={title} sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {title}
              </Typography>
              <Typography component="div" variant="h5">
                {eventDate}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {description}
              </Typography>
            </CardContent>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image={image}
            alt="Live from space album cover"
          />
        </Card>
      ))}
    </Box>
  );
};

export default Dashboard;
