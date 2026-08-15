import { shortChannelName } from '@/lib/format';
import type { Channel } from '@/lib/types';

interface ChannelLogoProps {
  channel: Channel;
  /** versão larga usada no destaque da página */
  wide?: boolean;
}

/** Quadrado colorido com a sigla do canal, no lugar de um logo real. */
export function ChannelLogo({ channel, wide = false }: ChannelLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-xl p-1 text-center font-display font-extrabold text-white ${
        wide ? 'h-[46px] w-[70px] text-[15px]' : 'h-14 w-14 text-[13px] sm:h-16 sm:w-16'
      }`}
      style={{
        backgroundImage: `linear-gradient(150deg, ${channel.color}, ${channel.color}99)`,
        boxShadow: `0 6px 18px ${channel.color}55`,
        lineHeight: 1,
      }}
    >
      {wide ? channel.name : shortChannelName(channel.name)}
    </span>
  );
}

export function LiveBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#ff3c3c]/55 bg-[#ff2d2d]/20 ${
        small ? 'px-2 py-0.5' : 'px-2.5 py-1'
      }`}
    >
      <span
        aria-hidden="true"
        className={`rounded-full bg-live motion-safe:animate-pulse-live ${
          small ? 'h-1.5 w-1.5' : 'h-2 w-2'
        }`}
      />
      <span
        className={`font-extrabold text-[#ff8a8a] ${small ? 'text-[9px]' : 'text-[11px]'}`}
      >
        AO VIVO
      </span>
    </span>
  );
}
