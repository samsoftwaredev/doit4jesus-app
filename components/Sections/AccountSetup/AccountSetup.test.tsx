import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import AccountSetup from './AccountSetup';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img alt={props.alt} data-testid="next-image" />,
}));

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../ConfettiCelebration', () => ({
  __esModule: true,
  default: () => <div data-testid="confetti" />,
}));

const mockTranslations = {
  welcomeTitle: 'Welcome',
  welcomeDescription: 'Hello {{firstName}} {{lastName}}',
  joinedAppBadge: 'You earned a badge!',
  whatsTheRosary: "What's the Rosary?",
  whatAreTheBenefits: 'What are the benefits?',
  whyPrayTheRosary: 'Why Pray the Rosary?',
  continue: 'Continue',
  back: 'Back',
  skip: 'Skip',
  finish: 'Finish',
  rosaryDescription: 'A meditation of events.',
  rosaryBenefits: 'Benefits text',
  whyPrayRosary: 'Why pray text',
};

describe('AccountSetup Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    (useUserContext as jest.Mock).mockReturnValue({
      user: { firstName: 'John' },
    });
  });

  it('renders the first step', () => {
    render(<AccountSetup />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<AccountSetup />);
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });
});
