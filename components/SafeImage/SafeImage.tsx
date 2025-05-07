'use client';

// if using App Router
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  src: string;
  alt?: string;
  [key: string]: any;
}

function SafeImage({ src, alt, ...props }: Props) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null; // Show nothing if image fails to load

  return (
    <Image
      src={src}
      alt={alt || ''}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}

export default SafeImage;
