import { render, screen, waitFor } from '@testing-library/react';

import { useUserContext } from '@/context/UserContext';

import ProtectedRoute from './ProtectedRoute';

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

const mockPush = jest.fn();
const mockGetSession = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/classes/SupabaseDB', () => ({
  supabase: {
    auth: {
      getSession: (...args: any[]) => mockGetSession(...args),
    },
  },
}));

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when user is authenticated and session is valid', async () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1' },
    });
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(await screen.findByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('returns null and redirects when session is missing', async () => {
    (useUserContext as jest.Mock).mockReturnValue({ user: null });
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
    expect(container.firstChild).toBeNull();
  });
});
