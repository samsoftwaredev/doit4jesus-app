import { fireEvent, render, screen } from '@testing-library/react';

import RadioButtons from './RadioButtons';

describe('RadioButtons Component', () => {
  const items = [{ label: 'Male' }, { label: 'Female' }];

  it('renders all radio options', () => {
    render(<RadioButtons items={items} />);
    expect(screen.getByLabelText('Male')).toBeInTheDocument();
    expect(screen.getByLabelText('Female')).toBeInTheDocument();
  });

  it('selects a radio option on click', () => {
    render(<RadioButtons items={items} />);
    const maleRadio = screen.getByLabelText('Male');
    fireEvent.click(maleRadio);
    expect(maleRadio).toBeChecked();
  });

  it('only allows one selection at a time', () => {
    render(<RadioButtons items={items} />);
    const maleRadio = screen.getByLabelText('Male');
    const femaleRadio = screen.getByLabelText('Female');
    fireEvent.click(maleRadio);
    fireEvent.click(femaleRadio);
    expect(maleRadio).not.toBeChecked();
    expect(femaleRadio).toBeChecked();
  });
});
