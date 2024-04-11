import { ForgotPassword, LogIn, SignUp } from "@/components/Sections";
import { Button } from "@mui/material";
import { NAV_MAIN_LINKS } from "./nav";
import Link from "next/link";

export const pageView = {
  signUp: {
    title: "Sing Up",
    header: "Join Our Catholic Community!",
    component: <SignUp />,
    footer: (
      <>
        Have an account already?
        <Link passHref href={NAV_MAIN_LINKS.login.link}>
          <Button>Log In</Button>
        </Link>
      </>
    ),
  },
  logIn: {
    title: "Log In",
    header: "Welcome back!",
    component: <LogIn />,
    footer: (
      <>
        Don't have an account?
        <Link passHref href={NAV_MAIN_LINKS.signup.link}>
          <Button>Sign Up</Button>
        </Link>
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
        <Link passHref href={NAV_MAIN_LINKS.login.link}>
          <Button>Log In</Button>
        </Link>
      </>
    ),
  },
};
