import type { NextPage } from "next";
import { MainLayout } from "@/layouts";
import { HomeNavbar } from "../components";

const Blog: NextPage = () => {
  return <MainLayout topNavbar={<HomeNavbar />}>Blog</MainLayout>;
};

export default Blog;
