import { render, screen } from '@testing-library/react';

import DailyScripture from './DailyScripture';

// ─── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('@/context/UserContext', () => ({
  useUserContext: () => ({
    user: { userId: 'user-123' },
  }),
}));

const mockGetDailyScripture = jest.fn();
const mockGetCompletion = jest.fn();
const mockRecordCompletion = jest.fn();

jest.mock('@/services/dailyScripture', () => ({
  getDailyScripture: (...args: any[]) => mockGetDailyScripture(...args),
  getScriptureCompletionToday: (...args: any[]) => mockGetCompletion(...args),
  recordScriptureCompletion: (...args: any[]) => mockRecordCompletion(...args),
}));

jest.mock('@/services/spiritualXp', () => ({
  awardXP: jest.fn().mockResolvedValue({ duplicate: false, awardedXp: 5 }),
}));

const MOCK_SCRIPTURE = {
  date: '2025-06-18',
  liturgicalTitle: 'Wednesday of the 11th Week in Ordinary Time',
  season: 'Ordinary Time',
  language: 'en' as const,
  featuredVerse: {
    reference: 'Mark 5:1-20',
    text: 'My name is Legion, for we are many.',
  },
  readings: [
    {
      type: 'first_reading' as const,
      label: 'First Reading',
      reference: 'Genesis 21:5-20',
      text: 'Abraham was a hundred years old when his son Isaac was born to him.',
      order: 1,
    },
    {
      type: 'responsorial_psalm' as const,
      label: 'Responsorial Psalm',
      reference: 'Psalm 34:7-8,10-13',
      text: 'The Lord hears the cry of the poor.',
      order: 2,
    },
    {
      type: 'gospel' as const,
      label: 'Gospel',
      reference: 'Mark 5:1-20',
      text: 'My name is Legion, for we are many.',
      order: 3,
    },
  ],
};

describe('DailyScripture', () => {
  beforeEach(() => {
    mockGetDailyScripture.mockResolvedValue(MOCK_SCRIPTURE);
    mockGetCompletion.mockResolvedValue(null);
    mockRecordCompletion.mockResolvedValue({ id: 1 });
  });

  it('renders the title and liturgical info after loading', async () => {
    render(<DailyScripture />);
    expect(await screen.findByText('Daily Scripture')).toBeInTheDocument();
    expect(
      screen.getByText('Wednesday of the 11th Week in Ordinary Time'),
    ).toBeInTheDocument();
    expect(screen.getByText('Ordinary Time')).toBeInTheDocument();
  });

  it('renders the featured verse', async () => {
    render(<DailyScripture />);
    const matches = await screen.findAllByText(
      /My name is Legion, for we are many/,
    );
    // Appears in featured verse block and in gospel accordion
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders reading labels', async () => {
    render(<DailyScripture />);
    expect(await screen.findByText('First Reading')).toBeInTheDocument();
    expect(screen.getByText('Responsorial Psalm')).toBeInTheDocument();
    expect(screen.getByText('Gospel')).toBeInTheDocument();
  });

  it('renders the Mark as Read button', async () => {
    render(<DailyScripture />);
    expect(
      await screen.findByRole('button', { name: /mark as read/i }),
    ).toBeInTheDocument();
  });

  it('shows completed state when already read', async () => {
    mockGetCompletion.mockResolvedValue({
      id: 1,
      user_id: 'user-123',
      liturgical_date: '2025-06-18',
      completed_at: '2025-06-18T10:00:00Z',
    });

    render(<DailyScripture />);
    expect(await screen.findByText(/Completed/)).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    mockGetDailyScripture.mockResolvedValue(null);

    render(<DailyScripture />);
    expect(
      await screen.findByText(/Unable to load today's readings/),
    ).toBeInTheDocument();
  });
});
