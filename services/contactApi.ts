import { apiFetch } from '@/lib/api/client';

/** Send the contact-us form. */
export const sendContactForm = (body: {
  userEmail: string;
  userName: string;
  userMessage: string;
}) => apiFetch('/api/contact', { method: 'POST', body });
