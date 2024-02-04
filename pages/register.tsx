import { Box, Button, Container, Typography } from "@mui/material";
import { HomeNavbar, Meta } from "../components";
import { LogIn, SignUp, ForgotPassword } from "../sections";
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
  const isAuth = !!user;

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
    if (isAuth) navigate.push(NAV_APP_LINKS.app.link);
  }, []);

  if (isAuth) return null;

  return (
    <MainLayout topNavbar={<HomeNavbar />}>
      <Meta pageTitle="Register" />
      <Container maxWidth="xs">
        <Typography mt={3} variant="h4" component="h1">
          {view}
        </Typography>
        <Typography variant="body1" component="p">
          {view === ViewType.signUp && "Join Our Catholic Community!"}
          {view === ViewType.logIn && "Welcome back!"}
          {view === ViewType.forgotPassword &&
            "No worries! Fill in your email and we'll send you a link to reset your password"}
        </Typography>
        <Box my={2}>
          {view === ViewType.signUp && <SignUp />}
          {view === ViewType.logIn && (
            <LogIn onForgotPassword={toggleViewForgotPassword} />
          )}
          {view === ViewType.forgotPassword && <ForgotPassword />}
        </Box>
        <Typography textAlign="center" variant="body1" component="p">
          {view === ViewType.signUp && (
            <>
              Have an account already?
              <Button variant="text" onClick={toggleViewLogin}>
                Log In
              </Button>
            </>
          )}
          {view === ViewType.logIn && (
            <>
              Don't have an account?
              <Button variant="text" onClick={toggleViewSignUp}>
                Sign Up
              </Button>
            </>
          )}
          {view === ViewType.forgotPassword && (
            <>
              Did you remembered your password?
              <Button variant="text" onClick={toggleViewLogin}>
                Log In
              </Button>
            </>
          )}
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default Register;
