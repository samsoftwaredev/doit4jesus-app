import { MainLayout } from "@/components/Templates/index";
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
import { Meta, PageNotFound } from "@/components";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { NAV_MAIN_LINKS } from "@/constants/nav";

function ResourcesPost() {
  const router = useRouter();
  const resourceId = router.query.slug;
  const article = articlesList.find(({ id }) => id === resourceId);
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
    router.push(NAV_MAIN_LINKS.resources.link);
  };

  if (!article) return <PageNotFound />;

  const progress = (page / (article?.sections?.length - 1)) * 100;

  return (
    <MainLayout>
      <Meta pageTitle={article.title} />
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
            <Typography p={2} fontWeight="strong" variant="h5">
              {article.title}
            </Typography>
          </CardMedia>
        </Box>
        <Typography py={2} variant="h4">
          {currentPage?.title}
        </Typography>
        <Typography>{currentPage?.description}</Typography>
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

export default ResourcesPost;
