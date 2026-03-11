import '@testing-library/jest-dom';

// Mock @vercel/analytics
jest.mock('@vercel/analytics', () => ({
  track: jest.fn(),
  Analytics: jest.fn(),
}));

jest.mock('next/router', () => ({
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
}));
