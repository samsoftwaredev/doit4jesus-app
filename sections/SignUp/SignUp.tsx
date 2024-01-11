import db from "@/class/SupabaseDB";
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
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

interface IFormInputs {
  password: string;
  email: string;
  genderMale: boolean;
}

const SignUp = () => {
  const { handleSubmit, control } = useForm<IFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      genderMale: undefined,
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    const { error } = await db.signUp(userInput.email, userInput.password);
    if (error) toast.error("Unable to create account.");
  };

  return (
    <FormControl fullWidth component="form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField fullWidth placeholder="Email" {...field} />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            fullWidth
            type="password"
            placeholder="Password"
            {...field}
          />
        )}
      />
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
        <Button fullWidth type="submit" variant="contained">
          Sign Up
        </Button>
      </Box>
    </FormControl>
  );
};

export default SignUp;
