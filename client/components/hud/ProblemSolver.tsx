'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useProblemStore, Problem } from '@/store/problemStore';
import { audioManager } from '@/lib/audioManager';
import { Terminal, Play, CheckCircle2, AlertCircle, X, ChevronRight, Cpu } from 'lucide-react';

interface ProblemSolverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProblemSolver({ isOpen, onClose }: ProblemSolverProps) {
  const { currentProblem, code, setCode, runCode, isExecuting, output, resetProblem } = useProblemStore();
  const [activeTab, setActiveTab] = useState<'description' | 'testcases'>('description');
  const [timeLeft, setTimeLeft] = useState(60); 
  const [hasSucceeded, setHasSucceeded] = useState(false);

  // Countdown logic
  useEffect(() => {
    if (isOpen && timeLeft > 0 && !isExecuting && !hasSucceeded) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        if (timeLeft < 10) audioManager.playSFX('/audio/sfx/heartbeat.mp3');
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0) {
      onClose(); 
      resetProblem();
    }
  }, [isOpen, timeLeft, isExecuting, hasSucceeded, onClose, resetProblem]);

  // Handle local success pulse
  useEffect(() => {
    if (currentProblem?.testCases.every(tc => tc.status === 'passed')) {
      setHasSucceeded(true);
      audioManager.playSFX('/audio/sfx/success_pulse.mp3');
    }
  }, [currentProblem]);

  if (!isOpen || !currentProblem) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: timeLeft < 10 ? [0, -2, 2, -2, 2, 0] : 0,
        boxShadow: hasSucceeded ? '0 0 100px rgba(74, 222, 128, 0.4)' : '0 0 100px rgba(0,0,0,0.9)'
      }}
      transition={{ 
        x: { repeat: timeLeft < 10 ? Infinity : 0, duration: 0.1 },
        duration: 0.3 
      }}
      style={{
        position: 'fixed',
        inset: '40px',
        background: '#0A0A0F',
        border: '1px solid rgba(124, 58, 237, 0.3)',
        borderRadius: '12px',
        zIndex: 5000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 100px rgba(0,0,0,0.9)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: 'rgba(124, 58, 237, 0.05)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Cpu size={20} color="#7C3AED" />
          <h2 style={{ fontFamily: 'var(--font-cinzel)', color: '#FFF', fontSize: '18px', margin: 0, letterSpacing: '0.1em' }}>
            {currentProblem.title}
          </h2>
          <span style={{ 
            fontSize: '10px', 
            background: 'rgba(124, 58, 237, 0.2)', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            color: '#7C3AED',
            fontFamily: 'var(--font-mono)'
          }}>
            {currentProblem.difficulty.toUpperCase()}
          </span>
          <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: timeLeft < 15 ? '#EF4444' : '#7C3AED', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
            <span style={{ opacity: 0.5 }}>DECRYPTION_REMAINING:</span>
            <span>{timeLeft}S</span>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4B456A', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Main Workspace */}
      <div style={{ flex: 1, position: 'relative' }}>
        <PanelGroup direction="horizontal">
          {/* Left: Info Panel */}
          <Panel defaultSize={35} minSize={25}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0D0D14', borderRight: '1px solid rgba(124, 58, 237, 0.1)' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {(['description', 'testcases'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '12px 24px',
                      background: activeTab === tab ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                      color: activeTab === tab ? '#FFF' : '#4B456A',
                      border: 'none',
                      borderBottom: activeTab === tab ? '2px solid #7C3AED' : '2px solid transparent',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                {activeTab === 'description' ? (
                  <div style={{ color: '#94A3B8', fontFamily: 'var(--font-lato)', fontSize: '14px', lineHeight: 1.6 }}>
                    {currentProblem.description.split('\n').map((p, i) => (
                      <p key={i} style={{ marginBottom: '16px' }}>{p}</p>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentProblem.testCases.map((tc, i) => (
                      <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '10px', color: '#4B456A', fontFamily: 'var(--font-mono)' }}>CASE #{i+1}</span>
                          {tc.status === 'passed' && <CheckCircle2 size={14} color="#4ADE80" />}
                          {tc.status === 'failed' && <AlertCircle size={14} color="#EF4444" />}
                        </div>
                        <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                          <div style={{ color: '#4B456A', marginBottom: '4px' }}>Input: <span style={{ color: '#94A3B8' }}>{tc.input}</span></div>
                          <div style={{ color: '#4B456A' }}>Expect: <span style={{ color: '#94A3B8' }}>{tc.expected}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle style={{ width: '4px', background: 'transparent', cursor: 'col-resize' }} />

          {/* Right: Code Editor & Console */}
          <Panel defaultSize={65}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70}>
                <div style={{ height: '100%', overflow: 'hidden' }}>
                  <CodeMirror
                    value={code}
                    height="100%"
                    theme={vscodeDark}
                    extensions={[javascript({ jsx: true })]}
                    onChange={(val) => setCode(val)}
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </Panel>
              
              <PanelResizeHandle style={{ height: '4px', background: 'transparent', cursor: 'row-resize' }} />
              
              <Panel defaultSize={30}>
                <div style={{ height: '100%', background: '#050508', borderTop: '1px solid rgba(124, 58, 237, 0.2)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px', color: '#4B456A', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                    <Terminal size={12} />
                    <span>TERMINAL OUTPUT</span>
                  </div>
                  <div style={{ flex: 1, padding: '16px', color: '#4ADE80', fontFamily: 'var(--font-mono)', fontSize: '12px', overflowY: 'auto' }}>
                    {isExecuting ? (
                      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>
                        {'>'} {output}
                      </motion.div>
                    ) : (
                      <div>{output ? `> ${output}` : '> Ready for execution...'}</div>
                    )}
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                      onClick={runCode}
                      disabled={isExecuting}
                      style={{
                        padding: '10px 24px',
                        background: '#7C3AED',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: isExecuting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)'
                      }}
                    >
                      <Play size={14} />
                      <span>RUN DECRYPTION</span>
                    </button>
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </motion.div>
  );
}
