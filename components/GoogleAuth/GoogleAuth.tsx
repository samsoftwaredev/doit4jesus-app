import React from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { supabase } from "@/class/index";
import { toast } from "react-toastify";

const GoogleAuth = () => {
  const responseMessage = async (response: CredentialResponse) => {
    if (response.credential) {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });
      if (error) toast.error("Fail to authenticate");
    }
  };

  return <GoogleLogin onSuccess={responseMessage} />;
};

export default GoogleAuth;
