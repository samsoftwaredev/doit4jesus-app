import type { GetServerSideProps, NextPage } from 'next';

import AppWrapper from '@/components/AppWrapper';
import ExamPage from '@/components/ExamPage';
import { AppLayout } from '@/components/Templates';
import { isValidExamSlug } from '@/interfaces/examOfConscience';

interface Props {
  slug: string;
}

const ExamRoute: NextPage<Props> = ({ slug }) => (
  <AppLayout>
    <ExamPage slug={slug} />
  </AppLayout>
);

const ExamRouteWrapper: NextPage<Props> = (props) => (
  <AppWrapper>
    <ExamRoute {...props} />
  </AppWrapper>
);

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const slug = ctx.params?.slug as string;

  if (!isValidExamSlug(slug)) {
    return { notFound: true };
  }

  return { props: { slug } };
};

export default ExamRouteWrapper;
