'use client';

import { create } from 'zustand';

export interface ToastAction {
  label: string;
  run: () => void;
}

export interface Toast {
  id: number;
  message: string;
  action?: ToastAction;
}

interface ToastState {
  toasts: Toast[];
  push: (message: string, action?: ToastAction) => void;
  dismiss: (id: number) => void;
}

/** Quantos avisos ficam empilhados ao mesmo tempo. */
const MAX_VISIBLE = 3;

let nextId = 0;

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (message, action) =>
    set((s) => {
      nextId += 1;
      return { toasts: [...s.toasts, { id: nextId, message, action }].slice(-MAX_VISIBLE) };
    }),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Atalho para disparar um aviso de fora de um componente React. */
export function toast(message: string, action?: ToastAction) {
  useToastStore.getState().push(message, action);
}
