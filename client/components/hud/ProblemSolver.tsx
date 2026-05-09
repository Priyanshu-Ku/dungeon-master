'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useProblemStore } from '@/store/problemStore';
import { useCombatStore } from '@/store/combatStore';
import { Play, CheckCircle2, XCircle, Circle, X, ChevronRight } from 'lucide-react';

interface ProblemSolverProps {
  isOpen: boolean;
  onClose: () => void;
}

// Renders the problem description with basic markdown-like formatting
function ProblemDescription({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.7' }}>
      {lines.map((line, i) => {
        if (line.startsWith('---'))
          return <hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '20px 0' }} />;
        if (line.startsWith('EXAMPLE') || line.startsWith('CONSTRAINTS') || line.startsWith('ACTUAL PROBLEM'))
          return (
            <div key={i} style={{ fontSize: '10px', letterSpacing: '0.35em', fontFamily: 'var(--font-mono)', color: '#4B5563', textTransform: 'uppercase', marginTop: '20px', marginBottom: '10px' }}>
              {line}
            </div>
          );
        if (line.startsWith('Input:') || line.startsWith('Output:') || line.startsWith('Because'))
          return (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#64748B', background: 'rgba(255,255,255,0.03)', padding: '3px 10px', borderRadius: '4px', marginBottom: '4px' }}>
              {line}
            </div>
          );
        if (line.startsWith('•') || line.startsWith('-'))
          return (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', paddingLeft: '4px' }}>
              <span style={{ color: '#7C3AED', flexShrink: 0, marginTop: '2px' }}>›</span>
              <span>{line.replace(/^[•\-]\s*/, '')}</span>
            </div>
          );
        if (line.trim() === '') return <div key={i} style={{ height: '8px' }} />;
        return <p key={i} style={{ margin: '0 0 10px' }}>{line}</p>;
      })}
    </div>
  );
}

