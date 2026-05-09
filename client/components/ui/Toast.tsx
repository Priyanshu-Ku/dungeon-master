'use client';

import React from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'motion/react';
import { Info, AlertCircle, CheckCircle, X } from 'lucide-react';

type ToastType = 'info' | 'success' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
}));

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            style={{
              background: 'rgba(5, 5, 8, 0.9)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${
                toast.type === 'success' ? '#4ADE80' : 
                toast.type === 'error' ? '#EF4444' : 'rgba(124, 58, 237, 0.3)'
              }`,
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '240px',
              pointerEvents: 'auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            {toast.type === 'success' && <CheckCircle size={18} color="#4ADE80" />}
            {toast.type === 'error' && <AlertCircle size={18} color="#EF4444" />}
            {toast.type === 'info' && <Info size={18} color="#7C3AED" />}
            
            <span style={{ fontSize: '13px', color: '#E2D9F3', fontFamily: 'var(--font-lato)', flex: 1 }}>
              {toast.message}
            </span>

            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: '#4B456A', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
