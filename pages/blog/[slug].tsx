import { MainLayout } from "@/layouts/index";
import { Button, Container, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import articlesList from "@/data/articles.json";
import { useState } from "react";
import { HomeNavbar } from "@/components/Navbars";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { NAV_MAIN_LINKS } from "@/constants/nav";

function BlogPost() {
  const router = useRouter();
  const blogId = router.query.slug;
  const article = articlesList.find(({ id }) => id === blogId);
  const [page, setPage] = useState(0);
  const isFirstPage = page <= 0;
  const isLastPage = article?.sections?.length
    ? page >= article.sections.length - 1
    : false;

  const currentPage = article?.sections[page];

  const onPrev = () => {
    setPage((pag) => pag - 1);
  };

  const onNext = () => {
    setPage((pag) => pag + 1);
  };

  const onFinish = () => {
    router.push(NAV_MAIN_LINKS.blog.link);
  };

  if (!article) {
    return <p>No Article</p>;
  }

  return (
    <MainLayout topNavbar={<HomeNavbar />}>
      <Container maxWidth="sm">
        <Typography variant="h6">{article.title}</Typography>
        <Typography variant="h4">{currentPage?.title}</Typography>
        <Typography>{currentPage?.description}</Typography>
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
      </Container>
    </MainLayout>
  );
}

export default BlogPost;
