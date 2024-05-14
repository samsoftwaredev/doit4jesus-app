import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Dialog from "../Dialog";
import { useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import { supabase } from "@/class/index";
import { Controller, useForm } from "react-hook-form";
import FormErrorText from "../FormErrorText";
import { emailRegEx, nameRegEx } from "@/utils/regEx";

type FormValues = {
  friendName: string;
  friendEmail: string;
};

const InviteFriend = () => {
  const { user } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const { control, reset, handleSubmit } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      friendEmail: "",
      friendName: "",
    },
  });

  const onSubmit = async ({ friendEmail, friendName }: FormValues) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const { data, error } = await supabase.functions.invoke("invite-friend", {
      body: {
        fullName: `${user?.firstName} ${user?.lastName}`,
        friendName: friendName,
        friendEmail: friendEmail,
      },
    });

    if (data) {
      toast.success("An invite was sent to " + friendName);
      setIsOpen(false);
      reset();
    }
    if (error) {
      toast.error("Unable to send invite to " + friendName);
    }
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <>
      <Typography fontSize="small" textAlign="center" fontWeight="light">
        Friends Invited
      </Typography>
      <Typography
        textAlign="center"
        fontWeight="bold"
        component="h3"
        variant="h2"
      >
        0
      </Typography>
      <Button onClick={onOpen} fullWidth color="success" variant="outlined">
        Invite Friend
      </Button>
      <Dialog open={isOpen} handleClose={onClose} modalTitle="Invite Friend">
        <FormControl
          fullWidth
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box sx={{ maxWidth: `500px` }}>
            <Typography mb={1}>
              We&apos;re gathering a bunch of cool souls to pray the rosary. Who
              knows better than you?
            </Typography>
            <Typography>
              Spread the word and let&apos;s turn this rosary rally into a
              spiritual fiesta.
            </Typography>
            <Grid
              mt={2}
              container
              component="form"
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Grid item md="auto">
                <Controller
                  name="friendName"
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: nameRegEx,
                      message: "Invalid name",
                    },
                    minLength: {
                      value: 1,
                      message: "Your friend's name is too short",
                    },
                    maxLength: {
                      value: 100,
                      message: "Your friend's name exceed max length",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      placeholder="Friend's Name"
                      {...field}
                    />
                  )}
                />
                <FormErrorText
                  fieldName="Friend's Name"
                  name="friendName"
                  control={control}
                />
              </Grid>
              <Grid item md="auto">
                <Controller
                  name="friendEmail"
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
                    <TextField
                      fullWidth
                      placeholder="Friend's Email"
                      {...field}
                    />
                  )}
                />
                <FormErrorText
                  fieldName="Friend's Email"
                  name="friendEmail"
                  control={control}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={5} display="flex" justifyContent="flex-end">
            <Button onClick={onClose}>Close</Button>
            <Button variant="contained" color="success" type="submit">
              Send Invite
            </Button>
          </Box>
        </FormControl>
      </Dialog>
    </>
  );
};

export default InviteFriend;
