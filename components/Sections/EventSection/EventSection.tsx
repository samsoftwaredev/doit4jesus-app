import { Box, Button, Card, Typography } from "@mui/material";
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
import dayjs from "dayjs";
import { Json } from "@/interfaces/database";
import { Dialog } from "../..";

interface Props {
  videoEvent: VideoEvent & DataEvent;
}

const EventSection = ({ videoEvent }: Props) => {
  const [messages, setMessages] = useState<EventMessages[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentMessageId, setCurrentMessageId] = useState<string>();
  const channel = useRef<RealtimeChannel | undefined>();
  const { user } = useUserContext();
  const numberOfPrayers = messages?.length ?? 0;

  const getEventMessages = async (id: number) => {
    const joinTables = `
    created_at, deleted_at, donation_amount, event_id, first_name, id, last_name, message, reply_id, updated_at, user_id,
    event_messages_actions(id, likes, flagged, created_at)
    `;
    const { data, error } = await db
      .getEventMessages()
      .select(joinTables)
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
          const msgs = messages ? [...messages] : [];
          const newMessage = payload.new as EventMessagesDB;
          const normalizedMessages = normalizeEventMessages([newMessage]);
          if (normalizedMessages[0].eventId !== videoEvent.eventId) return;

          switch (payload.eventType) {
            case "INSERT": {
              msgs.unshift(normalizedMessages[0]);
              setMessages(msgs);
              break;
            }

            case "UPDATE": {
              const index = msgs.findIndex(({ id }) => id === newMessage.id);
              if (index > -1) msgs.splice(index, 1, normalizedMessages[0]);
              break;
            }

            case "DELETE":
            default: {
              const index = msgs.findIndex(({ id }) => id === newMessage.id);
              if (index > -1) msgs.splice(index, 1);
            }
          }
          setMessages(msgs);
        }
      )
      .subscribe();
    channel.current = eventMessages;
  };

  const untrackMessages = async () => {
    if (channel.current) await channel.current!.untrack();
  };

  const setUp = async () => {
    setIsLoading(true);
    const messageList = await getEventMessages(videoEvent.eventId);
    setMessages(messageList);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (currentMessageId) {
      const { data, error } = await db
        .getEventMessages()
        .update({
          deleted_at: new Date().toISOString(),
        })
        .eq("id", currentMessageId)
        .select();
      if (error) toast.error("Unable to delete message");
      if (data) setCurrentMessageId(undefined);
    }
  };

  const handleEdit = async (messageId: string, newMessage: string) => {
    const { error } = await db
      .getEventMessages()
      .update({
        message: newMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", messageId)
      .select();
    if (error) toast.error("Unable to update message");
  };

  const handleReport = async (messageId: string) => {
    // TODO: update database
    toast.success(
      "Thanks for keeping our community safe. We are reviewing the comment."
    );
  };

  const handleLike = async (messageId: string, likes: Json) => {
    const { error } = await db
      .getEventMessagesActions()
      .upsert({ likes, id: messageId })
      .select();
    if (error) toast.error("Unable to complete the action.");
  };

  const handleCloseDelete = () => {
    setCurrentMessageId(undefined);
  };

  const handleOpenDelete = (messageId: string) => {
    setCurrentMessageId(messageId);
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

  if (isLoading) return null;

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
        {messages?.map((data) => (
          <ChatList
            key={data.id}
            handleDelete={handleOpenDelete}
            handleEdit={handleEdit}
            handleReport={handleReport}
            handleLike={handleLike}
            message={data}
          />
        ))}
        <Dialog
          open={!!currentMessageId}
          handleClose={handleCloseDelete}
          modalTitle="Delete Message"
          actions={
            <>
              <Button onClick={handleCloseDelete}>Close</Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete Message
              </Button>
            </>
          }
        >
          <Box>
            <Typography>
              Are you sure you want to delete this message?
            </Typography>
          </Box>
        </Dialog>
      </Card>
    </Box>
  );
};

export default EventSection;
