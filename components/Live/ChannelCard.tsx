import Link from 'next/link';
import { memo, type CSSProperties } from 'react';

import { ChannelLogo, LiveBadge } from './ChannelLogo';
import type { Channel } from '@/lib/types';

/** Card de canal da aba "Agora". Leva à página do canal, com a programação. */
export const ChannelCard = memo(function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <div
      // A cor do canal sai do quadradinho do logo e tinge a borda e o brilho no hover.
      style={{ '--ch': channel.color } as CSSProperties}
      className="group/ch relative flex gap-3.5 rounded-[14px] border border-white/7 bg-gradient-to-br from-surface-3 to-[#0d0d13] p-3.5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:border-[var(--ch)] hover:shadow-[0_10px_30px_-8px_var(--ch)] focus-within:border-[var(--ch)] motion-reduce:hover:translate-y-0"
    >
      <ChannelLogo channel={channel} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-[15px] font-bold">{channel.name}</span>
          <LiveBadge small />
        </div>
        <p className="mt-1.5 truncate text-sm text-white">{channel.now}</p>
        <p className="mt-0.5 truncate text-xs text-white/45">A seguir: {channel.next}</p>
        <span className="mt-2.5 block h-1 rounded-full bg-white/12">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-amber-hi to-amber-mid"
            style={{ width: `${channel.prog}%` }}
          />
        </span>
      </div>

      {/* Link esticado: o card inteiro abre a página do canal, onde fica o
          botão de assistir. Um play flutuante aqui só duplicaria o caminho. */}
      <Link
        href={`/canal/${channel.id}`}
        aria-label={`${channel.name}: programação e detalhes`}
        className="absolute inset-0 z-1 rounded-[14px]"
      />
    </div>
  );
});
