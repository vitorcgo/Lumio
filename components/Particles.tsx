import type { CSSProperties } from 'react';

interface Particle {
  /** posição horizontal, em % */
  left: number;
  /** diâmetro em px */
  size: number;
  /** atraso e duração em s */
  delay: number;
  duration: number;
  /** deriva lateral em px */
  drift: number;
  /** altura da subida em px */
  rise: number;
  /** opacidade máxima */
  peak: number;
}

/**
 * Posições fixas, escritas à mão de propósito: nada de `Math.random()` aqui,
 * senão servidor e cliente gerariam campos diferentes e a hidratação quebraria.
 */
const PARTICLES: readonly Particle[] = [
  { left: 4, size: 5, delay: 0, duration: 16, drift: 26, rise: 460, peak: 0.55 },
  { left: 11, size: 7, delay: 5.5, duration: 21, drift: -18, rise: 520, peak: 0.46 },
  { left: 17, size: 4, delay: 2.2, duration: 13, drift: 34, rise: 380, peak: 0.66 },
  { left: 24, size: 6, delay: 8.4, duration: 18, drift: -30, rise: 500, peak: 0.42 },
  { left: 30, size: 5, delay: 1.1, duration: 15, drift: 12, rise: 430, peak: 0.6 },
  { left: 37, size: 9, delay: 11.2, duration: 23, drift: -22, rise: 560, peak: 0.34 },
  { left: 43, size: 3, delay: 4.6, duration: 12, drift: 40, rise: 360, peak: 0.68 },
  { left: 49, size: 6, delay: 9.8, duration: 19, drift: -14, rise: 490, peak: 0.44 },
  { left: 55, size: 5, delay: 3.3, duration: 17, drift: 28, rise: 470, peak: 0.57 },
  { left: 61, size: 7, delay: 13.1, duration: 22, drift: -36, rise: 540, peak: 0.4 },
  { left: 67, size: 3, delay: 6.7, duration: 14, drift: 20, rise: 400, peak: 0.64 },
  { left: 73, size: 6, delay: 0.8, duration: 20, drift: -26, rise: 510, peak: 0.48 },
  { left: 79, size: 5, delay: 10.4, duration: 16, drift: 32, rise: 450, peak: 0.59 },
  { left: 84, size: 8, delay: 7.2, duration: 24, drift: -12, rise: 580, peak: 0.36 },
  { left: 89, size: 3, delay: 12.6, duration: 13, drift: 24, rise: 390, peak: 0.66 },
  { left: 94, size: 6, delay: 2.9, duration: 18, drift: -32, rise: 480, peak: 0.45 },
  { left: 8, size: 4, delay: 14.3, duration: 15, drift: 16, rise: 420, peak: 0.62 },
  { left: 97, size: 5, delay: 5.1, duration: 21, drift: -20, rise: 530, peak: 0.43 },
];

/**
 * Camada ambiente que cobre o site inteiro.
 *
 * Fica `fixed` atrás do conteúdo e sobe a altura toda da viewport, bem discreta
 *: aparece nos vãos entre as fileiras, não compete com os pôsteres.
 */
export function BackgroundParticles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden motion-reduce:hidden"
    >
      {/* Sem `will-change`: com dezenas de partículas ele criava uma camada de
          GPU para cada uma. Animar só `transform`/`opacity` já promove o
          elemento quando o navegador julga que vale a pena. */}
      {PARTICLES.slice(0, 12).map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-16px] rounded-full bg-amber-soft"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 4}px rgba(255,214,112,.55)`,
              // Mais lento e mais apagado que o campo dos heros, mas ainda visível.
              animation: `luFloat ${p.duration * 2.4}s linear ${p.delay}s infinite`,
              '--lu-drift': `${p.drift}px`,
              '--lu-rise': '105vh',
              '--lu-peak': p.peak * 0.55,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

interface ParticlesProps {
  /** quantas partículas usar; recorta a lista fixa */
  count?: number;
  className?: string;
}

/**
 * Campo de partículas âmbar puramente decorativo.
 *
 * É um componente de servidor: a animação é 100% CSS (só `transform`/`opacity`,
 * então roda na GPU) e não manda um byte de JavaScript para o navegador.
 */
export function Particles({ count = PARTICLES.length, className = '' }: ParticlesProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden ${className}`}
    >
      {PARTICLES.slice(0, count).map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-12px] rounded-full bg-amber-soft"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 3}px rgba(255,214,112,.55)`,
              animation: `luFloat ${p.duration}s linear ${p.delay}s infinite`,
              '--lu-drift': `${p.drift}px`,
              '--lu-rise': `${p.rise}px`,
              '--lu-peak': p.peak,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
