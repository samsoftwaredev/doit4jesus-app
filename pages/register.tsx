import { Box, Container, Typography } from "@mui/material";
import { Meta } from "@/components";
import { useEffect } from "react";
import { MainLayout } from "@/components/Templates";
import { NAV_APP_LINKS } from "@/constants";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useUserContext } from "@/context/UserContext";
import { pageView } from "@/constants/register";

/**
 * DO NOT REMOVE PAGE!
 * This register page is needed for email sent to confirm account.
 */

const Register: NextPage = () => {
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
          {pageView.signUp.title}
        </Typography>
        <Typography variant="body1" component="p">
          {pageView.signUp.header}
        </Typography>
        <Box my={2}>{pageView.signUp?.component}</Box>
        <Typography textAlign="center" variant="body1" component="p">
          {pageView.signUp.footer}
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default Register;
