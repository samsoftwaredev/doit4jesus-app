import { toast } from 'react-toastify';

import { supabase } from '@/classes';

import { handleLoginSuccess } from './GoogleAuth.tools';

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('@/classes', () => ({
  supabase: {
    auth: {
      signInWithIdToken: jest.fn(),
    },
  },
}));

describe('handleLoginSuccess', () => {
  const callback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signs in and calls callback on success', async () => {
    (supabase.auth.signInWithIdToken as jest.Mock).mockResolvedValue({
      error: null,
    });
    await handleLoginSuccess({ credential: 'token123' } as any, callback);
    expect(supabase.auth.signInWithIdToken).toHaveBeenCalledWith({
      provider: 'google',
      token: 'token123',
    });
    expect(toast.success).toHaveBeenCalledWith('Login successful');
    expect(callback).toHaveBeenCalled();
  });

  it('shows error toast on auth failure', async () => {
    (supabase.auth.signInWithIdToken as jest.Mock).mockResolvedValue({
      error: new Error('fail'),
    });
    await handleLoginSuccess({ credential: 'token123' } as any, callback);
    expect(toast.error).toHaveBeenCalledWith('Failed to authenticate');
    expect(callback).not.toHaveBeenCalled();
  });

  it('shows error toast when no credentials', async () => {
    await handleLoginSuccess({} as any, callback);
    expect(toast.error).toHaveBeenCalledWith('No credentials received');
  });
});
