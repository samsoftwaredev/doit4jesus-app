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
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import FormErrorText from "@/components/FormErrorText";
import db from "@/class/SupabaseDB";
import { emailRegEx } from "@/utils/regEx";
import { toast } from "react-toastify";
import { useReducer } from "react";
import Image from "next/image";
import emailLetter from "@/public/assets/images/emailLetter.png";

interface IFormInputs {
  password: string;
  email: string;
  genderMale: boolean;
}

// An enum with all the types of actions to use in our reducer
enum SignUpActionKind {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}

// An interface for our actions
interface SignUpAction {
  type: SignUpActionKind;
}

// An interface for our state
interface SignUpState {
  isLoading: boolean;
  isSuccess: boolean;
}
const initialState = { isLoading: false, isSuccess: false };

function reducer(_: SignUpState, action: SignUpAction) {
  switch (action.type) {
    case SignUpActionKind.LOADING:
      return { isSuccess: false, isLoading: true };
    case SignUpActionKind.SUCCESS:
      return { isSuccess: true, isLoading: false };
    case SignUpActionKind.FAIL:
    default:
      return initialState;
  }
}

const SignUp = () => {
  const [signUp, dispatch] = useReducer(reducer, initialState);
  const { handleSubmit, control } = useForm<IFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      genderMale: undefined,
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (userInput) => {
    dispatch({ type: SignUpActionKind.LOADING });
    const { error } = await db.signUp(userInput.email, userInput.password);
    if (error) {
      toast.error(error.message);
      dispatch({ type: SignUpActionKind.FAIL });
    } else {
      toast.success("We have sent a confirmation link to your email");
      dispatch({ type: SignUpActionKind.SUCCESS });
    }
  };

  if (signUp.isSuccess) {
    return (
      <>
        <div style={{ width: "100%", height: "200px", position: "relative" }}>
          <Image
            style={{ width: "100%" }}
            alt="Mountains"
            src={emailLetter}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <Typography textAlign="center" variant="h5">
          Check Your Inbox
        </Typography>
        <Typography mb={3} textAlign="center">
          A verification email is on the way! <br />
          If doesn't arrive, try to resend.
        </Typography>
      </>
    );
  }

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
        <Button
          disabled={signUp.isLoading}
          fullWidth
          type="submit"
          variant="contained"
        >
          {signUp.isLoading ? "Loading..." : "Sign Up"}
        </Button>
      </Box>
    </FormControl>
  );
};

export default SignUp;