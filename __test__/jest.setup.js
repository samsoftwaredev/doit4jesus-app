import '@testing-library/jest-dom';

import enJSON from '../locales/en.json';

afterEach(() => {
  jest.clearAllMocks(); // Clears call history and instances [5, 9]
  // jest.resetAllMocks(); // Also removes mock implementation [5]
  // jest.restoreAllMocks(); // Restores original implementation (for spyOn) [5]
});

// Global mock for LanguageContext – individual tests can override with their own jest.mock
jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: () => ({
    t: enJSON,
    lang: 'en',
    changeLang: jest.fn(),
    setLang: jest.fn(),
  }),
  LanguageContextProvider: ({ children }) => children,
}));

// Global mock for ThemeContext – individual tests can override with their own jest.mock
jest.mock('@/context/ThemeContext', () => ({
  useThemeContext: () => ({
    mode: 'dark',
    toggleTheme: jest.fn(),
  }),
  ThemeContextProvider: ({ children }) => children,
}));

// Mock @vercel/analytics
jest.mock('@vercel/analytics', () => ({
  track: jest.fn(),
  Analytics: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line
  default: (props) => <img {...props} />,
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: jest.fn(),
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));
