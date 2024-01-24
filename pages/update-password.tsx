import { Box, Button, Container, Typography } from "@mui/material";
import { HomeNavbar, Meta } from "../components";
import { UpdatePassword } from "@/sections";
import { useEffect, useState } from "react";
import { MainLayout } from "@/layouts";
import { NAV_APP_LINKS } from "../constants";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useUserContext } from "@/context/UserContext";

enum ViewType {
  signUp = "Sing Up",
  logIn = "Log In",
  forgotPassword = "Forgot Password",
}

const Register: NextPage = () => {
  const navigate = useRouter();
  const { user } = useUserContext();
  const [view, setView] = useState<ViewType>(ViewType.signUp);
  const isNotAuth = user === null;

  const toggleViewSignUp = () => {
    setView(ViewType.signUp);
  };

  const toggleViewLogin = () => {
    setView(ViewType.logIn);
  };

  const toggleViewForgotPassword = () => {
    setView(ViewType.forgotPassword);
  };

  useEffect(() => {
    // if user is auth, navigate user to application
    if (!isNotAuth) navigate.push(NAV_APP_LINKS.app.link);
  }, []);

  if (!isNotAuth) return null;

  return (
    <MainLayout topNavbar={<HomeNavbar />}>
      <Meta pageTitle="Register" />
      <Container maxWidth="xs">
        <Typography mt={3} variant="h4" component="h1">
          Update Password
        </Typography>
        <Typography variant="body1" component="p">
          Enter a new password to reset the password on your account. We'll ask
          this password whenever you log in.
        </Typography>
        <Box my={2}>
          <UpdatePassword />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Register;
