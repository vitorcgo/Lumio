'use client';

import Image from 'next/image';
import { useState } from 'react';

import { tileBlurDataURL, tileGradient } from '@/lib/format';

interface PosterImageProps {
  src: string;
  alt: string;
  /** matiz do degradê exibido enquanto a imagem carrega, falta ou falha */
  hue: number;
  sizes: string;
  priority?: boolean;
  /** `object-position` da imagem, p.ex. `center 30%` */
  position?: string;
  className?: string;
}

/**
 * Pôster com fallback em degradê.
 *
 * O degradê fica sempre atrás da imagem: cobre o carregamento, o item sem
 * `img` e a URL quebrada: nunca uma caixa cinza vazia. O contêiner precisa ser
 * `relative overflow-hidden`.
 */
export function PosterImage({
  src,
  alt,
  hue,
  sizes,
  priority = false,
  position,
  className = '',
}: PosterImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: tileGradient(hue) }}
      />
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          placeholder="blur"
          blurDataURL={tileBlurDataURL(hue)}
          style={position ? { objectPosition: position } : undefined}
          className={`object-cover ${className}`}
        />
      ) : null}
    </>
  );
}