export function ProblemSolver({ isOpen, onClose }: ProblemSolverProps) {
  const { currentProblem, code, setCode, runCode, isExecuting, output } = useProblemStore();
  const [activeTab, setActiveTab] = useState<'description' | 'tests'>('description');
  const [language, setLanguage] = useState('javascript');

  const allPassed = currentProblem?.testCases.every(tc => tc.status === 'passed');
  const anyFailed = currentProblem?.testCases.some(tc => tc.status === 'failed');
  const anyRan    = currentProblem?.testCases.some(tc => tc.status !== 'pending');

  // Handle auto-success and trigger post-solve dialogue
  useEffect(() => {
    if (allPassed && isOpen) {
      const timer = setTimeout(() => {
        onClose();
        useCombatStore.getState().setTriggerPostSolveDialogue(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [allPassed, isOpen, onClose]);

  if (!isOpen || !currentProblem) return null;

  const diffColor = currentProblem.difficulty === 'Easy' ? '#4ADE80'
    : currentProblem.difficulty === 'Medium' ? '#FACC15' : '#F87171';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1, y: 0,
        boxShadow: allPassed
          ? '0 0 0 1px rgba(74,222,128,0.4), 0 30px 80px rgba(0,0,0,0.95)'
          : '0 0 0 1px rgba(124,58,237,0.25), 0 30px 80px rgba(0,0,0,0.95)',
      }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        inset: '28px',
        background: '#0C0C14',
        borderRadius: '10px',
        zIndex: 5000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '22px' }}>🧙</span>
          <div>
            <div style={{ fontSize: '16px', fontFamily: 'var(--font-cinzel)', color: '#E2E8F0', letterSpacing: '0.05em' }}>
              {currentProblem.title}
            </div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#4B5563', marginTop: '2px', letterSpacing: '0.2em' }}>
              WIZARD'S CODING TRIAL
            </div>
          </div>
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: diffColor,
            background: `${diffColor}18`,
            padding: '3px 10px',
            borderRadius: '20px',
            border: `1px solid ${diffColor}40`,
            letterSpacing: '0.1em',
          }}>
            {currentProblem.difficulty.toUpperCase()}
          </span>
          {/* Success badge */}
          <AnimatePresence>
            {allPassed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ADE80', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
              >
                <CheckCircle2 size={14} />
                <span>All tests passed</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#64748B', cursor: 'pointer', padding: '6px 8px', display: 'flex', alignItems: 'center' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PanelGroup direction="horizontal">

          {/* Left: Problem Info */}
          <Panel defaultSize={38} minSize={28}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0D0D18', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                {(['description', 'tests'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '11px 20px',
                      background: 'none',
                      border: 'none',
                      borderBottom: `2px solid ${activeTab === tab ? '#7C3AED' : 'transparent'}`,
                      color: activeTab === tab ? '#E2E8F0' : '#4B5563',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'color 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {tab === 'tests' && anyRan && (
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: allPassed ? '#4ADE80' : anyFailed ? '#F87171' : '#FACC15',
                        display: 'inline-block',
                      }} />
                    )}
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {activeTab === 'description' ? (
                  <ProblemDescription text={currentProblem.description} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {currentProblem.testCases.map((tc, i) => {
                      const statusColor = tc.status === 'passed' ? '#4ADE80' : tc.status === 'failed' ? '#F87171' : '#4B5563';
                      const StatusIcon = tc.status === 'passed' ? CheckCircle2 : tc.status === 'failed' ? XCircle : Circle;
                      return (
                        <div key={i} style={{
                          padding: '14px',
                          background: tc.status === 'passed' ? 'rgba(74,222,128,0.05)' : tc.status === 'failed' ? 'rgba(248,113,113,0.05)' : 'rgba(255,255,255,0.02)',
                          borderRadius: '8px',
                          border: `1px solid ${tc.status === 'passed' ? 'rgba(74,222,128,0.2)' : tc.status === 'failed' ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.06)'}`,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#64748B', letterSpacing: '0.1em' }}>
                              CASE {i + 1}
                            </span>
                            <StatusIcon size={14} color={statusColor} />
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div><span style={{ color: '#4B5563' }}>Input  </span><span style={{ color: '#94A3B8' }}>{tc.input}</span></div>
                            <div><span style={{ color: '#4B5563' }}>Expect </span><span style={{ color: '#94A3B8' }}>{tc.expected}</span></div>
                            {tc.actual && (
                              <div><span style={{ color: '#4B5563' }}>Got    </span><span style={{ color: tc.status === 'passed' ? '#4ADE80' : '#F87171' }}>{tc.actual}</span></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle style={{ width: '4px', background: 'rgba(255,255,255,0.03)', cursor: 'col-resize', transition: 'background 0.15s' }} />

          {/* Right: Editor + Console */}
          <Panel defaultSize={62}>
            <PanelGroup direction="vertical">

              {/* Editor */}
              <Panel defaultSize={72} minSize={40}>
                <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                  {/* File tab & Language Selector */}
                  <div style={{
                    padding: '8px 16px',
                    background: '#0A0A12',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: '#64748B',
                  }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#C084FC' }}>solution</span>
                      <span style={{ color: '#4B5563' }}>{language === 'javascript' ? '.js' : language === 'python' ? '.py' : '.cpp'}</span>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      style={{
                        background: '#1A1A24',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#E2E8F0',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  <CodeMirror
                    value={code}
                    height="100%"
                    theme={vscodeDark}
                    extensions={[javascript({ jsx: true })]}
                    onChange={(val) => setCode(val)}
                    style={{ fontSize: '14px', height: 'calc(100% - 37px)' }}
                    basicSetup={{ lineNumbers: true, foldGutter: true, autocompletion: true }}
                  />
                </div>
              </Panel>

              <PanelResizeHandle style={{ height: '4px', background: 'rgba(255,255,255,0.03)', cursor: 'row-resize' }} />

              {/* Console */}
              <Panel defaultSize={28} minSize={18}>
                <div style={{ height: '100%', background: '#08080F', display: 'flex', flexDirection: 'column' }}>
                  {/* Console header + run button */}
                  <div style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#4B5563', letterSpacing: '0.25em' }}>OUTPUT</span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {/* Test status pills */}
                      {anyRan && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {currentProblem.testCases.map((tc, i) => (
                            <div key={i} style={{
                              width: '8px', height: '8px', borderRadius: '50%',
                              background: tc.status === 'passed' ? '#4ADE80' : tc.status === 'failed' ? '#F87171' : '#374151',
                            }} />
                          ))}
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={runCode}
                        disabled={isExecuting}
                        style={{
                          padding: '8px 18px',
                          background: allPassed ? 'rgba(74,222,128,0.15)' : '#7C3AED',
                          color: allPassed ? '#4ADE80' : '#FFF',
                          border: allPassed ? '1px solid rgba(74,222,128,0.3)' : 'none',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          cursor: isExecuting ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          opacity: isExecuting ? 0.6 : 1,
                          transition: 'all 0.2s',
                        }}
                      >
                        {isExecuting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{ width: '12px', height: '12px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }}
                          />
                        ) : (
                          <Play size={12} />
                        )}
                        {isExecuting ? 'RUNNING...' : allPassed ? 'ALL PASSED' : 'RUN CODE'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Output text */}
                  <div style={{ flex: 1, padding: '14px 18px', overflowY: 'auto' }}>
                    {isExecuting ? (
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#7C3AED' }}
                      >
                        › Running test cases…
                      </motion.div>
                    ) : output ? (
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: allPassed ? '#4ADE80' : anyFailed ? '#F87171' : '#64748B',
                        whiteSpace: 'pre-wrap',
                      }}>
                        › {output}
                      </div>
                    ) : (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#374151' }}>
                        › Write your solution and press Run Code
                      </div>
                    )}
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
