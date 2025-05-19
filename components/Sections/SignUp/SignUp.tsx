import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import { db } from '@/classes/SupabaseDB';
import FormErrorText from '@/components/FormErrorText';
import { passwordValidationRules } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';
import virginMaryLetter from '@/public/assets/images/art/virginMaryLetter.jpeg';
import { emailRegEx, nameRegEx } from '@/utils';

import {
  GoogleAuth,
  HorizontalDivider,
  Loading,
  PasswordValidator,
} from '../..';

interface IFormInputs {
  password: string;
  email: string;
  genderMale: boolean;
  firstName: string;
  lastName: string;
}

const SignUp = () => {
  const { t } = useLanguageContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessfulSigUp, setIsSuccessfulSigUp] = useState(false);
  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      genderMale: undefined,
      firstName: '',
      lastName: '',
    },
  });
  const password = useWatch({ control, name: 'password' });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    const { firstName, lastName } = userInput;
    setIsLoading(true);
    // validate no Jesus or Christ allowed for first and last name
    const { error, data } = await db.signUp({
      ...userInput,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    setIsLoading(false);
    if (error) {
      toast.error(error.message);
      console.error(error);
    }
    if (data) {
      toast.success('We have sent a confirmation link to your email');
      setIsSuccessfulSigUp(true);
    }
  };

  if (isLoading) return <Loading />;

  if (isSuccessfulSigUp) {
    return (
      <>
        <div
          style={{
            width: '100%',
            height: '200px',
            position: 'relative',
          }}
        >
          <Image
            style={{
              width: '100%',
              borderTopLeftRadius: '50%',
              borderTopRightRadius: '50%',
            }}
            alt="Virgin Mary Letter"
            src={virginMaryLetter}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <Typography my={2} textAlign="center" variant="h5">
          {t.checkYourEmail}
        </Typography>
        <Typography mb={3} textAlign="center">
          {t.checkYourEmailDescription}
        </Typography>
      </>
    );
  }

  return (
    <FormControl fullWidth component="form" onSubmit={handleSubmit(onSubmit)}>
      <GoogleAuth isSignUp />
      <HorizontalDivider />
      <Controller
        name="firstName"
        control={control}
        rules={{
          required: true,
          pattern: {
            value: nameRegEx,
            message: t.errorInvalidFirstName,
          },
          minLength: {
            value: 1,
            message: t.errorFirstNameIsTooShort,
          },
          maxLength: {
            value: 100,
            message: t.errorLastNameIsTooLong,
          },
        }}
        render={({ field }) => (
          <TextField fullWidth placeholder={t.firstName} {...field} />
        )}
      />
      <FormErrorText
        fieldName="First Name"
        name="firstName"
        control={control}
      />
      <Controller
        name="lastName"
        control={control}
        rules={{
          required: true,
          pattern: {
            value: nameRegEx,
            message: t.errorInvalidLastName,
          },
          minLength: {
            value: 1,
            message: t.errorLastNameIsTooShort,
          },
          maxLength: {
            value: 100,
            message: t.errorLastNameIsTooLong,
          },
        }}
        render={({ field }) => (
          <TextField fullWidth placeholder={t.lastName} {...field} />
        )}
      />
      <FormErrorText fieldName="Last name" name="lastName" control={control} />
      <Controller
        name="email"
        control={control}
        rules={{
          required: true,
          pattern: {
            value: emailRegEx,
            message: t.errorInvalidEmail,
          },
          maxLength: {
            value: 100,
            message: t.errorEmailIsTooLong,
          },
        }}
        render={({ field }) => (
          <TextField fullWidth placeholder={t.email} {...field} />
        )}
      />
      <FormErrorText control={control} name="email" />
      <Controller
        name="password"
        control={control}
        rules={passwordValidationRules}
        render={({ field }) => (
          <TextField
            fullWidth
            type="password"
            placeholder={t.password}
            {...field}
          />
        )}
      />
      <FormErrorText name="password" control={control} />
      <PasswordValidator password={password} />
      <Box my={1}>
        <FormLabel id="gender">{t.selectGender}:</FormLabel>
        <Controller
          name="genderMale"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <RadioGroup
              id="gender"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
              defaultValue={t.male}
              {...field}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label={t.male}
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label={t.female}
              />
            </RadioGroup>
          )}
        />
        <FormErrorText name="genderMale" fieldName="gender" control={control} />
        <Button
          sx={{ marginTop: '1em' }}
          disabled={isLoading}
          fullWidth
          type="submit"
          variant="contained"
        >
          {isLoading ? t.loading : t.signUp}
        </Button>
      </Box>
    </FormControl>
  );
};

export default SignUp;
