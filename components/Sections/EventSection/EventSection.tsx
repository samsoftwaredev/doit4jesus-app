import { Box, Card, Typography } from '@mui/material';
import { RealtimeChannel } from '@supabase/supabase-js';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { toast } from 'react-toastify';

import { db, supabase } from '@/classes';
import { ChatList, ChatTextbox } from '@/components';
import { useUserContext } from '@/context/UserContext';
import { DataEvent, EventMessages, VideoEvent } from '@/interfaces';
import { Json } from '@/interfaces/database';
import { EventMessagesDB } from '@/interfaces/databaseTable';
import { css, normalizeEventMessages } from '@/utils';

import DeleteMessageDialog from './DeleteMessageDialog';
import styles from './eventSection.module.scss';

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
    try {
      const { data, error } = await db
        .getEventMessages()
        .select(joinTables)
        .order('created_at', { ascending: false })
        .eq('event_id', id);
      if (!error) {
        return normalizeEventMessages(data);
      } else {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to retrieve messages');
    }
  };

  const onSendMessage = async (message: string) => {
    try {
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
        throw new Error(error.message);
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
      const { data, error } = await db
        .getEventMessages()
        .update({
          deleted_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .select();
      if (error) throw new Error(error.message);
      if (data) handleCloseDeleteDialog();
    } catch (error) {
      console.error(error);
      toast.error('Unable to delete message');
    }
  };

  const handleEdit = async (messageId: string, newMessage: string) => {
    try {
      const { error } = await db
        .getEventMessages()
        .update({
          message: newMessage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .select();
      if (error) {
        throw new Error(error.message);
      }
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
      const { error } = await db
        .getEventMessagesActions()
        .upsert({ likes, id: messageId })
        .select();
      if (error) {
        throw new Error(error.message);
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
    <Box component="section" className={styles.container}>
      <Box className="video" sx={{ aspectRatio: '16/9', width: '100%' }}>
        <iframe
          frameBorder={0} // don't remove this attribute
        />
      </Box>
      <Card component="article" className={css(styles.eventDetails, 'appCard')}>
        <Box display="flex" gap={1} className={styles.eventHeader}>
          <Typography component="h1" variant="h2">
            {videoEvent.title}
          </Typography>
        </Box>
        <Typography
          component="time"
          dateTime={videoEvent.startedAt}
          textAlign="right"
          fontSize="small"
        >
          {moment(videoEvent.startedAt).fromNow()}
        </Typography>
        <Typography fontWeight="light" component="div">
          <Markdown>{videoEvent.description}</Markdown>
        </Typography>
      </Card>
      <Card
        component="section"
        aria-labelledby="prayers-heading"
        className={css(styles.eventDetails, 'appCard')}
      >
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
        {messages?.map((data) => (
          <ChatList
            key={data.id}
            handleDelete={handleOpenDeleteDialog}
            handleEdit={handleEdit}
            handleReport={handleReport}
            handleLike={handleLike}
            message={data}
          />
        ))}
        <DeleteMessageDialog
          currentMessageId={currentMessageId}
          handleCloseDelete={handleCloseDeleteDialog}
          handleDelete={handleDelete}
        />
      </Card>
    </Box>
  );
};

export default EventSection;
