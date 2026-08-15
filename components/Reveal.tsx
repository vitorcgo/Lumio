'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** atraso em ms, para escalonar itens irmãos */
  delay?: number;
  className?: string;
}

/**
 * Revela o bloco quando ele entra na viewport.
 *
 * Se o `IntersectionObserver` não existir, o conteúdo aparece imediatamente ,
 * a animação é enfeite, nunca um pré-requisito para ver a página.
 */
export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    // Já visível na carga inicial: mostra sem esperar o observer.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${shown ? 'reveal-in' : 'reveal-hidden'} ${className}`}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
