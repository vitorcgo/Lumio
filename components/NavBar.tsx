'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useState, type ComponentType, type SVGProps } from 'react';

import { LumioLogo, LumioWordmark } from './Brand';
import {
  BookmarkIcon,
  BroadcastIcon,
  DramaIcon,
  FilmIcon,
  HeartIcon,
  HomeIcon,
  SearchIcon,
  SparkleIcon,
  TvIcon,
} from './icons';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface NavLink {
  href: string;
  label: string;
  /** rótulo curto usado no dock do celular */
  short: string;
  Icon: IconComponent;
}

const LINKS: readonly NavLink[] = [
  { href: '/', label: 'Início', short: 'Início', Icon: HomeIcon },
  { href: '/browse/movie', label: 'Filmes', short: 'Filmes', Icon: FilmIcon },
  { href: '/browse/series', label: 'Séries', short: 'Séries', Icon: TvIcon },
  { href: '/browse/anime', label: 'Anime', short: 'Anime', Icon: SparkleIcon },
  { href: '/doramas', label: 'Doramas', short: 'Doramas', Icon: HeartIcon },
  { href: '/turcas', label: 'Turcas', short: 'Turcas', Icon: DramaIcon },
  { href: '/live', label: 'TV Ao Vivo', short: 'Ao Vivo', Icon: BroadcastIcon },
];

/**
 * O dock do celular fica sem a TV ao vivo: com sete itens cada um sobrava
 * menos de 52px. Ela vira um ícone no header, ao lado de Minha Lista.
 */
const DOCK_LINKS = LINKS.filter((l) => l.href !== '/live');

function isActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export const NavBar = memo(function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Barra transparente sobre o hero; ganha corpo assim que a página rola.
  useEffect(() => {
    let frame: number | null = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        setScrolled((prev) => {
          const next = window.scrollY > 24;
          return prev === next ? prev : next;
        });
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const iconButton =
    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] transition-colors';

  return (
    <>
      <header
        className={`sticky top-0 z-60 backdrop-blur-[10px] transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled
            ? 'border-b border-white/8 bg-night/88 shadow-[0_10px_30px_rgba(0,0,0,.45)]'
            : 'border-b border-transparent bg-gradient-to-b from-[rgba(8,8,12,.96)] via-[rgba(8,8,12,.6)] to-transparent'
        }`}
      >
        <nav
          aria-label="Navegação principal"
          className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:h-[76px] lg:gap-6 lg:px-10"
        >
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Lumio: página inicial"
          >
            <LumioLogo size={34} />
            <LumioWordmark className="text-[21px] lg:text-[23px]" />
          </Link>

          {/* No desktop os links moram aqui; no celular vão para o dock de baixo. */}
          <ul className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
            {LINKS.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative block rounded-[9px] px-3.5 py-2 text-[15px] font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-white/12 text-white'
                        : 'text-white/70 hover:bg-white/6 hover:text-white'
                    }`}
                  >
                    {label}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-amber-hi to-amber-mid"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-2">
            {/* Só abaixo de lg: no desktop a TV ao vivo já é um link com texto. */}
            <Link
              href="/live"
              aria-label="TV Ao Vivo"
              title="TV Ao Vivo"
              aria-current={isActive(pathname, '/live') ? 'page' : undefined}
              className={`${iconButton} lg:hidden ${
                isActive(pathname, '/live')
                  ? 'bg-amber/18 text-amber-soft'
                  : 'border border-white/8 bg-white/6 text-white hover:bg-white/12'
              }`}
            >
              <BroadcastIcon className="h-[18px] w-[18px]" />
            </Link>

            {/* No desktop ganha rótulo: um ícone solto ao lado de seis links
                com texto não deixava claro o que era. */}
            <Link
              href="/my-list"
              aria-current={isActive(pathname, '/my-list') ? 'page' : undefined}
              className={`${iconButton} lg:w-auto lg:gap-2 lg:px-3 ${
                isActive(pathname, '/my-list')
                  ? 'bg-amber/18 text-amber-soft'
                  : 'border border-white/8 bg-white/6 text-white hover:bg-white/12'
              }`}
            >
              <BookmarkIcon className="h-[18px] w-[18px]" />
              <span className="hidden text-[15px] font-semibold whitespace-nowrap lg:inline">
                Minha Lista
              </span>
              <span className="sr-only lg:hidden">Minha lista</span>
            </Link>

            <Link
              href="/search"
              aria-label="Buscar"
              aria-current={pathname.startsWith('/search') ? 'page' : undefined}
              className={`${iconButton} ${
                pathname.startsWith('/search')
                  ? 'bg-gradient-to-br from-amber-hi to-amber-mid text-night'
                  : 'border border-white/8 bg-white/6 text-white hover:bg-white/12'
              }`}
            >
              <SearchIcon className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </nav>
      </header>

      <MobileDock pathname={pathname} />
    </>
  );
});

/** Dock fixo no rodapé, só no celular e tablet. */
function MobileDock({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Navegação por seções"
      className="fixed inset-x-0 bottom-0 z-60 border-t border-white/8 bg-night/92 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-[560px] items-stretch">
        {DOCK_LINKS.map(({ href, short, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 px-1 pt-2 pb-1.5 transition-colors ${
                  active ? 'text-amber' : 'text-white/55'
                }`}
              >
                <span className="relative">
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute -inset-x-2.5 -inset-y-1 rounded-full bg-amber/14"
                    />
                  ) : null}
                  <Icon className="relative h-[21px] w-[21px]" />
                </span>
                <span className="text-[10px] leading-none font-semibold">{short}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
