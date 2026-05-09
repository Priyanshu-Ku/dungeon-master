'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';

/**
 * useGameAudio
 * 
 * Cinematic soundscape using Tone.js synthesizers.
 * No external audio files required.
 */
export function useGameAudio() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const bassRef  = useRef<Tone.MonoSynth | null>(null);
  const percussionRef = useRef<Tone.MembraneSynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);

  useEffect(() => {
    // Setup Synths
    reverbRef.current = new Tone.Reverb({ decay: 4, wet: 0.5 }).toDestination();
    
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.05, release: 1 }
    }).connect(reverbRef.current);

    bassRef.current = new Tone.MonoSynth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, release: 2 }
    }).toDestination();

    percussionRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: { type: 'sine' }
    }).toDestination();

    return () => {
      synthRef.current?.dispose();
      bassRef.current?.dispose();
      percussionRef.current?.dispose();
      reverbRef.current?.dispose();
    };
  }, []);

  const resume = useCallback(async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
  }, []);

  const onCinematicStart = useCallback(() => {
    resume();
    bassRef.current?.triggerAttackRelease('E1', '4n');
    // Low drone simulation
    const drone = new Tone.Oscillator('E2', 'sawtooth').toDestination().start().stop('+4');
    drone.volume.rampTo(-20, 0);
    drone.volume.rampTo(-60, 4);
  }, [resume]);

  const onCombatStart = useCallback(() => {
    resume();
    percussionRef.current?.triggerAttackRelease('C1', '2n');
    // Simple tension loop could be added here with Tone.Loop
  }, [resume]);

  const onDecisionOpen = useCallback(() => {
    resume();
    synthRef.current?.triggerAttackRelease(['E4', 'G4', 'B4'], '8n');
  }, [resume]);

  const onTimingStart = useCallback(() => {
    resume();
    // Metronome-like pulse
    const click = new Tone.NoiseSynth().toDestination();
    click.triggerAttackRelease('16n');
  }, [resume]);

  const onPerfectHit = useCallback(() => {
    resume();
    synthRef.current?.triggerAttackRelease(['C5', 'E5', 'G5', 'C6'], '4n');
    percussionRef.current?.triggerAttackRelease('C2', '2n');
  }, [resume]);

  const onGoodHit = useCallback(() => {
    resume();
    synthRef.current?.triggerAttackRelease(['G4', 'B4', 'D5'], '4n');
    percussionRef.current?.triggerAttackRelease('G1', '2n');
  }, [resume]);

  const onMissHit = useCallback(() => {
    resume();
    synthRef.current?.triggerAttackRelease(['F3', 'Ab3', 'Cb4'], '2n');
  }, [resume]);

  const onPhaseChange = useCallback(() => {
    resume();
    // 40Hz sweep
    const sweep = new Tone.Oscillator('C1', 'sine').toDestination();
    sweep.frequency.rampTo(40, 1);
    sweep.start().stop('+1');
  }, [resume]);

  const onVictory = useCallback(() => {
    resume();
    synthRef.current?.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '1n');
  }, [resume]);

  const onDefeat = useCallback(() => {
    resume();
    const noise = new Tone.Noise('pink').toDestination().start().stop('+2');
    noise.volume.rampTo(-60, 2);
  }, [resume]);

  return {
    onCinematicStart,
    onCombatStart,
    onDecisionOpen,
    onTimingStart,
    onPerfectHit,
    onGoodHit,
    onMissHit,
    onPhaseChange,
    onVictory,
    onDefeat,
  };
}
