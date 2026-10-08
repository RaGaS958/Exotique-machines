import React, { useState } from 'react';
import { img, srcSet } from '../lib/img';

interface Props extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  id: string; // unsplash photo id
  sizes?: string;
  w?: number;
  eager?: boolean;
  position?: string;
}

/** Responsive Unsplash image that fades in once decoded instead of popping. */
export default function Img({ id, sizes = '100vw', w = 1600, eager, position, className = '', style, alt = '', ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={img(id, w)}
      srcSet={srcSet(id)}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      data-loaded={loaded}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      draggable={false}
      className={`img-fade ${className}`}
      style={{ objectPosition: position, ...style }}
      {...rest}
    />
  );
}
