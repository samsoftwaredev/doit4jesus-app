import { toast } from "react-toastify";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { db, supabase } from "classes/SupabaseDB";
import { Button, TextField } from "@mui/material";
import FormErrorText from "@/components/FormErrorText";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { NAV_APP_LINKS } from "@/constants/nav";
import { useRouter } from "next/router";

interface IFormInputs {
  password: string;
  email: string;
}

interface Props {
  onForgotPassword: () => void;
}

const LogIn = ({ onForgotPassword }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { getProfile } = useUserContext();
  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    setIsLoading(true);
    const { error } = await db.logIn(userInput.email, userInput.password);
    if (error) {
      toast.error(error?.message);
    } else {
      const { data } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN") {
            await getProfile(session);
            router.push(NAV_APP_LINKS.app.link);
          }
        }
      );
      data.subscription.unsubscribe();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") getProfile(session);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  });

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
        disabled={isLoading}
        sx={{ marginTop: "1em" }}
        fullWidth
        type="submit"
        variant="contained"
      >
        Log In
      </Button>
      <Button
        onClick={onForgotPassword}
        sx={{ marginTop: "1em" }}
        fullWidth
        variant="text"
      >
        Forgot password?
      </Button>
    </form>
  );
};

export default LogIn;
