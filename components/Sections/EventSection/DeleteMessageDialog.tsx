import { Box, Button, Typography } from "@mui/material";
import { Dialog } from "../..";

interface Props {
  currentMessageId?: string;
  handleCloseDelete: () => void;
  handleDelete: (messageId?: string) => Promise<void>;
}

const DeleteMessageDialog = ({
  currentMessageId,
  handleCloseDelete,
  handleDelete,
}: Props) => {
  const onDelete = () => handleDelete(currentMessageId);
  return (
    <Dialog
      open={!!currentMessageId}
      handleClose={handleCloseDelete}
      modalTitle="Delete Message"
      actions={
        <>
          <Button onClick={handleCloseDelete}>Close</Button>
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete Message
          </Button>
        </>
      }
    >
      <Box>
        <Typography>Are you sure you want to delete this message?</Typography>
      </Box>
    </Dialog>
  );
};

export default DeleteMessageDialog;
