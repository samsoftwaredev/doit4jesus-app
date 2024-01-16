import { Box, Card, CardContent, Typography } from "@mui/material";
import styles from "./dashboard.module.scss";
import { css } from "@/utils/helpers";
import virginPeaceful from "@/public/assets/images/art/virginPeaceful.jpeg";
import maryPraying from "@/public/assets/images/art/maryPraying.jpeg";
import stJosephJesus from "@/public/assets/images/art/stJosephJesus.jpeg";
import virginPrayingSun from "@/public/assets/images/art/virginPrayingSun.jpeg";
import saintJoseph from "@/public/assets/images/art/saintJoseph.jpeg";

import Link from "next/link";
import Image from "next/image";

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
    image: virginPeaceful,
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
    image: maryPraying,
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
    image: saintJoseph,
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
    image: stJosephJesus,
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
    image: virginPrayingSun,
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
          <Box sx={{ maxHeight: "190px" }}>
            <Image
              className={css(index === 0 ? styles.mainImage : styles.cardImage)}
              src={image}
              alt={title}
            />
          </Box>
          <Box className={styles.eventDetails}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography
                component="div"
                variant="h5"
                className={css(index === 0 ? styles.mainTitle : styles.title)}
              >
                {title}
              </Typography>
              {eventDate && (
                <Typography
                  component="div"
                  variant="h6"
                  className={styles.date}
                >
                  {eventDate}
                </Typography>
              )}
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
