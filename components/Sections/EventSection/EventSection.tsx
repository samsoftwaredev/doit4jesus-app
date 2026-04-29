import { Box, Card, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RealtimeChannel } from '@supabase/supabase-js';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { toast } from 'react-toastify';

import { supabase } from '@/classes';
import { ChatList, ChatTextbox } from '@/components';
import { useUserContext } from '@/context/UserContext';
import { DataEvent, EventMessages, VideoEvent } from '@/interfaces';
import { Json } from '@/interfaces/database';
import { EventMessagesDB } from '@/interfaces/databaseTable';
import {
  deleteEventMessage,
  editEventMessage,
  fetchEventMessages,
  likeEventMessage,
  sendEventMessage,
} from '@/services/eventsApi';
import { awardXP } from '@/services/spiritualXp';
import { theme } from '@/styles/mui-overwrite';
import { normalizeEventMessages } from '@/utils';

import DeleteMessageDialog from './DeleteMessageDialog';

const EventContainer = styled(Box)({
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1em',
  width: ' 100% ',
});

const EventDetailsCard = styled(Card)({
  marginTop: '2em',
  display: 'flex',
  flexDirection: 'column',
  gap: '1em',
  width: '95%',
  '& h1': {
    fontSize: '1.3em',
  },
});

const EventHeader = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  '@media (min-width: 1024px)': {
    flexDirection: 'row',
  },
});

interface Props {
  videoEvent: VideoEvent & DataEvent;
}

const EventSection = ({ videoEvent }: Props) => {
  const [messages, setMessages] = useState<EventMessages[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentMessageId, setCurrentMessageId] = useState<string>();
  const channel = useRef<RealtimeChannel | undefined>(undefined);
  const { user } = useUserContext();
  const numberOfPrayers = messages?.length ?? 0;

  const getEventMessages = async (id: number) => {
    try {
      const data = await fetchEventMessages(id);
      return normalizeEventMessages(data);
    } catch (error) {
      console.error(error);
      toast.error('Unable to retrieve messages');
    }
  };

  const onSendMessage = async (message: string) => {
    try {
      const data = await sendEventMessage({
        message,
        firstName: user?.firstName,
        lastName: user?.lastName,
        eventId: videoEvent.eventId,
      });
      if (data?.[0] && user?.userId) {
        await awardXP(
          user.userId,
          'prayer_request_submitted',
          {
            event_id: videoEvent.eventId,
            message_id: data[0].id,
          },
          {
            idempotencyKey: `prayer_request_submitted:${data[0].id}:${user.userId}`,
          },
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to send message');
    }
  };

  const subscribeToMessages = async () => {
    try {
      const eventMessages = await supabase
        .channel(`event-id-${videoEvent.eventId}-messages`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'event_messages' },
          (payload) => {
            const msgs = messages ? [...messages] : [];
            const newMessage = payload.new as EventMessagesDB;
            const normalizedMessages = normalizeEventMessages([newMessage]);
            if (normalizedMessages[0].eventId !== videoEvent.eventId) return;

            switch (payload.eventType) {
              case 'INSERT': {
                msgs.unshift(normalizedMessages[0]);
                setMessages(msgs);
                break;
              }

              case 'UPDATE': {
                const index = msgs.findIndex(({ id }) => id === newMessage.id);
                if (index > -1) msgs.splice(index, 1, normalizedMessages[0]);
                break;
              }

              case 'DELETE':
              default: {
                const index = msgs.findIndex(({ id }) => id === newMessage.id);
                if (index > -1) msgs.splice(index, 1);
              }
            }
            setMessages(msgs);
          },
        )
        .subscribe();
      channel.current = eventMessages;
    } catch (error) {
      console.error(error);
      toast.error('Unable to subscribe to messages');
    }
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

  const handleDelete = async (messageId?: string) => {
    if (messageId === undefined) return;
    try {
      await deleteEventMessage(messageId);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error(error);
      toast.error('Unable to delete message');
    }
  };

  const handleEdit = async (messageId: string, newMessage: string) => {
    try {
      await editEventMessage(messageId, newMessage);
    } catch (error) {
      console.error(error);
      toast.error('Unable to update message');
    }
  };

  const handleReport = async (messageId: string) => {
    // TODO: update database
    toast.success(
      'Thanks for keeping our community safe. We are reviewing the comment.',
    );
  };

  const handleLike = async (messageId: string, likes: Json) => {
    try {
      await likeEventMessage(messageId, likes);
      if (user?.userId) {
        await awardXP(
          user.userId,
          'prayer_request_engagement',
          {
            event_id: videoEvent.eventId,
            message_id: messageId,
          },
          {
            idempotencyKey: `prayer_request_engagement:${messageId}:${user.userId}`,
          },
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to complete the action.');
    }
  };

  const handleCloseDeleteDialog = () => {
    setCurrentMessageId(undefined);
  };

  const handleOpenDeleteDialog = (messageId: string) => {
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
    <EventContainer>
      <Box className="video" sx={{ aspectRatio: '16/9', width: '100%' }}>
        <iframe
          frameBorder={0} // don't remove this attribute
        />
      </Box>
      <EventDetailsCard sx={{ p: 2 }}>
        <EventHeader>
          <Typography component="h1" variant="h2">
            {videoEvent.title}
          </Typography>
        </EventHeader>
        <Typography textAlign="right" fontSize="small">
          {moment(videoEvent.startedAt).fromNow()}
        </Typography>
        <Typography fontWeight="light" component="div">
          <Markdown>{videoEvent.description}</Markdown>
        </Typography>
      </EventDetailsCard>
      <EventDetailsCard sx={{ p: 2 }} aria-labelledby="prayers-heading">
        <Typography
          id="prayers-heading"
          fontWeight="bold"
          component="h2"
          variant="h4"
        >
          <span>{numberOfPrayers > 1 ? numberOfPrayers : null} Prayers</span>
        </Typography>
        <Box mb={3}>
          <ChatTextbox onSendMessage={onSendMessage} />
        </Box>
        <Grid container spacing={2}>
          {messages?.map((data) => (
            <ChatList
              key={data.id}
              handleDelete={handleOpenDeleteDialog}
              handleEdit={handleEdit}
              handleReport={handleReport}
              handleLike={handleLike}
              messageData={data}
            />
          ))}
        </Grid>
        <DeleteMessageDialog
          currentMessageId={currentMessageId}
          handleCloseDelete={handleCloseDeleteDialog}
          handleDelete={handleDelete}
        />
      </EventDetailsCard>
    </EventContainer>
  );
};

export default EventSection;
