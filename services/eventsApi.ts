import type { Json } from '@/interfaces/database';
import type {
  EventMessagesActionsDB,
  EventMessagesDB,
  EventsDB,
  PostsDB,
  YouTubeDB,
} from '@/interfaces/databaseTable';
import { apiFetch } from '@/lib/api/client';

/** Fetch events, optionally filtered by language. */
export const fetchEvents = (lang?: string) => {
  const query = lang ? `?lang=${encodeURIComponent(lang)}` : '';
  return apiFetch<EventsDB[]>(`/api/events${query}`);
};

/** Fetch the next upcoming event. */
export const fetchNextEvent = () => apiFetch<EventsDB[]>('/api/events/next');

/** Fetch a single event by slug. */
export const fetchEventBySlug = (slug: string) =>
  apiFetch<EventsDB[]>(`/api/events/${encodeURIComponent(slug)}`);

/** Fetch messages for an event. */
export const fetchEventMessages = (eventId: number) =>
  apiFetch<
    (EventMessagesDB & {
      event_messages_actions: EventMessagesActionsDB | null;
    })[]
  >(`/api/events/messages?eventId=${eventId}`);

/** Send a new event message. */
export const sendEventMessage = (body: {
  message: string;
  firstName?: string;
  lastName?: string;
  eventId: number;
}) =>
  apiFetch<{ id: string }[]>('/api/events/messages', { method: 'POST', body });

/** Edit an event message. */
export const editEventMessage = (id: string, message: string) =>
  apiFetch(`/api/events/messages/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { message },
  });

/** Soft-delete an event message. */
export const deleteEventMessage = (id: string) =>
  apiFetch(`/api/events/messages/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

/** Upsert likes on a message action. */
export const likeEventMessage = (id: string, likes: Json) =>
  apiFetch(`/api/events/messages/actions/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: { likes },
  });

/** Fetch a YouTube video by ID. */
export const fetchVideo = (id: string) =>
  apiFetch<YouTubeDB[]>(`/api/videos/${encodeURIComponent(id)}`);

/** Fetch all posts. */
export const fetchPosts = () => apiFetch<PostsDB[]>('/api/posts');

/** Fetch a single post by slug. */
export const fetchPostBySlug = (slug: string) =>
  apiFetch<PostsDB[]>(`/api/posts/${encodeURIComponent(slug)}`);
