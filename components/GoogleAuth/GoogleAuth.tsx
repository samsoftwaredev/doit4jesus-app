import React from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { supabase } from "@/class/index";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { NAV_APP_LINKS } from "@/constants/nav";

interface Props {
  isSignUp: boolean;
}

const GoogleAuth = ({ isSignUp }: Props) => {
  const navigate = useRouter();
  const onLogin = async (response: CredentialResponse) => {
    if (response.credential) {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });
      if (error) toast.error("Fail to authenticate");
    }
  };

  const onSignUp = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `https://www.doitforjesus.com/app`,
      },
    });
    navigate.push(NAV_APP_LINKS.app.link);
  };

  return <GoogleLogin onSuccess={isSignUp ? onSignUp : onLogin} />;
};

export default GoogleAuth;
