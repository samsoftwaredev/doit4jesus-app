import { EventMessages } from "@/interfaces/index";
import ChatMessage from "../ChatMessage";
import { Typography } from "@mui/material";

interface Props {
  messages?: EventMessages[];
}

const ChatList = ({ messages }: Props) => {
  if (!messages) return null;
  return (
    <>
      {messages.map((data) => (
        <ChatMessage
          key={data.id}
          date={new Date(data.createdAt)}
          numLikes={data.like ? Object.values(data.like).length : 0}
          donationAmount={data.donationAmount}
          user={{
            firstName: data.firstName || "",
            lastName: data.lastName || "",
          }}
        >
          <Typography>
            {data.id} - {data.message}
          </Typography>
        </ChatMessage>
      ))}
    </>
  );
};

export default ChatList;
