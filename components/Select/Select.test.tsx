import { render, screen } from '@testing-library/react';

import Select from './Select';

describe('Select Component', () => {
  const menuItems = [
    { value: 'en', name: 'English' },
    { value: 'es', name: 'Spanish' },
  ];

  it('renders the select element', () => {
    render(<Select menuItems={menuItems} defaultValue="en" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays the selected value', () => {
    render(<Select menuItems={menuItems} value="en" />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });
});
