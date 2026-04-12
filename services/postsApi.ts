import type { PostsDB } from '@/interfaces/databaseTable';
import { apiFetch } from '@/lib/api/client';

/** Fetch all posts. */
export const fetchPosts = () => apiFetch<PostsDB[]>('/api/posts');

/** Fetch a single post by slug. */
export const fetchPostBySlug = (slug: string) =>
  apiFetch<PostsDB[]>(`/api/posts/${encodeURIComponent(slug)}`);
