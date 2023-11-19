import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import styles from "./dashboard.module.scss";
import { css } from "@/utils/helpers";
import Link from "next/link";

const eventList = [
  {
    title: "Rosary for the unborn this is a very long title and unusual",
    eventDate: "12/12/2022",
    description: `Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry.Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry.Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry. Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry.Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry.Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry. Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry.Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry.Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry.`,
    image:
      "https://www.catholicartandjewelry.com/cdn/shop/products/1ee94a8a-f769-5cb3-9f29-9788c31f02f7.jpg?v=1667256060&width=600",
  },
  {
    title:
      "Rosary for souls of pulgatory this is also a unsually very long title that i'm posting",
    eventDate: "12/12/2022",
    description: `Lorem Ipsum is simply dummy text of 
    the printing and typesetting industry. 
    Lorem Ipsum has been the industry's 
    standard dummy text ever since the 
    1500s, when an unknown printer took 
    a galley of type and scrambled it to 
    make a type specimen book. n unknown printer took 
    a galley of type and scrambled it to 
    make a type specimen book. n unknown printer took 
    a galley of type and scrambled it to 
    make a type specimen book.`,
    image:
      "https://www.catholicartandjewelry.com/cdn/shop/products/a376e9bc-690c-53ce-bdf1-585abda90ff0_f78b317f-01cf-461d-8770-e2d0de28479a.jpg?v=1667256678&width=1100",
  },
  {
    title: "Rosary for God's mercy",
    eventDate: "12/12/2022",
    description: `Lorem Ipsum is simply dummy text of 
    the printing and typesetting industry. 
    Lorem Ipsum has been the industry's 
    standard dummy text ever since the 
    1500s, when an unknown printer took 
    a galley of type and scrambled it to 
    make a type specimen book.`,
    image:
      "https://www.catholicartandjewelry.com/cdn/shop/products/29992387-e6c3-53a6-92cd-6dfbd87dbfa6.jpg?v=1667269994&width=823",
  },
  {
    title: "Rosary for the forgiveness of sins",
    eventDate: "12/12/2022",
    description: `Lorem Ipsum is simply dummy text of 
    the printing and typesetting industry. 
    Lorem Ipsum has been the industry's 
    standard dummy text ever since the 
    1500s, when an unknown printer took 
    a galley of type and scrambled it to 
    make a type specimen book.`,
    image:
      "https://www.catholicartandjewelry.com/cdn/shop/products/5c4e6928-934a-5522-be0f-78cdd7be3683.jpg?v=1667260147&width=600",
  },
  {
    title: "Rosary for cease of war",
    eventDate: "12/12/2022",
    description: `Lorem Ipsum is simply dummy text of 
    the printing and typesetting industry. 
    Lorem Ipsum has been the industry's 
    standard dummy text ever since the 
    1500s, when an unknown printer took 
    a galley of type and scrambled it to 
    make a type specimen book.`,
    image:
      "https://www.catholicartandjewelry.com/cdn/shop/products/29992387-e6c3-53a6-92cd-6dfbd87dbfa6.jpg?v=1667269994&width=823",
  },
];

const Dashboard = () => {
  return (
    <Box className={styles.container}>
      {eventList.map(({ title, description, eventDate, image }, index) => (
        <Card
          component={Link}
          href="app/live-event"
          className={css(index === 0 ? styles.mainCard : styles.card)}
        >
          <CardMedia
            className={css(index === 0 ? styles.mainImage : styles.cardImage)}
            component="img"
            image={image}
            alt={title}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography
                component="div"
                variant="h5"
                className={css(index === 0 ? styles.mainTitle : styles.title)}
              >
                {title}
              </Typography>
              <Typography component="div" variant="h6" className={styles.date}>
                {eventDate}
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                className={styles.description}
              >
                {description}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default Dashboard;
