import db from "@/class/SupabaseDB";
import { Button, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import FormErrorText from "@/components/FormErrorText";
import { useRouter } from "next/router";

interface IFormInputs {
  password: string;
  email: string;
}

const LogIn = () => {
  const router = useRouter();
  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    const { error } = await db.logIn(userInput.email, userInput.password);
    if (error) toast.error(error.message);
    else toast.success("We have sent a confirmation to your email");
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
      <FormErrorText control={control} name="email" />
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
      <FormErrorText control={control} name="password" />
      <Button fullWidth type="submit" variant="contained">
        Log In
      </Button>
      <Button variant="text">Forgot password?</Button>
    </form>
  );
};

export default LogIn;
