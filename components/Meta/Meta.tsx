import Head from "next/head";
import { COMPANY } from "@/constants";

interface Props {
  pageTitle?: string;
}

const Meta = ({ pageTitle = COMPANY.name }: Props) => {
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content="My page title" key="title" />
    </Head>
  );
};

export default Meta;
