import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';

import { supabase } from '@/class/index';
import { NAV_APP_LINKS } from '@/constants/nav';

interface Props {
  isSignUp: boolean;
}

const GoogleAuth = ({ isSignUp }: Props) => {
  const navigate = useRouter();
  const onLogin = async (response: CredentialResponse) => {
    if (response.credential) {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });
      if (error) toast.error('Fail to authenticate');
    }
  };

  const onSignUp = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://www.doit4jesus.com/app`,
      },
    });
    navigate.push(NAV_APP_LINKS.dashboard.link);
  };

  return <GoogleLogin onSuccess={isSignUp ? onSignUp : onLogin} />;
};

export default GoogleAuth;
