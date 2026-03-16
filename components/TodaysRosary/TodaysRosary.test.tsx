import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';

import TodaysRosary from './TodaysRosary';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/classes/Rosary', () => ({
  Rosary: jest.fn().mockImplementation(() => ({
    getRosaryState: jest.fn().mockReturnValue({
      mystery: 'gloriousMysteries',
      mysteryAudio: 'audio-1',
    }),
  })),
}));

jest.mock('@/classes/SupabaseDB', () => ({
  default: jest.fn(),
  db: {
    getYouTubeVideo: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest
          .fn()
          .mockResolvedValue({ data: [{ id: 'yt-1' }], error: null }),
      }),
    }),
    getEvents: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: [{ slug: 'event-1', picture_url: 'https://img.jpg' }],
          error: null,
        }),
      }),
    }),
  },
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img alt={props.alt} data-testid="next-image" />,
}));

jest.mock('dayjs', () => {
  const actual = jest.requireActual('dayjs');
  return Object.assign((...args: any[]) => actual(...args), actual, {
    __esModule: true,
    default: Object.assign((...args: any[]) => actual(...args), actual),
  });
});

jest.mock('../Loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading</div>,
}));

const mockTranslations = {
  todaysRosary: "Today's Rosary",
  gloriousMysteries: 'Glorious Mysteries',
  prayTodaysRosary: "Pray Today's Rosary",
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
};

describe('TodaysRosary Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (useLanguageContext as jest.Mock).mockReturnValue({
      lang: 'en',
      t: mockTranslations,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders loading initially', () => {
    render(<TodaysRosary />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
