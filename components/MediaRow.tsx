'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

export function SectionHeading({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className="h-5 w-1 shrink-0 rounded-[3px] bg-gradient-to-b from-amber-hi to-amber-mid"
      />
      <h2 className="font-display text-lg font-bold sm:text-xl lg:text-[22px]">{children}</h2>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      tabIndex={-1}
      aria-hidden="true"
      // Visível assim que há conteúdo fora da tela: antes só aparecia no hover,
      // e quem não passava o mouse não descobria que a fileira rolava.
      className={`absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur-sm transition-opacity lg:grid ${
        direction === 'left' ? 'left-1' : 'right-1'
      } ${
        disabled
          ? 'pointer-events-none opacity-0'
          : 'opacity-55 hover:opacity-100 group-hover/row:opacity-100'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          d={direction === 'left' ? 'M15 5 L8 12 L15 19' : 'M9 5 L16 12 L9 19'}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

interface RowScrollerProps {
  children: ReactNode;
  /** rótulo do grupo para leitores de tela */
  label: string;
  className?: string;
  /** padding lateral da pista; use `''` quando o pai já tiver o seu */
  padding?: string;
}

const DEFAULT_PADDING = 'px-4 sm:px-6 lg:px-10';

/**
 * Fileira horizontal com snap, arrastar com o mouse e setas no desktop.
 * No toque, usa a rolagem nativa.
 */
export function RowScroller({
  children,
  label,
  className = '',
  padding = DEFAULT_PADDING,
}: RowScrollerProps) {
  const ref = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startY: 0, startLeft: 0 });
  const [edges, setEdges] = useState({ start: true, end: false });

  const frame = useRef<number | null>(null);

  const syncEdges = useCallback(() => {
    // Agrupa num rAF: o scroll dispara muitas vezes por segundo.
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const el = ref.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      const start = el.scrollLeft <= 1;
      const end = el.scrollLeft >= max - 1;
      // Devolver o mesmo objeto faz o React desistir do re-render: sem isso, cada
      // evento de scroll redesenharia todos os cards da fileira.
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    });
  }, []);

  // A posição de cada fileira sobrevive à ida e volta para a ficha de um título.
  const storageKey = `lumio:row:${label}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    try {
      const saved = Number(sessionStorage.getItem(storageKey));
      if (saved > 0) el.scrollLeft = saved;
    } catch {
      // sessionStorage bloqueado: a fileira só começa do início.
    }

    syncEdges();
    const observer = new ResizeObserver(syncEdges);
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      try {
        sessionStorage.setItem(storageKey, String(el.scrollLeft));
      } catch {
        // idem: sem persistência, nada quebra.
      }
    };
  }, [syncEdges, storageKey]);

  /** Setas movem o foco de card em card, sem sair da fileira. */
  const onKeyDown = useCallback((e: KeyboardEvent<HTMLUListElement>) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;

    const el = ref.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll('li'))
      .map((li) => li.querySelector<HTMLElement>('a, button'))
      .filter((c): c is HTMLElement => c !== null);
    if (cards.length === 0) return;

    const current = cards.findIndex((c) => c.contains(document.activeElement));
    if (current === -1) return;

    let next = current;
    if (e.key === 'ArrowRight') next = Math.min(current + 1, cards.length - 1);
    else if (e.key === 'ArrowLeft') next = Math.max(current - 1, 0);
    else if (e.key === 'Home') next = 0;
    else next = cards.length - 1;

    if (next === current) return;
    e.preventDefault();
    cards[next]?.focus();
    cards[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, []);

  const scrollByPage = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  }, []);

  const onPointerDown = useCallback((e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: el.scrollLeft,
    };
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<HTMLUListElement>) => {
    const el = ref.current;
    if (!drag.current.active || !el) return;

    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;

    // Só engata se a intenção for mesmo horizontal. Sem isso, um arrasto vertical
    // com um tremido de lado sequestrava o ponteiro e travava a rolagem da página.
    if (!drag.current.moved) {
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.current.active = false;
        return;
      }
      if (Math.abs(dx) <= 5) return;
      drag.current.moved = true;
      el.setPointerCapture(e.pointerId);
    }

    el.scrollLeft = drag.current.startLeft - dx;
  }, []);

  const endDrag = useCallback((e: PointerEvent<HTMLUListElement>) => {
    const el = ref.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    drag.current.active = false;
  }, []);

  // Um arrasto não deve abrir o card que estava sob o cursor.
  const onClickCapture = useCallback((e: MouseEvent<HTMLUListElement>) => {
    if (!drag.current.moved) return;
    drag.current.moved = false;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className={`group/row relative ${className}`}>
      <ArrowButton direction="left" onClick={() => scrollByPage(-1)} disabled={edges.start} />
      <ArrowButton direction="right" onClick={() => scrollByPage(1)} disabled={edges.end} />
      <ul
        ref={ref}
        aria-label={label}
        onScroll={syncEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        className={`row-scroll flex gap-3 pt-1.5 pb-3 sm:gap-4 ${padding}`}
      >
        {children}
      </ul>
    </div>
  );
}
