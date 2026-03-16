import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import ProgressLevelsSection from './ProgressLevelsSection';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@/utils/levels', () => ({
  getCurrentLevel: jest.fn().mockReturnValue({
    levelNum: 1,
    levelName: 'Beginner',
    nextLevelName: 'Intermediate',
    requirement: 10,
    nextRequirement: 50,
  }),
  levels: [
    { name: 'Beginner', requirement: 0, value: 'beginner' },
    { name: 'Intermediate', requirement: 50, value: 'intermediate' },
    { name: 'Advanced', requirement: 100, value: 'advanced' },
  ],
}));

jest.mock('../../Dialog', () => ({
  __esModule: true,
  default: ({ children, isOpen }: any) =>
    isOpen ? <div data-testid="dialog">{children}</div> : null,
}));

jest.mock('../../RosaryLevel', () => ({
  __esModule: true,
  default: () => <div data-testid="rosary-level" />,
}));

jest.mock('../../RosaryLevelInfo', () => ({
  __esModule: true,
  default: () => <div data-testid="rosary-level-info" />,
}));

const mockTranslations = {
  raceToHeaven: 'Race to Heaven',
  rosaryLevels: 'Rosary Levels',
  seeLevels: 'See Levels',
  progress: 'Progress',
  of: 'of',
  rosaries: 'rosaries',
};

describe('ProgressLevelsSection Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    (useUserContext as jest.Mock).mockReturnValue({
      user: { stats: { rosaryTotalCount: 5 } },
    });
  });

  it('renders heading', () => {
    render(<ProgressLevelsSection />);
    expect(screen.getByText('Rosary Levels')).toBeInTheDocument();
  });

  it('renders see levels button', () => {
    render(<ProgressLevelsSection />);
    expect(screen.getByText('See Levels')).toBeInTheDocument();
  });
});
