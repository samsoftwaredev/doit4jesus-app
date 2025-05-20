import Head from 'next/head';

import { COMPANY } from '@/constants';

interface Props {
  pageTitle?: string;
}

const Meta = ({ pageTitle = COMPANY.name }: Props) => {
  return (
    <Head>
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#ffffff" />
      <title>{pageTitle} - DoIt4Jesus</title>
      <meta
        name="description"
        content="Join DoIt4Jesus, a Catholic prayer app that unites people in real-time Rosary prayer. Grow spiritually through community and faith."
      />
      <meta
        name="keywords"
        content="Rosary app, Catholic prayer, pray together, spiritual growth, Christian community, DoIt4Jesus, do it for Jesus, prayer app, faith-based app"
      />
      <meta
        property="og:title"
        content="DoIt4Jesus - Pray the Holy Rosary Together"
      />
      <meta
        property="og:description"
        content="Connect with others in faith and prayer. DoIt4Jesus helps you pray the Rosary in a vibrant spiritual community."
      />
      <meta property="og:url" content="https://doit4jesus.com" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://doit4jesus.com/og-image.jpg" />
      <meta property="og:site_name" content="DoIt4Jesus" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="DoIt4Jesus - Pray the Holy Rosary Together"
      />
      <meta
        name="twitter:description"
        content="A faith-based app uniting believers through Rosary prayer. Join and grow spiritually together."
      />
      <meta
        name="twitter:image"
        content="https://doit4jesus.com/og-image.jpg"
      />
      <link rel="canonical" href="https://doit4jesus.com" />
    </Head>
  );
};

export default Meta;
