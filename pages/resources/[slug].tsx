import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Typography,
} from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Loading, Meta, PageNotFound } from '@/components';
import { MainLayout } from '@/components/Templates';
import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { ResourcePost } from '@/interfaces';
import { fetchPostBySlug } from '@/services/postsApi';
import { normalizePost } from '@/utils';

const ResourcesPost: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { t } = useLanguageContext();

  const [article, setArticle] = useState<ResourcePost>();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  const sections = article?.content?.sections ?? [];
  const totalPages = sections.length;
  const currentPage = sections[page];
  const isFirstPage = page <= 0;
  const isLastPage = totalPages > 0 ? page >= totalPages - 1 : false;

  const onPrev = () => {
    setPage((p) => p - 1);
  };

  const onNext = () => {
    setPage((p) => p + 1);
  };

  const onFinish = () => {
    router.push(NAV_MAIN_LINKS.resources.link);
  };

  useEffect(() => {
    if (typeof slug !== 'string') return;

    const getArticle = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPostBySlug(slug);
        const normalized = data ? normalizePost(data) : [];
        if (normalized.length > 0) {
          setArticle(normalized[0]);
        }
      } catch (error) {
        console.error('Error in resources/[slug] (getArticle):', error);
        toast.error(t.unableToDisplayArticle);
      } finally {
        setIsLoading(false);
      }
    };

    getArticle();
  }, [slug]);

  if (isLoading) return <Loading />;

  if (!article?.content) return <PageNotFound />;

  const progress = totalPages > 1 ? (page / (totalPages - 1)) * 100 : 100;

  return (
    <MainLayout>
      <Meta pageTitle={article.content.title} />
      <LinearProgress variant="determinate" value={progress} />
      <Container maxWidth="sm">
        <Box>
          <CardMedia
            sx={{
              height: 240,
              textAlign: 'right',
              color: 'common.white',
              textShadow: (theme) =>
                `1px 1px 2px ${theme.palette.common.black}`,
            }}
            image={article.content.image}
            title={article.content.title}
          >
            <Typography p={2} fontWeight="bold" variant="h5">
              {article.content.title}
            </Typography>
          </CardMedia>
        </Box>

        {currentPage?.image && (
          <Box mt={2}>
            <CardMedia
              sx={{ height: 180, borderRadius: 1 }}
              image={currentPage.image}
              title={currentPage.imgAlt || currentPage.title}
            />
          </Box>
        )}

        {currentPage?.title && (
          <Typography py={2} variant="h4">
            {currentPage.title}
          </Typography>
        )}

        <Typography>{currentPage?.body}</Typography>

        {currentPage?.references && currentPage.references.length > 0 && (
          <Box mt={2}>
            {currentPage.references.map(({ url, resource }) => (
              <Link
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                display="block"
                variant="body2"
              >
                {resource}
              </Link>
            ))}
          </Box>
        )}

        <Grid
          display="flex"
          alignItems="center"
          mt={2}
          justifyContent="space-between"
        >
          <IconButton
            disabled={isFirstPage}
            onClick={onPrev}
            aria-label="Previous section"
            sx={{ scale: 2.2 }}
          >
            <ArrowCircleLeftIcon color="primary" />
          </IconButton>

          <Typography variant="body2" sx={{ mx: 1 }}>
            {page + 1} / {totalPages}
          </Typography>

          {!isLastPage ? (
            <IconButton
              onClick={onNext}
              aria-label="Next section"
              sx={{ scale: 2.2 }}
            >
              <ArrowCircleRightIcon color="primary" />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={onFinish}
              size="small"
            >
              {t.completed}
            </Button>
          )}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default ResourcesPost;
