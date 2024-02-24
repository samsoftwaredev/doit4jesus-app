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
  signUp = "signUp",
  logIn = "logIn",
  forgotPassword = "forgotPassword",
}

type PageViewType = {
  [key: string]: {
    title: string;
    header: string;
    component: string | JSX.Element;
    footer: string | JSX.Element;
  };
};

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

  const pageView: PageViewType = {
    signUp: {
      title: "Sing Up",
      header: "Join Our Catholic Community!",
      component: <SignUp />,
      footer: (
        <>
          Have an account already?
          <Button variant="text" onClick={toggleViewLogin}>
            Log In
          </Button>
        </>
      ),
    },
    logIn: {
      title: "Log In",
      header: "Welcome back!",
      component: <LogIn onForgotPassword={toggleViewForgotPassword} />,
      footer: (
        <>
          Don't have an account?
          <Button variant="text" onClick={toggleViewSignUp}>
            Sign Up
          </Button>
        </>
      ),
    },
    forgotPassword: {
      title: "Forgot Password",
      header: "",
      component: <ForgotPassword />,
      footer: (
        <>
          Did you remembered your password?
          <Button variant="text" onClick={toggleViewLogin}>
            Log In
          </Button>
        </>
      ),
    },
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
          {pageView[view].title}
        </Typography>
        <Typography variant="body1" component="p">
          {pageView[view].header}
        </Typography>
        <Box my={2}>{pageView[view]?.component}</Box>
        <Typography textAlign="center" variant="body1" component="p">
          {pageView[view].footer}
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default Register;
