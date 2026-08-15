import { memo } from 'react';

const AMBER_SQUARE = 'linear-gradient(140deg,#fff0b0,#ffb01a 55%,#ff8a00)';

interface LogoProps {
  /** lado do quadrado, em px */
  size?: number;
  /** anel interno escuro: presente em todos os tamanhos, menos no rodapé */
  ring?: boolean;
  className?: string;
}

/** Quadrado com degradê âmbar e um "play" triangular. */
export const LumioLogo = memo(function LumioLogo({
  size = 36,
  ring = true,
  className = '',
}: LogoProps) {
  const inset = Math.round(size * 0.16);
  return (
    <div
      className={`relative grid shrink-0 place-items-center ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        backgroundImage: AMBER_SQUARE,
        boxShadow: `0 ${Math.round(size * 0.17)}px ${Math.round(size * 0.6)}px rgba(255,176,26,.45)`,
      }}
    >
      {ring ? (
        <div
          className="absolute"
          style={{
            inset,
            borderRadius: Math.round(size * 0.19),
            border: `${Math.max(1.5, size * 0.023)}px solid rgba(8,8,12,.28)`,
          }}
        />
      ) : null}
      <svg
        viewBox="0 0 10 12"
        aria-hidden="true"
        style={{ width: size * 0.31, marginLeft: size * 0.07 }}
        className="relative"
      >
        <path d="M0 0 L10 6 L0 12 Z" fill="#08080c" />
      </svg>
    </div>
  );
});

interface WordmarkProps {
  className?: string;
}

/** "Lum" + "io" em âmbar. */
export const LumioWordmark = memo(function LumioWordmark({ className = '' }: WordmarkProps) {
  return (
    <span className={`font-display font-bold -tracking-[.02em] ${className}`}>
      Lum<span className="text-amber">io</span>
    </span>
  );
});

/** Triângulo "play" usado nos botões de ação. */
export function PlayGlyph({ size = 13, color = '#08080c' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 10 12" aria-hidden="true" style={{ width: size }} className="shrink-0">
      <path d="M0 0 L10 6 L0 12 Z" fill={color} />
    </svg>
  );
}
