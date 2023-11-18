import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import styles from "./dashboard.module.scss";
import { css } from "@/utils/helpers";
import Link from "next/link";

const eventList = [
  {
    title: "Rosary for the unborn",
    eventDate: "12/12/2022",
    description: `Lorem Ipsum is simply dummy text of s
        the printing and typesetting industry.`,
    image:
      "https://www.catholicartandjewelry.com/cdn/shop/products/29992387-e6c3-53a6-92cd-6dfbd87dbfa6.jpg?v=1667269994&width=823",
  },
  {
    title: "Rosary for souls of pulgatory",
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
      "https://www.catholicartandjewelry.com/cdn/shop/products/29992387-e6c3-53a6-92cd-6dfbd87dbfa6.jpg?v=1667269994&width=823",
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
          href=""
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
              <Typography component="div" variant="h5">
                {title}
              </Typography>
              <Typography component="div" variant="h5">
                {eventDate}
              </Typography>
              <Typography variant="subtitle1" component="p">
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
