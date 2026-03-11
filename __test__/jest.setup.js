import '@testing-library/jest-dom';

afterEach(() => {
  jest.clearAllMocks(); // Clears call history and instances [5, 9]
  // jest.resetAllMocks(); // Also removes mock implementation [5]
  // jest.restoreAllMocks(); // Restores original implementation (for spyOn) [5]
});

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
