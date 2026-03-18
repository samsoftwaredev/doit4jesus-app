import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { db } from '@/classes';
import { Meta } from '@/components';
import { MainLayout } from '@/components/Templates';
import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { ResourcePost } from '@/interfaces';
import { normalizePost } from '@/utils';

const Resources: NextPage = () => {
  const { t } = useLanguageContext();
  const [resources, setResources] = useState<ResourcePost[]>();
  const router = useRouter();

  const goToResources = (id: string) => {
    router.push(NAV_MAIN_LINKS.resources.link + '/' + id);
  };

  const getAllResources = async () => {
    try {
      let { data, error } = await db.getPosts().select('*');
      if (error) {
        console.error('Error in resources/index (getAllResources):', error);
        toast.error(t.unableToGetResources);
      }
      if (data) setResources(normalizePost(data));
    } catch (error) {
      console.error('Error in resources/index (getAllResources):', error);
      toast.error(t.unableToGetResources);
    }
  };

  useEffect(() => {
    getAllResources();
  }, []);

  if (!resources) return null;

  return (
    <MainLayout>
      <Meta pageTitle={t.resources} />
      <Container maxWidth="lg">
        <Typography variant="h4">{t.resources}</Typography>
        <Grid mt={2} display="flex" justifyContent="center" container>
          {resources.map(({ content, slug }) => (
            <Grid
              size={{ md: 4 }}
              key={slug}
              onClick={() => goToResources(slug)}
            >
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
