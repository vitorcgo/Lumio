import Link from 'next/link';

import { LumioLogo, PlayGlyph } from '@/components/Brand';
import { MediaCard } from '@/components/MediaCard';
import { Particles } from '@/components/Particles';
import { pickMedia } from '@/lib/catalog';

const PICKS = [1, 22, 41, 4, 27, 21];

export default function NotFound() {
  const picks = pickMedia(PICKS);

  return (
    <div className="relative -mt-16 flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-16 text-center sm:-mt-[76px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[42%] left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-glow sm:h-[780px] sm:w-[780px]"
        style={{
          background: 'radial-gradient(circle,rgba(255,200,26,.16),transparent 66%)',
        }}
      />

      <Particles count={12} />

      <div className="relative flex items-center gap-1.5">
        <span className="bg-gradient-to-br from-[#fff0b0] via-amber-mid to-amber-deep bg-clip-text font-display text-[92px] leading-[.9] font-bold -tracking-[.05em] text-transparent sm:text-[172px]">
          4
        </span>
        <LumioLogo size={70} className="sm:hidden" />
        <LumioLogo size={130} className="hidden sm:grid" />
        <span className="bg-gradient-to-br from-[#fff0b0] via-amber-mid to-amber-deep bg-clip-text font-display text-[92px] leading-[.9] font-bold -tracking-[.05em] text-transparent sm:text-[172px]">
          4
        </span>
      </div>

      <h1 className="relative mt-3 font-display text-[26px] font-bold -tracking-[.02em] sm:text-[34px]">
        Esta página saiu do ar
      </h1>

      <p className="relative mt-3.5 max-w-[530px] text-[15px] leading-relaxed text-pretty text-white/60 sm:text-[17px]">
        O título ou a página que você procurava não está mais disponível: pode ter sido movido,
        removido, ou o link está quebrado.
      </p>

      <div className="relative mt-7 flex flex-wrap justify-center gap-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-amber-hi to-amber-mid px-7 py-3.5 font-display text-[16px] font-bold text-night shadow-[0_12px_30px_rgba(255,190,26,.4)] transition-transform hover:scale-[1.03] motion-reduce:hover:scale-100"
        >
          <PlayGlyph />
          Voltar ao início
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2.5 rounded-xl border border-white/18 bg-white/10 px-6 py-3.5 font-display text-[16px] font-semibold text-white transition-colors hover:bg-white/16"
        >
          Buscar títulos
        </Link>
      </div>

      <div className="relative mt-14 w-full max-w-[1080px]">
        <h2 className="mb-4 text-[13px] font-bold tracking-[.14em] text-white/45 uppercase">
          Que tal continuar por aqui
        </h2>
        <ul className="row-scroll flex gap-4 pb-2">
          {picks.map((media) => (
            <li key={media.id} className="snap-item w-[130px] shrink-0 sm:w-[158px]">
              <MediaCard media={media} sizes="(max-width: 639px) 130px, 158px" showRating={false} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
