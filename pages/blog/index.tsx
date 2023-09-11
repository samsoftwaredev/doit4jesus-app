import type { NextPage } from "next";
import { MainLayout } from "@/layouts";
import { HomeNavbar } from "@/components";
import articlesList from "@/data/articles.json";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { NAV_MAIN_LINKS } from "@/constants/nav";

const Blog: NextPage = () => {
  const router = useRouter();
  const articles = articlesList;

  const goToBlog = (id: string) => {
    router.push(NAV_MAIN_LINKS.blog.link + "/" + id);
  };

  return (
    <MainLayout topNavbar={<HomeNavbar />}>
      <Container maxWidth="lg">
        <Grid container>
          {articles.map(({ title, description, image, id }) => (
            <Grid md={3} key={id} onClick={() => goToBlog(id)}>
              <Card>
                <CardMedia
                  sx={{ height: 140 }}
                  image={image}
                  title="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom component="h5">
                    {title}
                  </Typography>
                  <Typography component="p" color="text.secondary">
                    {description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default Blog;
