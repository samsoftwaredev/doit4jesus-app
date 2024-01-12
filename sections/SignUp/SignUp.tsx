import db from "@/class/SupabaseDB";
import FormErrorText from "@/components/FormErrorText";
import { NAV_APP_LINKS } from "@/constants/nav";
import { emailRegEx } from "@/utils/regEx";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

interface IFormInputs {
  password: string;
  email: string;
  genderMale: boolean;
}

const SignUp = () => {
  const router = useRouter();

  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      genderMale: undefined,
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    const { error } = await db.signUp(userInput.email, userInput.password);
    if (error) toast.error(error.message);
    else toast.success("We have sent a confirmation link to your email");
  };

  return (
    <FormControl fullWidth component="form" onSubmit={handleSubmit(onSubmit)}>
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
        rules={{
          required: true,
          minLength: {
            value: 5,
            message: "Password is too short",
          },
          maxLength: {
            value: 100,
            message: "The email exceed max length",
          },
        }}
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
        <Button fullWidth type="submit" variant="contained">
          Sign Up
        </Button>
      </Box>
    </FormControl>
  );
};

export default SignUp;
