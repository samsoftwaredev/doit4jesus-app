import { Box, Button, Typography } from "@mui/material";
import { Dialog } from "../..";
import { useMemo } from "react";

interface Props {
  currentMessageId?: string;
  handleCloseDelete: () => void;
  handleDelete: () => void;
}

const DeleteMessageDialog = ({
  currentMessageId,
  handleCloseDelete,
  handleDelete,
}: Props) => {
  const ActionButtons = useMemo(
    () => (
      <>
        <Button onClick={handleCloseDelete}>Close</Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete Message
        </Button>
      </>
    ),
    []
  );

  return (
    <Dialog
      open={!!currentMessageId}
      handleClose={handleCloseDelete}
      modalTitle="Delete Message"
      actions={ActionButtons}
    >
      <Box>
        <Typography fontWeight="light">
          Are you sure you want to delete this message?
        </Typography>
      </Box>
    </Dialog>
  );
};

export default DeleteMessageDialog;
