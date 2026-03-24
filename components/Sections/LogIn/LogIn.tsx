import { Button, FormControl, TextField } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { db, supabase } from '@/classes/SupabaseDB';
import { GoogleAuth, HorizontalDivider } from '@/components';
import FormErrorText from '@/components/FormErrorText';
import { NAV_APP_LINKS, NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

interface IFormInputs {
  password: string;
  email: string;
}

const LogIn = () => {
  const router = useRouter();
  const { t } = useLanguageContext();
  const [isLoading, setIsLoading] = useState(false);
  const { getProfile } = useUserContext();
  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    setIsLoading(true);
    try {
      const { data, error } = await db.logIn(
        userInput.email,
        userInput.password,
      );
      if (error) {
        console.error(error);
        toast.error(error.message);
      }
      if (data) {
        await getProfile(data.session);
        router.push(NAV_APP_LINKS.dashboard.link);
      }
    } catch (error) {
      console.error('Error in LogIn (onSubmit):', error);
      toast.error(t.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormControl
      fullWidth
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ gap: 0.5 }}
    >
      <GoogleAuth isSignUp={false} />
      <HorizontalDivider />
      <Controller
        name="email"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            label={t.email}
            fullWidth
            placeholder={t.email}
            {...field}
          />
        )}
      />
      <FormErrorText control={control} name="email" />
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            label={t.password}
            fullWidth
            type="password"
            placeholder={t.password}
            {...field}
          />
        )}
      />
      <FormErrorText control={control} name="password" />
      <Button
        disabled={isLoading}
        sx={{ marginTop: '1em' }}
        fullWidth
        type="submit"
        variant="contained"
      >
        {t.logIn}
      </Button>
      <Link passHref href={NAV_MAIN_LINKS.forgotPassword.link}>
        <Button fullWidth sx={{ marginTop: '1em' }}>
          {t.forgotPassword}
        </Button>
      </Link>
    </FormControl>
  );
};

export default LogIn;
