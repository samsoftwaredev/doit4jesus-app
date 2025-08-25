import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { db } from '@/classes/SupabaseDB';
import FormErrorText from '@/components/FormErrorText';
import { useLanguageContext } from '@/context/LanguageContext';

interface IFormInputs {
  email: string;
}

const ForgotPassword = () => {
  const { t } = useLanguageContext();
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    setIsLoading(true);
    const { error } = await db.resetPassword(userInput.email);
    if (error) {
      toast.error(error?.message);
    } else {
      toast.success('Password reset sent');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <Button
        disabled={isLoading}
        sx={{ marginTop: '1em' }}
        fullWidth
        type="submit"
        variant="contained"
      >
        {t.resetPassword}
      </Button>
    </form>
  );
};

export default ForgotPassword;
