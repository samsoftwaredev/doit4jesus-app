import db from "@/class/SupabaseDB";
import { Button, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

interface IFormInputs {
  password: string;
  email: string;
}

const LogIn = () => {
  const { handleSubmit, control } = useForm<IFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    db.logIn(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <Button fullWidth type="submit" variant="contained">
        Log In
      </Button>
      <Button variant="text">Forgot password?</Button>
    </form>
  );
};

export default LogIn;
