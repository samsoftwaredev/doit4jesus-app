import type { NextPage } from "next";
import { MainLayout } from "@/layouts";
import { HomeNavbar, Meta } from "../components";
import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { LogIn, SignUp } from "../sections";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import { NAV_APP_LINKS } from "../constants";

const Register: NextPage = () => {
  const navigate = useRouter();
  const { user } = useUserContext();
  const [isNewUser, setIsNewUser] = useState(true);
  const isNotAuth = user === null;

  const toggleView = () => {
    setIsNewUser(!isNewUser);
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
          {isNewUser ? "Sing Up" : "Log In"}
        </Typography>
        <Typography variant="body1" component="p">
          {isNewUser ? "Join Our Catholic Community!" : "Welcome back!"}
        </Typography>
        <Box my={2}>{isNewUser ? <SignUp /> : <LogIn />}</Box>
        <Typography textAlign="center" variant="body1" component="p">
          {isNewUser ? "Have an account already?" : "Don't have an account?"}
          <Button variant="text" onClick={toggleView}>
            {isNewUser ? "Log In" : "Sign Up"}
          </Button>
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default Register;
