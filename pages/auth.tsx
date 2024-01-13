import type { NextPage } from "next";
import { MainLayout } from "@/layouts";
import { HomeNavbar } from "../components";
import { Box, Button, Container, Typography } from "@mui/material";
import { useState } from "react";
import { LogIn, SignUp } from "../sections";

const Auth: NextPage = () => {
  const [isNewUser, setIsNewUser] = useState(true);

  const toggleView = () => {
    setIsNewUser(!isNewUser);
  };

  return (
    <MainLayout topNavbar={<HomeNavbar />}>
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

export default Auth;
