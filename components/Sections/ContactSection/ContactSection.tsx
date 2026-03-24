import {
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import FormErrorText from '@/components/FormErrorText';
import { useLanguageContext } from '@/context/LanguageContext';
import womanComputer from '@/public/assets/images/womanComputer.jpeg';
import { sendContactForm } from '@/services/contactApi';
import { emailRegEx, nameRegEx } from '@/utils';

const ContactGrid = styled(Container)({
  marginTop: '60px',
  marginBottom: '60px',
  padding: '0 20px',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr 70px 1fr',
  gap: '20px',
  gridTemplateAreas: `
    'image'
    'title'
    'content'`,
  '@media (min-width: 768px)': {
    gridTemplateColumns: '500px 1fr',
    gridTemplateRows: '70px 1fr',
    gridTemplateAreas: `
      'image title'
      'image content'`,
  },
  '@media (min-width: 1024px)': {
    padding: '0px',
    gridTemplateColumns: '500px 1fr',
    gridTemplateRows: '70px 1fr',
    gridTemplateAreas: `
      'image title'
      'image content'`,
  },
});

const ContactImage = styled(Image)({
  gridArea: 'image',
  width: '100%',
  height: 'auto',
  display: 'flex',
  alignSelf: 'center',
  borderRadius: '10px',
});

interface IFormInputs {
  email: string;
  name: string;
  message: string;
}

const ContactSection = () => {
  const { t } = useLanguageContext();
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  const [loading, setLoading] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const { handleSubmit, reset, control } = useForm<IFormInputs>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      name: '',
      message: '',
    },
  });

  const onSubmit = async ({ email, name, message }: IFormInputs) => {
    setLoading(true);
    try {
      await sendContactForm({
        userEmail: email,
        userName: name,
        userMessage: message,
      });
      toast.success(t.messageSent);
      setSubmittedSuccessfully(true);
      reset();
    } catch (error) {
      console.error('Error in ContactSection (onSubmit):', error);
      toast.error(t.unableToSendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactGrid maxWidth="md">
      <ContactImage src={womanComputer} alt="Mary holding the Holy Rosary" />
      <Typography
        sx={{ gridArea: 'title', color: textColor }}
        component="h1"
        variant="h2"
      >
        {t.contactUs}
      </Typography>
      <FormControl
        sx={{ gridArea: 'content' }}
        fullWidth
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography component="p" sx={{ color: textColor }}>
          {t.contactDescription}
        </Typography>
        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
            pattern: {
              value: emailRegEx,
              message: t.invalidEmailAddress,
            },
            maxLength: {
              value: 100,
              message: t.emailExceedMaxLength,
            },
          }}
          render={({ field }) => (
            <TextField
              fullWidth
              placeholder={t.email}
              sx={{ input: { color: textColor } }}
              {...field}
            />
          )}
        />
        <FormErrorText control={control} name="email" />
        <Controller
          name="name"
          control={control}
          rules={{
            required: true,
            pattern: {
              value: nameRegEx,
              message: t.invalidName,
            },
            maxLength: {
              value: 100,
              message: t.nameExceedMaxLength,
            },
          }}
          render={({ field }) => (
            <TextField
              fullWidth
              placeholder={t.name}
              sx={{ input: { color: textColor } }}
              {...field}
            />
          )}
        />
        <FormErrorText control={control} name="name" />
        <Controller
          name="message"
          control={control}
          rules={{
            required: true,
            minLength: {
              value: 10,
              message: t.messageTooShort,
            },
          }}
          render={({ field }) => (
            <TextField
              fullWidth
              placeholder={t.message}
              multiline
              rows={3}
              sx={{ textarea: { color: textColor } }}
              {...field}
            />
          )}
        />
        <FormErrorText control={control} name="message" />
        <Button
          sx={{ marginTop: '1em' }}
          fullWidth
          type="submit"
          disabled={loading || submittedSuccessfully}
          variant="contained"
        >
          {t.sendMessage}
        </Button>
      </FormControl>
    </ContactGrid>
  );
};

export default ContactSection;
