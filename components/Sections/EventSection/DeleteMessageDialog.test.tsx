import { fireEvent, render, screen } from '@testing-library/react';

import DeleteMessageDialog from './DeleteMessageDialog';

jest.mock('../..', () => ({
  Dialog: ({ open, handleClose, modalTitle, children, actions }: any) =>
    open ? (
      <div data-testid="dialog">
        <span>{modalTitle}</span>
        {children}
        {actions}
        <button onClick={handleClose}>CloseDialog</button>
      </div>
    ) : null,
}));

describe('DeleteMessageDialog Component', () => {
  const mockHandleCloseDelete = jest.fn();
  const mockHandleDelete = jest.fn().mockResolvedValue(undefined);

  it('renders when currentMessageId is provided', () => {
    render(
      <DeleteMessageDialog
        currentMessageId="msg-1"
        handleCloseDelete={mockHandleCloseDelete}
        handleDelete={mockHandleDelete}
      />,
    );
    expect(
      screen.getByText('Are you sure you want to delete this message?'),
    ).toBeInTheDocument();
  });

  it('does not render when currentMessageId is undefined', () => {
    render(
      <DeleteMessageDialog
        handleCloseDelete={mockHandleCloseDelete}
        handleDelete={mockHandleDelete}
      />,
    );
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('calls handleDelete with message ID when delete button clicked', () => {
    render(
      <DeleteMessageDialog
        currentMessageId="msg-1"
        handleCloseDelete={mockHandleCloseDelete}
        handleDelete={mockHandleDelete}
      />,
    );
    const deleteButtons = screen.getAllByText('Delete Message');
    // Click the button (not the dialog title)
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    expect(mockHandleDelete).toHaveBeenCalledWith('msg-1');
  });

  it('calls handleCloseDelete when close button clicked', () => {
    render(
      <DeleteMessageDialog
        currentMessageId="msg-1"
        handleCloseDelete={mockHandleCloseDelete}
        handleDelete={mockHandleDelete}
      />,
    );
    fireEvent.click(screen.getByText('Close'));
    expect(mockHandleCloseDelete).toHaveBeenCalled();
  });
});
