import Link from 'next/link';

import { LumioLogo, LumioWordmark } from './Brand';
import { GlobeIcon } from './icons';

/** Seções reais do catálogo. */
const BROWSE = [
  { label: 'Início', href: '/' },
  { label: 'Filmes', href: '/browse/movie' },
  { label: 'Séries', href: '/browse/series' },
  { label: 'Anime', href: '/browse/anime' },
  { label: 'Doramas', href: '/doramas' },
  { label: 'Novelas Turcas', href: '/turcas' },
  { label: 'TV Ao Vivo', href: '/live' },
  { label: 'Minha Lista', href: '/my-list' },
];

/** Rotas ainda não construídas: caem no 404 da Lumio, de propósito. */
const LEGAL = [
  { label: 'Termos', href: '/termos' },
  { label: 'Privacidade', href: '/privacidade' },
  { label: 'Ajuda', href: '/ajuda' },
];

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/7 bg-ink/80">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent"
      />

      <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-7 text-center">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Lumio: página inicial">
            <LumioLogo size={32} ring={false} />
            <LumioWordmark className="text-[20px]" />
          </Link>

          <nav aria-label="Seções" className="max-w-[640px]">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              {BROWSE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/60 transition-colors hover:text-amber-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="h-px w-full max-w-[420px] bg-white/8" />

          <div className="flex flex-col items-center gap-4">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {LEGAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/45 transition-colors hover:text-amber-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="inline-flex items-center gap-1.5 text-[13px] text-white/45">
                <GlobeIcon className="h-3.5 w-3.5" />
                Português (BR)
              </li>
            </ul>

            <p className="max-w-[520px] text-[12px] leading-relaxed text-white/30">
              © 2026 Lumio Streaming · Protótipo de plataforma. Todo o conteúdo é fictício e para
              fins de demonstração.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
