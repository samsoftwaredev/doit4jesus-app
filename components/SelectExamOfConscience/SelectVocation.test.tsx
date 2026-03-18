import { fireEvent, render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';

import SelectVocation from './SelectVocation';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

const mockTranslations = {
  selectStateInLife: 'Select your state in life:',
  married: 'Married',
  single: 'Single',
  religiousOrder: 'Religious Order',
  marriedDescription:
    'Examine your conscience in light of your duties as a spouse and the sacrament of marriage.',
  singleDescription:
    'Examine your conscience regarding chastity, vocation discernment, and your responsibilities in the single life.',
  religiousDescription:
    'Examine your conscience regarding the evangelical counsels of poverty, chastity, and obedience.',
};

describe('SelectVocation Component', () => {
  const mockOnVocationSelected = jest.fn();

  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({
      t: mockTranslations,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the selection heading', () => {
    render(<SelectVocation onVocationSelected={mockOnVocationSelected} />);
    expect(screen.getByText('Select your state in life:')).toBeInTheDocument();
  });

  it('renders three vocation cards', () => {
    render(<SelectVocation onVocationSelected={mockOnVocationSelected} />);
    expect(screen.getByText('Married')).toBeInTheDocument();
    expect(screen.getByText('Single')).toBeInTheDocument();
    expect(screen.getByText('Religious Order')).toBeInTheDocument();
  });

  it('renders vocation descriptions', () => {
    render(<SelectVocation onVocationSelected={mockOnVocationSelected} />);
    expect(
      screen.getByText(/Examine your conscience in light of your duties/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Examine your conscience regarding chastity/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Examine your conscience regarding the evangelical counsels/,
      ),
    ).toBeInTheDocument();
  });

  it('calls onVocationSelected with correct vocation when card is clicked', () => {
    render(<SelectVocation onVocationSelected={mockOnVocationSelected} />);
    fireEvent.click(screen.getByText('Married'));
    expect(mockOnVocationSelected).toHaveBeenCalledWith('married');
  });
});
