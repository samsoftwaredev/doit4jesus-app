import '@testing-library/jest-dom';

// Mock @vercel/analytics
jest.mock('@vercel/analytics', () => ({
  track: jest.fn(),
  Analytics: jest.fn(),
}));
