import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import TotalRosariesPrayed from './TotalRosariesPrayed';

jest.mock('@/classes', () => ({
  supabase: {
    rpc: jest.fn().mockResolvedValue({ data: 1000, error: null }),
  },
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
