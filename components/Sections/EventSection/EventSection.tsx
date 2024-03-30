import { Box, Card, Typography } from "@mui/material";
import { css } from "@/utils/helpers";
import styles from "./eventSection.module.scss";
import { DataEvent, EventMessages, VideoEvent } from "@/interfaces/index";
import moment from "moment";
import { useUserContext } from "@/context/UserContext";
import ChatTextbox from "@/components/ChatTextbox/ChatTextbox";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { db, supabase } from "@/class/SupabaseDB";
import { normalizeEventMessages } from "@/utils/normalizers";
import ChatList from "@/components/ChatList";
import { RealtimeChannel } from "@supabase/supabase-js";
import { EventMessagesDB } from "@/interfaces/databaseTable";

interface Props {
  videoEvent: VideoEvent & DataEvent;
}

const EventSection = ({ videoEvent }: Props) => {
  const [messages, setMessages] = useState<EventMessages[]>();
  const channel = useRef<RealtimeChannel | undefined>();
  const { user } = useUserContext();
  const numberOfPrayers = messages?.length ?? 0;

  const getEventMessages = async (id: number) => {
    const { data, error } = await db
      .getEventMessages()
      .select("*")
      .order("created_at", { ascending: false })
      .eq("event_id", id);
    if (!error) {
      return normalizeEventMessages(data);
    } else {
      console.error(error);
      toast.error("Unable to retrieve messages");
    }
  };

  const onSendMessage = async (message: string) => {
    const { error } = await db
      .getEventMessages()
      .insert([
        {
          message,
          first_name: user?.firstName,
          last_name: user?.lastName,
          event_id: videoEvent.eventId,
        },
      ])
      .select();
    if (error) {
      console.error(error);
      toast.error("Unable to send message");
    }
  };

  const subscribeToMessages = async () => {
    const eventMessages = await supabase
      .channel(`event-id-${videoEvent.eventId}-messages`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_messages" },
        (payload) => {
          console.log(payload);
          switch (payload.eventType) {
            case "INSERT": {
              const messageList = messages ? [...messages] : [];
              const newMessage = payload.new as EventMessagesDB;
              const normalizedMessages = normalizeEventMessages([newMessage]);
              messageList.unshift(normalizedMessages[0]);
              setMessages(messageList);
              break;
            }
            case "UPDATE": {
              const messageList = messages ? [...messages] : [];
              const newMessage = payload.new as EventMessagesDB;
              const normalizedMessages = normalizeEventMessages([newMessage]);
              const index = messages?.findIndex(
                ({ id }) => id === newMessage.id
              );
              if (index) {
                messageList.splice(index, 1, normalizedMessages[0]);
                setMessages(messageList);
              }
              break;
            }
            case "DELETE":
            default: {
              const messageList = messages ? [...messages] : [];
              const newMessage = payload.new as EventMessagesDB;
              const index = messages?.findIndex(
                ({ id }) => id === newMessage.id
              );
              if (index) {
                messageList.splice(index, 1);
                setMessages(messageList);
              }
            }
          }
        }
      )
      .subscribe();
    channel.current = eventMessages;
  };

  const untrackMessages = async () => {
    if (channel.current) await channel.current!.untrack();
  };

  const setUp = async () => {
    const messageList = await getEventMessages(videoEvent.eventId);
    setMessages(messageList);
  };

  useEffect(() => {
    setUp();
  }, []);

  useEffect(() => {
    subscribeToMessages();
    return () => {
      untrackMessages();
    };
  }, [messages]);

  return (
    <Box className={styles.container}>
      <Box className="video">
        <iframe
          frameBorder={0} // don't remove this attribute
        />
      </Box>
      <Card className={css(styles.eventDetails, "appCard")}>
        <Box display="flex" gap={1} className={styles.eventHeader}>
          <Typography component="h1">{videoEvent.title}</Typography>
          {/* <Box sx={{ flexGrow: 1 }} />
          <Button
            color="secondary"
            variant="contained"
            startIcon={<Favorite />}
          >
            Like
          </Button>
          <Button color="secondary" variant="contained" startIcon={<Reply />}>
            Share
          </Button>
          <Button
            color="success"
            variant="contained"
            startIcon={<AttachMoney />}
          >
            Donate
          </Button> */}
        </Box>
        <Typography textAlign="right" fontSize="0.9em">
          {moment(videoEvent.startedAt).fromNow()}
        </Typography>
        <Typography>{videoEvent.description}</Typography>
      </Card>
      <Card className={css(styles.eventDetails, "appCard")}>
        <Typography fontWeight="bold" component="h4" variant="h4">
          <span>{numberOfPrayers > 1 ? numberOfPrayers : null} Prayers</span>
        </Typography>
        <Box mb={3}>
          <ChatTextbox onSendMessage={onSendMessage} />
        </Box>
        <ChatList messages={messages} />
      </Card>
    </Box>
  );
};

export default EventSection;
