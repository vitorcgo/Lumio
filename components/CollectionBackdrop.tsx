import Image from 'next/image';

import type { MediaView } from '@/lib/types';

/** Some de cima para baixo, para o conteúdo abaixo continuar legível. */
const FADE = 'linear-gradient(180deg,#000 0%,#000 38%,rgba(0,0,0,.55) 68%,transparent 100%)';

/**
 * Fundo do cabeçalho de uma coleção.
 *
 * Usa a arte do título mais bem avaliado que tiver imagem, bem desfocada. Como
 * doramas e turcas ainda estão sem pôster, o fallback não é um retângulo vazio:
 * monta manchas de cor a partir da matiz de cada título da coleção, o mesmo
 * valor que gera o degradê dos cards.
 */
export function CollectionBackdrop({ items }: { items: MediaView[] }) {
  const art = [...items].filter((m) => m.hasImg).sort((a, b) => b.rating - a.rating)[0];
  const blobs = items.slice(0, 5);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      {art ? (
        <Image
          src={art.img}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover opacity-35 blur-[64px]"
        />
      ) : (
        blobs.map((media, i) => (
          <span
            key={media.id}
            className="absolute rounded-full blur-[90px]"
            style={{
              left: `${8 + i * 21}%`,
              top: `${i % 2 === 0 ? -18 : 6}%`,
              width: 360,
              height: 360,
              opacity: 0.5,
              background: `radial-gradient(circle, hsl(${media.hue} 62% 34%), transparent 68%)`,
            }}
          />
        ))
      )}

      {/* Véu final: segura o contraste do texto por cima de qualquer arte. */}
      <span className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/35 to-transparent" />
    </div>
  );
}
