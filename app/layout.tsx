import type { Metadata, Viewport } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';

import './globals.css';
import { NavBar } from '@/components/NavBar';
import { BackgroundParticles } from '@/components/Particles';
import { BackToTop } from '@/components/BackToTop';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { StoreHydrator } from '@/components/StoreHydrator';
import { Toaster } from '@/components/Toaster';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Lumio: Filmes, séries, animes e TV ao vivo',
    template: '%s · Lumio',
  },
  description:
    'Filmes, séries, animes e TV ao vivo em 4K. A sua próxima maratona começa aqui, sem anúncios e sem limites.',
  applicationName: 'Lumio',
  other: {
    // Protótipo de demonstração: nada aqui deve ser indexado como real.
    robots: 'noindex',
  },
};

export const viewport: Viewport = {
  themeColor: '#08080c',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body>
        <StoreHydrator />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-amber focus:px-4 focus:py-2 focus:font-semibold focus:text-night"
        >
          Pular para o conteúdo
        </a>
        <BackgroundParticles />
        <NavBar />
        {/* pb-20 no celular abre espaço para o dock fixo do rodapé */}
        <main id="conteudo" className="relative z-10 pb-20 lg:pb-0">
          {children}
        </main>
        <BackToTop />
        <Toaster />
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
