import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

import { LanguageContextProvider } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import RosaryStats from './RosaryStats';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
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
  const mockPush = jest.fn();
  const mockUser = {
    stats: {
      rosaryTotalCount: 10,
    },
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
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

  it('renders the "Start Praying" button', () => {
    render(component());
    const buttonElement = screen.getByTestId('startPraying');
    expect(buttonElement).toBeInTheDocument();
  });

  it('navigates to the app link when the button is clicked', () => {
    render(component());
    const buttonElement = screen.getByTestId('startPraying');
    fireEvent.click(buttonElement);
    expect(mockPush).toHaveBeenCalledWith('/app');
  });
});
