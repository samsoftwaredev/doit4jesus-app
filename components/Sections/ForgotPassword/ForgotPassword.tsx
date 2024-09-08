import { useState } from "react";
import { toast } from "react-toastify";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { db } from "classes/SupabaseDB";
import { Button, TextField } from "@mui/material";

import FormErrorText from "@/components/FormErrorText";

interface IFormInputs {
  email: string;
}

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    setIsLoading(true);
    const { error } = await db.resetPassword(userInput.email);
    if (error) {
      toast.error(error?.message);
    } else {
      toast.success("Password reset sent");
    }
    setIsLoading(false);
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
      <Button
        disabled={isLoading}
        sx={{ marginTop: "1em" }}
        fullWidth
        type="submit"
        variant="contained"
      >
        Reset Password
      </Button>
    </form>
  );
};

export default ForgotPassword;
