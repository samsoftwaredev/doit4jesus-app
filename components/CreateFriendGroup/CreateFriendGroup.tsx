import {
  Box,
  Button,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/ControlPoint";
import { db } from "@/class/index";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { alphaNumericRegEx } from "@/utils/regEx";
import FormErrorText from "../FormErrorText";
import Dialog from "../Dialog";

interface FormInputs {
  name: string;
}

const CreateGroupForm = ({
  onSubmitted,
}: {
  onSubmitted: (inputs: FormInputs) => void;
}) => {
  const { handleSubmit, reset, control } = useForm<FormInputs>({
    mode: "onTouched",
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (inputs: FormInputs) => {
    onSubmitted(inputs);
    reset();
  };

  return (
    <FormControl fullWidth component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography pb={3} component="p">
        Create a group for each circle of friends, like Catechism or Youth
        Group, to easily track everyone&apos;s stats and stay connected!
      </Typography>
      <Controller
        name="name"
        control={control}
        rules={{
          required: true,
          pattern: {
            value: alphaNumericRegEx,
            message: "Use letters to start; only letters and numbers allowed.",
          },
          maxLength: {
            value: 100,
            message: "The name exceed max length",
          },
        }}
        render={({ field }) => (
          <TextField fullWidth placeholder="Group Name" {...field} />
        )}
      />
      <FormErrorText control={control} name="name" />
      <Button
        sx={{
          display: "flex",
          alignSelf: "flex-end",
          marginTop: "2em",
        }}
        color="success"
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
      >
        Create Group
      </Button>
    </FormControl>
  );
};

const CreateFriendGroup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const onCreateGroup = async ({ name }: FormInputs) => {
    const { data, error } = await db
      .getGroups()
      .insert({
        group_name: name,
      })
      .select();
    if (error) {
      toast.error("Unable to create group");
    }
    if (data) {
      toast.success("Group was created");
      setIsOpen(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <IconButton onClick={openDialog} color="success" size="large">
        <CreateIcon sx={{ fontSize: "4em" }} />
      </IconButton>
      <Typography>Create Group</Typography>
      <Dialog
        maxWidth="sm"
        open={isOpen}
        handleClose={onClose}
        modalTitle="Create Group"
      >
        <CreateGroupForm onSubmitted={onCreateGroup} />
      </Dialog>
    </Box>
  );
};

export default CreateFriendGroup;
