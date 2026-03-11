import { render, screen, fireEvent } from '@testing-library/react';

import SafeImage from './SafeImage';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('SafeImage Component', () => {
  const mockSrc = 'https://example.com/image.jpg';
  const mockAlt = 'Test image';

  it('should render image with correct src and alt', () => {
    render(<SafeImage src={mockSrc} alt={mockAlt} />);
    const image = screen.getByRole('img');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockSrc);
    expect(image).toHaveAttribute('alt', mockAlt);
  });

  it('should use empty string for alt when not provided', () => {
    render(<SafeImage src={mockSrc} />);
    const image = screen.getByRole('img');

    expect(image).toHaveAttribute('alt', '');
  });

  it('should render null when image fails to load', () => {
    const { container, rerender } = render(<SafeImage src={mockSrc} />);
    const image = screen.getByRole('img');

    // Simulate image load error
    fireEvent.error(image);

    // Re-render to reflect state change
    rerender(<SafeImage src={mockSrc} />);

    // After error, component should render null
    expect(container.firstChild).toBeNull();
  });

  it('should pass additional props to Image component', () => {
    const additionalProps = {
      width: 100,
      height: 100,
      className: 'test-class',
    };

    render(<SafeImage src={mockSrc} alt={mockAlt} {...additionalProps} />);
    const image = screen.getByRole('img');

    expect(image).toHaveAttribute('width', '100');
    expect(image).toHaveAttribute('height', '100');
    expect(image).toHaveClass('test-class');
  });

  it('should handle multiple images independently', () => {
    const { rerender } = render(
      <>
        <SafeImage src={mockSrc} alt="Image 1" />
        <SafeImage src="https://example.com/image2.jpg" alt="Image 2" />
      </>,
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);

    // Trigger error on first image
    fireEvent.error(images[0]);

    rerender(
      <>
        <SafeImage src={mockSrc} alt="Image 1" />
        <SafeImage src="https://example.com/image2.jpg" alt="Image 2" />
      </>,
    );

    // Second image should still be visible
    const remainingImages = screen.getAllByRole('img');
    expect(remainingImages).toHaveLength(1);
    expect(remainingImages[0]).toHaveAttribute('alt', 'Image 2');
  });
});
