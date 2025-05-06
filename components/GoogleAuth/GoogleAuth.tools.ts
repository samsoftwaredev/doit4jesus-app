import { CredentialResponse } from '@react-oauth/google';
import { toast } from 'react-toastify';

import { supabase } from '@/classes';

export const handleLoginSuccess = async (
  response: CredentialResponse,
  callback: () => void,
) => {
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
        callback();
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    }
  } else {
    toast.error('No credentials received');
  }
};
