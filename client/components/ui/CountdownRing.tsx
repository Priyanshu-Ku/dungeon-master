'use client';

import React, { useEffect, useRef } from 'react';

interface CountdownRingProps {
  durationMs: number;
  onExpire: () => void;
  variant: 'decision' | 'timing';
}

export function CountdownRing({ durationMs, onExpire, variant }: CountdownRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const radius = 24;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const tick = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(1, elapsed / durationMs);
      const remainingPct = 1 - progress;

      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = (circumference * progress).toString();
        
        // Color logic
        if (variant === 'decision') {
          circleRef.current.style.stroke = remainingPct < 0.3 ? '#FF6B35' : '#00E5FF';
        } else {
          circleRef.current.style.stroke = remainingPct < 0.3 ? '#EF4444' : '#FF6B35';
        }
      }

      if (textRef.current) {
        textRef.current.textContent = Math.ceil(Math.max(0, durationMs - elapsed) / 1000).toString();
      }

      if (progress >= 1) {
        onExpire();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [durationMs, onExpire, variant, circumference]);

  return (
    <div style={{ width: '56px', height: '56px' }}>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle
          ref={circleRef}
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={variant === 'decision' ? '#00E5FF' : '#FF6B35'}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset="0"
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
        <text
          ref={textRef}
          x="28"
          y="33"
          textAnchor="middle"
          fill="#E8EAF0"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700 }}
        >
          0
        </text>
      </svg>
    </div>
  );
}
