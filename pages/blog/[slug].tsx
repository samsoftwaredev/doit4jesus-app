import { MainLayout } from "@/layouts/index";
import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import articlesList from "@/data/articles.json";
import { useState } from "react";
import { HomeNavbar, PageNotFound } from "@/components";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { NAV_MAIN_LINKS } from "@/constants/nav";
import Image from "next/image";

function BlogPost() {
  const router = useRouter();
  const blogId = router.query.slug;
  const article = articlesList.find(({ id }) => id === blogId);
  const [page, setPage] = useState(0);

  const currentPage = article?.sections[page];
  const isFirstPage = page <= 0;
  const isLastPage = article?.sections?.length
    ? page >= article.sections.length - 1
    : false;

  const onPrev = () => {
    setPage((pag) => pag - 1);
  };

  const onNext = () => {
    setPage((pag) => pag + 1);
  };

  const onFinish = () => {
    router.push(NAV_MAIN_LINKS.blog.link);
  };

  if (!article) return <PageNotFound />;

  const progress = (page / (article?.sections?.length - 1)) * 100;

  return (
    <MainLayout topNavbar={<HomeNavbar />}>
      <LinearProgress variant="determinate" value={progress} />
      <Container maxWidth="sm">
        <Box>
          <CardMedia
            sx={{
              height: 240,
              textAlign: "right",
              color: "white",
              textShadow: `1px 1px 2px black`,
            }}
            image={article.image}
            title={article.title}
          >
            <h5>{article.title}</h5>
          </CardMedia>
        </Box>
        <h4>{currentPage?.title}</h4>
        <p>{currentPage?.description}</p>
        <Grid>
          <IconButton disabled={isFirstPage} onClick={onPrev}>
            <ArrowCircleLeftIcon />
          </IconButton>
          {!isLastPage ? (
            <IconButton onClick={onNext}>
              <ArrowCircleRightIcon />
            </IconButton>
          ) : (
            <Button variant="contained" onClick={onFinish}>
              Completed
            </Button>
          )}
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default BlogPost;
