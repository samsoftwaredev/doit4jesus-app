import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import TotalRosariesPrayed from './TotalRosariesPrayed';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('@/services/rosaryApi', () => ({
  fetchTotalRosaryCount: jest.fn().mockResolvedValue({ count: 1000 }),
}));

const component = () => (
  <LanguageContextProvider>
    <TotalRosariesPrayed />
  </LanguageContextProvider>
);

describe('TotalRosariesPrayed Component', () => {
  it('renders without crashing', () => {
    const { container } = render(component());
    expect(container.firstChild).toBeInTheDocument();
  });
});
