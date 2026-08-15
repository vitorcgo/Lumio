'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { LumioLogo } from '@/components/Brand';
import { Particles } from '@/components/Particles';

/**
 * Tela de falha de qualquer rota.
 *
 * Sem isto, um erro em componente cliente cai na tela crua do Next: sem marca,
 * sem caminho de volta e sem como tentar de novo.
 */
export default function ErrorScreen({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aqui entraria o envio para o monitoramento quando ele existir.
    console.error('Falha na rota:', error);
  }, [error]);

  return (
    <div className="relative -mt-16 flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-16 text-center lg:-mt-[76px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[42%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-glow"
        style={{ background: 'radial-gradient(circle,rgba(255,90,90,.14),transparent 66%)' }}
      />
      <Particles count={8} />

      <LumioLogo size={64} className="relative" />

      <h1 className="relative mt-6 font-display text-[26px] font-bold -tracking-[.02em] sm:text-[32px]">
        Alguma coisa saiu do ar
      </h1>

      <p className="relative mt-3.5 max-w-[480px] text-[15px] leading-relaxed text-pretty text-white/60 sm:text-[16px]">
        Tivemos um problema para montar esta página. Não é você: pode tentar de novo agora mesmo.
      </p>

      {error.digest ? (
        <p className="relative mt-3 font-mono text-[12px] text-white/30">
          Código: {error.digest}
        </p>
      ) : null}

      <div className="relative mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-[52px] items-center gap-2.5 rounded-xl bg-gradient-to-br from-amber-hi to-amber-mid px-7 font-display text-[16px] font-bold text-night shadow-[0_12px_30px_rgba(255,190,26,.4)] transition-transform hover:scale-[1.03] motion-reduce:hover:scale-100"
        >
          Tentar de novo
        </button>
        <Link
          href="/"
          className="inline-flex h-[52px] items-center gap-2.5 rounded-xl border border-white/18 bg-white/10 px-6 font-display text-[16px] font-semibold text-white transition-colors hover:bg-white/16"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
