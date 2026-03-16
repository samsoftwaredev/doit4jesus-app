import { fireEvent, render, screen } from '@testing-library/react';

import Dialog from './Dialog';

describe('Dialog Component', () => {
  const mockHandleClose = jest.fn();

  it('renders with modal title', () => {
    render(
      <Dialog open handleClose={mockHandleClose} modalTitle="Test Title" />,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Dialog open handleClose={mockHandleClose}>
        <p>Dialog content</p>
      </Dialog>,
    );
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<Dialog open handleClose={mockHandleClose} />);
    const closeButton = screen.getByLabelText('close');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls handleClose when close button is clicked', () => {
    render(<Dialog open handleClose={mockHandleClose} />);
    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('renders actions when provided', () => {
    render(
      <Dialog
        open
        handleClose={mockHandleClose}
        actions={<button>Save</button>}
      />,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('does not render actions section when no actions provided', () => {
    render(<Dialog open handleClose={mockHandleClose} />);
    // Only the close button should exist, no actions
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });
});
