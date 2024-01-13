import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import db from "@/class/SupabaseDB";
import { Box, Button, TextField } from "@mui/material";
import FormErrorText from "@/components/FormErrorText";
import { NAV_APP_LINKS } from "@/constants/nav";
import { useUserContext } from "@/context/UserContext";
import { normalizeAuthDB } from "@/utils/helpers";

interface IFormInputs {
  password: string;
  email: string;
}

const LogIn = () => {
  const router = useRouter();
  const { setUser, user } = useUserContext();
  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    const { error, data: userDB } = await db.logIn(
      userInput.email,
      userInput.password
    );
    if (error) {
      toast.error(error?.message);
    } else {
      router.push(NAV_APP_LINKS.app.link);
      const dataNormalized = normalizeAuthDB(userDB.user);
      if (user) setUser({ ...user, ...dataNormalized });
    }
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
      <Button
        sx={{ marginTop: "1em" }}
        fullWidth
        type="submit"
        variant="contained"
      >
        Log In
      </Button>
      <Button sx={{ marginTop: "1em" }} fullWidth variant="text">
        Forgot password?
      </Button>
    </form>
  );
};

export default LogIn;
