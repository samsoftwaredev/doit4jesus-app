import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";

import { Meta } from "@/components";
import { MainLayout } from "@/components/Templates";
import { NAV_APP_LINKS } from "@/constants";
import { useUserContext } from "@/context/UserContext";
import { pageView } from "@/constants/register";

const Login: NextPage = () => {
  const navigate = useRouter();
  const { user } = useUserContext();
  const isAuth = !!user;

  useEffect(() => {
    // if user is auth, navigate user to application
    if (isAuth) navigate.push(NAV_APP_LINKS.dashboard.link);
  }, []);

  if (isAuth) return null;

  return (
    <MainLayout>
      <Meta pageTitle="Register" />
      <Container maxWidth="xs">
        <Typography mt={3} variant="h4" component="h1">
          {pageView.logIn.title}
        </Typography>
        <Typography component="p">{pageView.logIn.header}</Typography>
        <Box my={2}>{pageView.logIn?.component}</Box>
        <Typography textAlign="center" component="p">
          {pageView.logIn.footer}
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default Login;
