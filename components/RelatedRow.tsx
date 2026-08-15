'use client';

import { MediaCard } from './MediaCard';
import { RowScroller, SectionHeading } from './MediaRow';
import type { MediaView } from '@/lib/types';

const WIDTHS = {
  default: 'w-[132px] sm:w-[160px] lg:w-[196px]',
  compact: 'w-[112px] sm:w-[128px] lg:w-[144px]',
} as const;

const SIZES = {
  default: '(max-width: 639px) 132px, (max-width: 1023px) 160px, 196px',
  compact: '(max-width: 639px) 112px, (max-width: 1023px) 128px, 144px',
} as const;

export function RelatedRow({
  items,
  title = 'Você também pode gostar',
  variant = 'default',
  className = 'pt-2 pb-10',
  flush = false,
}: {
  items: MediaView[];
  title?: string;
  /** `compact` usa cards menores: cabe melhor embaixo do player. */
  variant?: keyof typeof WIDTHS;
  className?: string;
  /** sem padding lateral próprio, para quando o container já tem o dele */
  flush?: boolean;
}) {
  if (items.length === 0) return null;

  const pad = flush ? '' : 'px-4 sm:px-6 lg:px-10';

  return (
    <section className={className}>
      <SectionHeading className={`pb-4 ${pad}`}>{title}</SectionHeading>
      <RowScroller label={title} padding={pad}>
        {items.map((media) => (
          <li key={media.id} className={`snap-item shrink-0 ${WIDTHS[variant]}`}>
            <MediaCard media={media} sizes={SIZES[variant]} />
          </li>
        ))}
      </RowScroller>
    </section>
  );
}
