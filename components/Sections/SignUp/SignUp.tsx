import Image from "next/image";
import { toast } from "react-toastify";
import { useState } from "react";
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
} from "@mui/material";
import { db } from "classes/SupabaseDB";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";

import FormErrorText from "@/components/FormErrorText";
import { emailRegEx, nameRegEx } from "@/utils/regEx";
import virginMaryLetter from "@/public/assets/images/art/virginMaryLetter.jpeg";
import { passwordValidationRules } from "@/constants";

import {
  GoogleAuth,
  HorizontalDivider,
  Loading,
  PasswordValidator,
} from "../..";

interface IFormInputs {
  password: string;
  email: string;
  genderMale: boolean;
  firstName: string;
  lastName: string;
}

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessfulSigUp, setIsSuccessfulSigUp] = useState(false);
  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      genderMale: undefined,
      firstName: "",
      lastName: "",
    },
  });
  const password = useWatch({ control, name: "password" });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    setIsLoading(true);
    const { error, data } = await db.signUp(userInput);
    setIsLoading(false);
    if (error) {
      toast.error(error.message);
      console.error(error);
    }
    if (data) {
      toast.success("We have sent a confirmation link to your email");
      setIsSuccessfulSigUp(true);
    }
  };

  if (isLoading) {
    return <Loading isPage={false} />;
  }

  if (isSuccessfulSigUp) {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "200px",
            position: "relative",
          }}
        >
          <Image
            style={{
              width: "100%",
              borderTopLeftRadius: "50%",
              borderTopRightRadius: "50%",
            }}
            alt="Virgin Mary Letter"
            src={virginMaryLetter}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <Typography my={2} textAlign="center" variant="h5">
          Check Your Inbox
        </Typography>
        <Typography mb={3} textAlign="center">
          A verification email is on the way! <br />
          If it doesn&apos;t arrive, check your spam folder.
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
            message: "Invalid name",
          },
          minLength: {
            value: 1,
            message: "The first name is too short",
          },
          maxLength: {
            value: 100,
            message: "The first name exceed max length",
          },
        }}
        render={({ field }) => (
          <TextField fullWidth placeholder="First Name" {...field} />
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
            message: "Invalid name",
          },
          minLength: {
            value: 1,
            message: "The last name is too short",
          },
          maxLength: {
            value: 100,
            message: "The last name exceed max length",
          },
        }}
        render={({ field }) => (
          <TextField fullWidth placeholder="Last Name" {...field} />
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
      <FormErrorText name="password" control={control} />
      <PasswordValidator password={password} />
      <Box my={1}>
        <FormLabel id="gender">Select Gender:</FormLabel>
        <Controller
          name="genderMale"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <RadioGroup
              id="gender"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
              defaultValue="male"
              {...field}
            >
              <FormControlLabel value={true} control={<Radio />} label="Male" />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          )}
        />
        <FormErrorText name="genderMale" fieldName="gender" control={control} />
        <Button
          sx={{ marginTop: "1em" }}
          disabled={isLoading}
          fullWidth
          type="submit"
          variant="contained"
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </Button>
      </Box>
    </FormControl>
  );
};

export default SignUp;
