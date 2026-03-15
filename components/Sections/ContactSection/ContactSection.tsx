import {
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { supabase } from '@/classes';
import FormErrorText from '@/components/FormErrorText';
import womanComputer from '@/public/assets/images/womanComputer.jpeg';
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
    const { data, error } = await supabase.functions.invoke('contact-us', {
      body: {
        userEmail: email,
        userName: name,
        userMessage: message,
      },
    });
    if (data) {
      toast.success('Message sent! We will contact you shortly.');
      setSubmittedSuccessfully(true);
      reset();
    }
    if (error) toast.error('Unable to send message');
    setLoading(false);
  };

  return (
    <ContactGrid maxWidth="md">
      <ContactImage src={womanComputer} alt="Mary holding the Holy Rosary" />
      <Typography sx={{ gridArea: 'title' }} component="h1" variant="h2">
        Contact Us
      </Typography>
      <FormControl
        sx={{ gridArea: 'content' }}
        fullWidth
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography component="p">
          Send us a message and we will be in touch within one business day.
        </Typography>
        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
            pattern: {
              value: emailRegEx,
              message: 'Invalid email address',
            },
            maxLength: {
              value: 100,
              message: 'The email exceed max length',
            },
          }}
          render={({ field }) => (
            <TextField fullWidth placeholder="Email" {...field} />
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
              message: 'Invalid name',
            },
            maxLength: {
              value: 100,
              message: 'The name exceed max length',
            },
          }}
          render={({ field }) => (
            <TextField fullWidth placeholder="Name" {...field} />
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
              message: 'The message is too short',
            },
          }}
          render={({ field }) => (
            <TextField
              fullWidth
              placeholder="Message"
              multiline
              rows={3}
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
          Send Message
        </Button>
      </FormControl>
    </ContactGrid>
  );
};

export default ContactSection;
