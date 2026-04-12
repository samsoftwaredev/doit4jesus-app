import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Loading, Meta } from '@/components';
import { MainLayout } from '@/components/Templates';
import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { ResourcePost } from '@/interfaces';
import { fetchPosts } from '@/services/postsApi';
import { normalizePost } from '@/utils';

const Resources: NextPage = () => {
  const { t } = useLanguageContext();
  const [resources, setResources] = useState<ResourcePost[]>();
  const [isLoading, setIsLoading] = useState(true);

  const getAllResources = async () => {
    try {
      const data = await fetchPosts();
      if (data) setResources(normalizePost(data));
    } catch (error) {
      console.error('Error in resources/index (getAllResources):', error);
      toast.error(t.unableToGetResources);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllResources();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <MainLayout>
      <Meta pageTitle={t.resources} />
      <Container maxWidth="lg">
        <Typography variant="h4">{t.resources}</Typography>
        <Grid my={2} container spacing={2}>
          {resources?.map(({ content, slug }) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={slug}>
              <Card>
                <CardActionArea
                  component={NextLink}
                  href={`${NAV_MAIN_LINKS.resources.link}/${slug}`}
                >
                  <CardMedia sx={{ height: 140 }} image={content.image} />
                  <CardContent>
                    <Typography gutterBottom component="h5">
                      {content.title}
                    </Typography>
                    <Typography component="p" color="text.secondary">
                      {content.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default Resources;
