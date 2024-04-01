import React from "react";
import MuiDialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { theme } from "@/styles/mui-overwrite";

type Props = {
  handleClose: () => void;
  children?: React.ReactNode;
  modalTitle?: string;
  actions?: React.ReactNode;
} & DialogProps;

const Dialog = ({
  handleClose,
  modalTitle = "",
  children = null,
  actions = null,
  ...props
}: Props) => {
  return (
    <MuiDialog maxWidth="md" onClose={handleClose} {...props}>
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.primary.main}`,
        }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <DialogTitle>{modalTitle}</DialogTitle>
        <IconButton
          sx={{
            marginRight: "0.5em",
          }}
          aria-label="close"
          onClick={handleClose}
        >
          <CloseIcon color="primary" />
        </IconButton>
      </Box>
      <Box p={3}>{children}</Box>
      <Box display="flex" justifyContent="end" gap={1} mr={3} my={3}>
        {actions}
      </Box>
    </MuiDialog>
  );
};

export default Dialog;
