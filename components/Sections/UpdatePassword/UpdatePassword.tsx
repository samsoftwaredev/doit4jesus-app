import { Button, TextField } from '@mui/material';
import { db } from 'classes/SupabaseDB';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import FormErrorText from '@/components/FormErrorText';
import { NAV_MAIN_LINKS, passwordValidationRules } from '@/constants';

import { PasswordValidator } from '../..';

interface IFormInputs {
  password: string;
  confirmPassword: string;
}

const UpdatePassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control, reset } = useForm<IFormInputs>({
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const password = useWatch({ control, name: 'password' });
  const confirmPassword = useWatch({
    control,
    name: 'confirmPassword',
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    const passwordsMatch = userInput.password === userInput.confirmPassword;

    if (passwordsMatch) {
      setIsLoading(true);
      const { error } = await db.updatePassword(userInput.password);
      if (error) {
        console.error(error);
        toast.error(error.message);
      } else {
        router.push(NAV_MAIN_LINKS.login.link);
        toast.success('Password was updated');
        reset();
      }
      setIsLoading(false);
    } else {
      toast.warning('Passwords do not match. Please confirm your password.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="password"
        control={control}
        rules={passwordValidationRules}
        render={({ field }) => (
          <TextField
            fullWidth
            type="password"
            placeholder="Password"
            {...field}
          />
        )}
      />
      <FormErrorText control={control} name="password" />
      <Controller
        name="confirmPassword"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            fullWidth
            type="password"
            placeholder="Confirm Password"
            {...field}
          />
        )}
      />
      <FormErrorText
        control={control}
        name="confirmPassword"
        fieldName="Confirm Password"
      />
      <PasswordValidator
        password={password}
        confirmPassword={confirmPassword}
        comparePasswords
      />
      <Button
        disabled={isLoading}
        sx={{ marginTop: '1em' }}
        fullWidth
        type="submit"
        variant="contained"
      >
        Update Password
      </Button>
    </form>
  );
};

export default UpdatePassword;
