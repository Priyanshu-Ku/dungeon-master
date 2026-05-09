'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCcw, Power } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    window.location.reload();
  };

  private handleColdReboot = () => {
    localStorage.removeItem('obsidian_depths_save_v1');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100vw',
          height: '100vh',
          background: '#050508',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#E2D9F3',
          fontFamily: 'var(--font-mono)',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '500px' }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ display: 'inline-block', marginBottom: '24px' }}
            >
              <AlertTriangle size={64} color="#EF4444" />
            </motion.div>
            
            <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '32px', color: '#EF4444', marginBottom: '16px' }}>
              SYSTEM CORRUPTION
            </h1>
            
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              borderRadius: '8px',
              padding: '16px',
              fontSize: '12px',
              color: '#EF4444',
              marginBottom: '32px',
              textAlign: 'left',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              {this.state.error?.message || 'Unknown runtime exception in engine core.'}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'transparent',
                  border: '1px solid #7C3AED',
                  color: '#7C3AED',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <RefreshCcw size={16} />
                <span>HOT PATCH (RELOAD)</span>
              </button>

              <button
                onClick={this.handleColdReboot}
                style={{
                  background: '#EF4444',
                  border: 'none',
                  color: '#FFF',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Power size={16} />
                <span>COLD REBOOT (CLEAR SAVE)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
