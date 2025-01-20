import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { db } from '@/classes';
import { Meta } from '@/components';
import { MainLayout } from '@/components/Templates';
import { NAV_MAIN_LINKS } from '@/constants/nav';
import { ResourcePost } from '@/interfaces';
import { normalizePost } from '@/utils/normalizers';

const Resources: NextPage = () => {
  const [resources, setResources] = useState<ResourcePost[]>();
  const router = useRouter();

  const goToResources = (id: string) => {
    router.push(NAV_MAIN_LINKS.resources.link + '/' + id);
  };

  const getAllResources = async () => {
    let { data, error } = await db.getPosts().select('*');
    if (data) setResources(normalizePost(data));
    if (error) toast.error('Unable to get resources');
  };

  useEffect(() => {
    getAllResources();
  }, []);

  if (!resources) return null;

  return (
    <MainLayout>
      <Meta pageTitle="Resources" />
      <Container maxWidth="lg">
        <Typography variant="h4">Resources</Typography>
        <Grid mt={2} display="flex" justifyContent="center" container>
          {resources.map(({ content, slug }) => (
            <Grid item md={4} key={slug} onClick={() => goToResources(slug)}>
              <Card>
                <CardMedia sx={{ height: 140 }} image={content.image} />
                <CardContent>
                  <Typography gutterBottom component="h5">
                    {content.title}
                  </Typography>
                  <Typography component="p" color="text.secondary">
                    {content.description}
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

export default Resources;
