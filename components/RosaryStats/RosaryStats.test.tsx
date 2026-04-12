import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import RosaryStats from './RosaryStats';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn().mockReturnValue('/'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

const component = () => {
  return (
    <LanguageContextProvider>
      <RosaryStats />
    </LanguageContextProvider>
  );
};

describe('RosaryStats', () => {
  const mockUser = {
    stats: {
      rosaryTotalCount: 10,
    },
  };

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({ user: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the rosary total count', () => {
    render(component());
    const countElement = screen.getByText(mockUser.stats.rosaryTotalCount);
    expect(countElement).toBeInTheDocument();
  });
});
