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
import { useEffect, useState } from "react";
import { Loading, Meta, PageNotFound } from "@/components";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { NAV_MAIN_LINKS } from "@/constants/nav";
import { db } from "@/class/index";
import { normalizePost } from "@/utils/normalizers";
import { ResourcePost } from "@/interfaces/index";
import { toast } from "react-toastify";

function ResourcesPost() {
  const router = useRouter();
  const [article, setArticle] = useState<ResourcePost>();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  const currentPage = article?.content?.sections[page];
  const isFirstPage = page <= 0;
  const isLastPage = article?.content?.sections?.length
    ? page >= article.content.sections.length - 1
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

  const getArticle = async () => {
    setIsLoading(true);
    const { slug } = router.query;
    if (typeof slug === "string") {
      let { data, error } = await db.getPosts().select("*").eq("slug", slug);
      if (data) setArticle(normalizePost(data)[0]);
      if (error) toast.error("Unable to display article");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getArticle();
  }, []);

  if (isLoading) return <Loading isPage={false} />;

  if (!article?.content) return <PageNotFound />;

  const progress = (page / (article?.content.sections?.length - 1)) * 100;

  return (
    <MainLayout>
      <Meta pageTitle={article.content.title} />
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
            image={article.content.image}
            title={article.content.title}
          >
            <Typography p={2} fontWeight="strong" variant="h5">
              {article.content.title}
            </Typography>
          </CardMedia>
        </Box>
        <Typography py={2} variant="h4">
          {currentPage?.title}
        </Typography>
        <Typography>{currentPage?.body}</Typography>
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
