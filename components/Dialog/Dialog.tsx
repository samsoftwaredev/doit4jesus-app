import React from "react";
import MuiDialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";

type Props = {
  handleClose: () => void;
  children?: React.ReactNode;
  modalTitle?: string;
} & DialogProps;

const Dialog = ({
  handleClose,
  modalTitle = "",
  children = null,
  ...props
}: Props) => {
  return (
    <MuiDialog maxWidth="md" onClose={handleClose} {...props}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <DialogTitle>{modalTitle}</DialogTitle>
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      {children}
    </MuiDialog>
  );
};

export default Dialog;
