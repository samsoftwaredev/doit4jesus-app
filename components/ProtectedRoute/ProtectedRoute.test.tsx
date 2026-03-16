import { render, screen } from '@testing-library/react';

import { useUserContext } from '@/context/UserContext';

import ProtectedRoute from './ProtectedRoute';

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('ProtectedRoute Component', () => {
  it('renders children when user is authenticated', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1' },
    });
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('returns null and redirects when user is not authenticated', () => {
    (useUserContext as jest.Mock).mockReturnValue({ user: null });
    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );
    expect(container.firstChild).toBeNull();
  });
});
