import GoogleIcon from '@mui/icons-material/Google';
import { Button } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';

import { supabase } from '@/classes';
import { NAV_APP_LINKS } from '@/constants/nav';

import { handleLoginSuccess } from './GoogleAuth.tools';

interface Props {
  isSignUp: boolean;
}

const GoogleAuth = ({ isSignUp }: Props) => {
  const router = useRouter();

  const onLogin = (response: CredentialResponse) => {
    handleLoginSuccess(response, () => {
      router.push(NAV_APP_LINKS.dashboard.link);
    });
  };

  const handleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + NAV_APP_LINKS.dashboard.link,
        },
      });

      if (error) {
        toast.error('Failed to sign up');
      } else {
        toast.success('Sign-up successful');
      }
    } catch (err) {
      toast.error('Failed to sign up');
    }
  };

  if (isSignUp) {
    return (
      <Button
        startIcon={<GoogleIcon />}
        variant="outlined"
        color="primary"
        onClick={handleSignUp}
      >
        Sign Up with Google
      </Button>
    );
  }

  return (
    <GoogleLogin
      useOneTap
      auto_select={true}
      onSuccess={onLogin}
      onError={() => toast.error('Google authentication failed')}
    />
  );
};

export default GoogleAuth;
