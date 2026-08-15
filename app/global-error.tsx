'use client';

import { useEffect } from 'react';

/**
 * Última linha de defesa: erro no próprio layout raiz.
 *
 * Substitui o `<html>` inteiro, então não pode contar com nada do layout ,
 * nem fontes, nem CSS de tema. Por isso os estilos aqui são inline.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Falha no layout raiz:', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#08080c',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <div
            style={{
              width: 56,
              height: 56,
              margin: '0 auto 24px',
              borderRadius: 17,
              background: 'linear-gradient(140deg,#fff0b0,#ffb01a 55%,#ff8a00)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <svg viewBox="0 0 10 12" style={{ width: 18, marginLeft: 4 }} aria-hidden="true">
              <path d="M0 0 L10 6 L0 12 Z" fill="#08080c" />
            </svg>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 12px' }}>
            A Lumio não conseguiu carregar
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,.6)', margin: 0 }}>
            Houve uma falha grave ao iniciar a aplicação. Recarregar costuma resolver.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 28,
              padding: '14px 28px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg,#ffe14d,#ffb01a)',
              color: '#08080c',
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}
