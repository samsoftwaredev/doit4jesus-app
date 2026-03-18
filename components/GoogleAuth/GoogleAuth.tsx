import GoogleIcon from '@mui/icons-material/Google';
import { Box, Button } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { supabase } from '@/classes';
import { NAV_APP_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';

import { handleLoginSuccess } from './GoogleAuth.tools';

interface Props {
  isSignUp: boolean;
}

const GoogleAuth = ({ isSignUp }: Props) => {
  const { t } = useLanguageContext();
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
          redirectTo:
            window.location.origin +
            NAV_APP_LINKS.dashboard.link +
            '?newUser=true',
        },
      });

      if (error) {
        toast.error(t.failedToSignUp);
      } else {
        toast.success(t.signUpSuccessful);
      }
    } catch (err) {
      toast.error(t.failedToSignUp);
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
        {t.signUpWithGoogle}
      </Button>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <GoogleLogin
        useOneTap
        auto_select={true}
        onSuccess={onLogin}
        onError={() => toast.error(t.googleAuthFailed)}
      />
    </Box>
  );
};

export default GoogleAuth;
