import { fireEvent, render, screen } from '@testing-library/react';

import TitleNav from './TitleNav';

describe('TitleNav Component', () => {
  it('renders title and description', () => {
    render(<TitleNav title="My Title" description="My Description" />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
    expect(screen.getByText('My Description')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<TitleNav title="Title" description="Desc" subTitle="Sub Title" />);
    expect(screen.getByText('Sub Title')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<TitleNav title="Title" description="Desc" />);
    expect(screen.queryByText('Sub Title')).not.toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const mockOnBack = jest.fn();
    render(<TitleNav title="Title" description="Desc" onBack={mockOnBack} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnBack).toHaveBeenCalled();
  });
});
