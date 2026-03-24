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
  Typography,
} from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { db } from '@/classes';
import { Loading, Meta, PageNotFound } from '@/components';
import { MainLayout } from '@/components/Templates';
import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { ResourcePost } from '@/interfaces';
import { normalizePost } from '@/utils';

const ResourcesPost: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { t } = useLanguageContext();

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
    try {
      if (typeof slug === 'string') {
        let { data, error } = await db.getPosts().select('*').eq('slug', slug);
        if (error) {
          console.error('Error in resources/[slug] (getArticle):', error);
          toast.error(t.unableToDisplayArticle);
        }
        if (data) setArticle(normalizePost(data)[0]);
      }
    } catch (error) {
      console.error('Error in resources/[slug] (getArticle):', error);
      toast.error(t.unableToDisplayArticle);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getArticle();
  }, []);

  if (isLoading) return <Loading />;

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
              {t.completed}
            </Button>
          )}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default ResourcesPost;
