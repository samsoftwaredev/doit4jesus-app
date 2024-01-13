import type { NextPage } from "next";
import { Meta, PageNotFound } from "../components";

const Page404: NextPage = () => {
  return (
    <div>
      <Meta pageTitle="Page not found" />
      <PageNotFound />
    </div>
  );
};

export default Page404;
