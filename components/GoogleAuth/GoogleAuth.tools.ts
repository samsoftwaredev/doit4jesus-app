import { CredentialResponse } from '@react-oauth/google';
import { Session, User } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-toastify';

import { supabase } from '@/classes';

export const handleLoginSuccess = async (
  response: CredentialResponse,
  callback: (data: { user: User; session: Session }) => void,
) => {
  if (response.credential) {
    try {
      const { error, data } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });
      if (error) {
        toast.error('Failed to authenticate');
      } else {
        toast.success('Login successful');
        callback(data);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    }
  } else {
    toast.error('No credentials received');
  }
};
