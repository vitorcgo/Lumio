'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ChannelCard } from './ChannelCard';
import { ChannelLogo, LiveBadge } from './ChannelLogo';
import { PlayGlyph } from '../Brand';
import { GenreChips } from '../GenreChips';
import { LIVE_CATEGORIES } from '@/lib/data';
import type { Channel, MediaView } from '@/lib/types';

// A grade só é baixada quando o usuário abre a aba: mantém o JS inicial enxuto.
const EpgGrid = dynamic(() => import('./EpgGrid'), {
  ssr: false,
  loading: () => (
    <div className="space-y-2.5" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="skeleton h-[68px] rounded-xl" />
      ))}
    </div>
  ),
});

type View = 'grid' | 'epg';

interface LiveScreenProps {
  channels: Channel[];
  featured: Channel;
  /** título usado como arte de fundo do destaque */
  featuredArt: MediaView;
}

export function LiveScreen({ channels, featured, featuredArt }: LiveScreenProps) {
  const [view, setView] = useState<View>('grid');
  const [category, setCategory] = useState('Todos');

  const visible = useMemo(
    () => (category === 'Todos' ? channels : channels.filter((c) => c.cat === category)),
    [channels, category],
  );

  return (
    <div className="min-h-[80vh] px-4 pt-7 pb-10 sm:px-6 lg:px-10">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <LiveBadge />
        <h1 className="font-display text-[30px] font-bold -tracking-[.02em] sm:text-[40px]">
          TV Ao Vivo
        </h1>
      </div>

      <Link
        href={`/watch/live/${featured.id}`}
        className="relative mb-8 block h-[260px] overflow-hidden rounded-[20px] border border-white/8 sm:h-[360px]"
      >
        {featuredArt.img ? (
          <Image
            src={featuredArt.img}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_16%]"
          />
        ) : null}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/60 to-night/20 sm:bg-gradient-to-r sm:from-night/92 sm:via-night/40 sm:via-60% sm:to-transparent"
        />
        <span className="absolute inset-x-5 bottom-6 max-w-[560px] sm:inset-x-10 sm:bottom-9">
          <span className="flex items-center gap-3">
            <ChannelLogo channel={featured} wide />
            <LiveBadge />
          </span>
          <span className="mt-4 block font-display text-[26px] leading-[1.05] font-bold sm:text-[40px]">
            {featured.now}
          </span>
          <span className="mt-2 block text-sm text-white/70 sm:text-[15px]">
            {featured.name} · A seguir: {featured.next}
          </span>
          <span className="mt-5 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-amber-hi to-amber-mid px-6 py-3 font-display text-[15px] font-bold text-night sm:px-7 sm:text-[16px]">
            <PlayGlyph size={12} />
            Assistir ao vivo
          </span>
        </span>
      </Link>

      <div role="tablist" aria-label="Modo de exibição" className="mb-5 flex gap-2.5">
        {(
          [
            ['grid', 'Agora'],
            ['epg', 'Grade completa'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={view === value}
            onClick={() => setView(value)}
            className={`rounded-[10px] px-4 py-2.5 text-sm font-bold transition-colors sm:px-[18px] ${
              view === value
                ? 'bg-gradient-to-br from-amber-hi to-amber-mid text-night'
                : 'border border-white/10 bg-white/6 text-white/75 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <GenreChips
        genres={LIVE_CATEGORIES}
        active={category}
        onSelect={setCategory}
        label="Filtrar canais por categoria"
        className="mb-6"
      />

      {view === 'grid' ? (
        visible.length === 0 ? (
          <p className="py-16 text-center text-white/50">Nenhum canal nesta categoria.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:gap-[18px]">
            {visible.map((channel) => (
              <li key={channel.id}>
                <ChannelCard channel={channel} />
              </li>
            ))}
          </ul>
        )
      ) : (
        <EpgGrid channels={visible} />
      )}
    </div>
  );
}
