import { theme } from "@/styles/mui-overwrite";
import { AccountCircle, AttachMoney, Send } from "@mui/icons-material";
import { Box, Button, Paper, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";

const ChatTextbox = () => {
  const [message, setMessage] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.target.value as string);
  };

  return (
    <Box display="flex" flexDirection="column" gap="1em">
      <Box gap="1em" display="flex" alignItems="center" position="relative">
        <AccountCircle
          style={{
            fontSize: "35px",
            color: theme.palette.secondary.main,
            zIndex: "10",
            position: "absolute",
            top: "-15px",
            backgroundColor: theme.palette.primary.main,
            borderRadius: "50%",
          }}
        />
        <Paper sx={{ marginLeft: "15px", width: "100%" }}>
          <TextField
            value={message}
            onChange={onChange}
            sx={{ width: "100%" }}
            color="secondary"
            placeholder="Add your prayer..."
            rows={2}
            multiline
          />
        </Paper>
      </Box>
      <Box ml="1em" display="flex" gap="1em">
        <Button color="success" variant="contained" startIcon={<AttachMoney />}>
          Make Donation
        </Button>
        <Button color="secondary" variant="contained" startIcon={<Send />}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatTextbox;
