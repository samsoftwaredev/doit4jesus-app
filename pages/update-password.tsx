import { Box, Container, Typography } from "@mui/material";
import { HomeNavbar, Meta } from "../components";
import { UpdatePassword } from "@/sections";
import { MainLayout } from "@/layouts";
import type { NextPage } from "next";

const Register: NextPage = () => {
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
