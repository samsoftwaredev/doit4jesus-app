import FormErrorText from "@/components/FormErrorText";
import contactUs from "@/public/assets/images/contactUs.png";
import { emailRegEx, nameRegEx } from "@/utils/regEx";
import {
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import styles from "./ContactSection.module.scss";

interface IFormInputs {
  email: string;
  name: string;
  message: string;
}

const ContactSection = () => {
  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
  });
  const onSubmit = () => {};
  return (
    <Container maxWidth="md" className={styles.container}>
      <Image
        className={styles.image}
        src={contactUs}
        alt="Mary holding the Holy Rosary"
      />
      <Typography className={styles.title} component="h1" variant="h4">
        Contact Us
      </Typography>
      <FormControl
        className={styles.content}
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
              message: "Invalid email address",
            },
            maxLength: {
              value: 100,
              message: "The email exceed max length",
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
              message: "Invalid name",
            },
            maxLength: {
              value: 100,
              message: "The name exceed max length",
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
              message: "The message is too short",
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
          sx={{ marginTop: "1em" }}
          fullWidth
          type="submit"
          variant="contained"
        >
          Send Message
        </Button>
      </FormControl>
    </Container>
  );
};

export default ContactSection;
