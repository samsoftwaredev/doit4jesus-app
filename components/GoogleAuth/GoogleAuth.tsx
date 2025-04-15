import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';

import { supabase } from '@/classes';
import { NAV_APP_LINKS } from '@/constants/nav';

interface Props {
  isSignUp: boolean;
}

const GoogleAuth = ({ isSignUp }: Props) => {
  const router = useRouter();

  const handleLoginSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        });
        if (error) {
          toast.error('Failed to authenticate');
        } else {
          toast.success('Login successful');
          router.push(NAV_APP_LINKS.dashboard.link);
        }
      } catch (err) {
        toast.error('An unexpected error occurred');
      }
    } else {
      toast.error('No credentials received');
    }
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

  return (
    <GoogleLogin
      onSuccess={isSignUp ? handleSignUp : handleLoginSuccess}
      onError={() => toast.error('Google authentication failed')}
    />
  );
};

export default GoogleAuth;
