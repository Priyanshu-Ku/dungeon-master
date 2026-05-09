'use client';

import React, { Suspense, useEffect, useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'motion/react';

// Stores
import { useCombatStore } from '@/store/combatStore';
import { useDungeonStore } from '@/store/dungeonStore';
import { useEquipmentStore } from '@/store/equipmentStore';
import { useLeetCodeStore } from '@/store/leetcodeStore';
import { useDialogueStore } from '@/store/dialogueStore';
import { useDailyStore } from '@/store/dailyStore';
import { useProgressionStore } from '@/store/progressionStore';
import { useAchievementStore } from '@/store/achievementStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useProblemStore } from '@/store/problemStore';
import { audioManager } from '@/lib/audioManager';

// Selectors
import { calculateDerivedStats } from '@/selectors/derivedStats';
import { getMetaModifiers } from '@/selectors/metaBonuses';

// UI Components
import { BossHPBar } from '@/components/ui/BossHPBar';
import { CombatDecisionMenu } from '@/app/combat/CombatDecisionMenu';
import { TimingTrack } from '@/components/ui/TimingTrack';
import { HitResultFlash } from '@/components/ui/HitResultFlash';
import { Minimap } from '@/components/hud/Minimap';
import { LootReveal } from '@/components/hud/LootReveal';
import { DialogueBox } from '@/components/hud/DialogueBox';
import { CodexOverlay } from '@/components/hud/CodexOverlay';
import { ProblemSolver } from '@/components/hud/ProblemSolver';

// Scene Components
import { DungeonExplorer } from '@/components/scene/DungeonExplorer';

// Persistence
import { saveRun, loadRun } from '@/lib/saveSystem';
import { getDailySeed } from '@/lib/dailyChallenge';
import { getBoundedModifiers } from '@/lib/progressionScaling';
import { GRAPHICS_PROFILES } from '@/lib/graphicsProfiles';

// Data
import { BOSS_ROSTER, getBossByDepth } from '@/lib/bossRoster';
import { getProblemsByGimmick } from '@/lib/problemPool';
import { generateLoot, ItemInstance } from '@/lib/lootSystem';

const TypewriterText = ({ text, speed = 30 }: { text: string, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

export default function CombatScene() {
  const { 
    combatPhase, setCurrentBoss, setCombatPhase, applyBossRetaliation, addXp, 
    serializeCombatState, hydrateCombatState, playerLevel, playerMaxHp, playerMaxMp, playerHp, playerMp
  } = useCombatStore();
  
  const { 
    initDungeon, currentRoomId, serializeDungeonState, hydrateDungeonState, markRoomCleared 
  } = useDungeonStore();

  const { activeDialogueLine, activeSpeaker } = useCombatStore();

  const {
    serializeEquipmentState, hydrateEquipmentState, getEquippedItems, addItem
  } = useEquipmentStore();

  const {
    serializeLeetCodeState, hydrateLeetCodeState, profile, username, syncProfile, lastSyncAt
  } = useLeetCodeStore();

  const { startDialogue } = useDialogueStore();
  const { isDailyActive, completeDaily, exitDaily } = useDailyStore();
  const { ngPlusCount, incrementNGPlus } = useProgressionStore();
  const { unlockBadge, updateProgress } = useAchievementStore();
  const { graphicsQuality } = useSettingsStore();
  const { currentProblem, setProblem, resetProblem } = useProblemStore();

  const isInitialMount = useRef(true);
  const [pendingLoot, setPendingLoot] = useState<ItemInstance[]>([]);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isIDESolverOpen, setIsIDESolverOpen] = useState(false);
  
  // Hydration
  useEffect(() => {
    if (isInitialMount.current) {
      const savedData = loadRun();
      if (savedData) {
        hydrateCombatState(savedData.combat);
        hydrateDungeonState(savedData.dungeon);
        hydrateEquipmentState(savedData.equipment);
        hydrateLeetCodeState(savedData.leetcode);
      } else {
        const seed = isDailyActive ? getDailySeed() : (Math.random().toString(36).substring(7));
        initDungeon(1, seed);
      }
      isInitialMount.current = false;
    }
  }, [hydrateCombatState, hydrateDungeonState, hydrateEquipmentState, hydrateLeetCodeState, initDungeon, isDailyActive]);

  // Periodic Profile Sync (Once per hour if linked)
  useEffect(() => {
    if (username && (!lastSyncAt || Date.now() - lastSyncAt > 3600000)) {
      syncProfile();
    }
  }, [username, lastSyncAt, syncProfile]);

  // Derived Stats Computation
  const derivedStats = useMemo(() => {
    const equipped = getEquippedItems();
    const meta = getMetaModifiers(profile);
    return calculateDerivedStats(
      { hp: playerHp, maxHp: playerMaxHp, mp: playerMp, maxMp: playerMaxMp, level: playerLevel },
      equipped,
      meta
    );
  }, [playerHp, playerMaxHp, playerMp, playerMaxMp, playerLevel, getEquippedItems, profile]);

  // Auto-Save Trigger
  useEffect(() => {
    if (['EXPLORATION', 'VICTORY', 'DECISION'].includes(combatPhase)) {
      saveRun(
        serializeCombatState(), 
        serializeDungeonState(), 
        serializeEquipmentState(), 
        serializeLeetCodeState()
      );
    }
  }, [combatPhase, serializeCombatState, serializeDungeonState, serializeEquipmentState, serializeLeetCodeState, currentRoomId]);

  // Combat Phase Logic
  useEffect(() => {
    if (combatPhase === 'EXPLORATION') {
      audioManager.playMusic('/audio/music/dungeon_ambient.mp3');
    }

    if (combatPhase === 'BOSS_CINEMATIC') {
      const dungeon = useDungeonStore.getState();
      const depth = dungeon.depth || 1;
      const baseBoss = getBossByDepth(depth);
      const mods = getBoundedModifiers(ngPlusCount);
      
      setCurrentBoss({
        ...baseBoss,
        maxHp: baseBoss.maxHp * mods.bossHpMultiplier,
        hp: baseBoss.maxHp * mods.bossHpMultiplier,
        damage: (baseBoss.damage || 10) * mods.bossDamageMultiplier
      });

      // Prepare Dynamic Problem
      const pool = getProblemsByGimmick(baseBoss.gimmick);
      const problem = pool[Math.floor(Math.random() * pool.length)];
      setProblem(problem);

      // Start Narrative Intro
      startDialogue(`boss_intro_${baseBoss.id}`, () => {
        setCombatPhase('DECISION');
      });
    }
  }, [combatPhase, setCurrentBoss, setCombatPhase, startDialogue]);

  // Boss Retaliation Loop
  useEffect(() => {
    if (combatPhase === 'BOSS_RETALIATION') {
      const timer = setTimeout(() => {
        applyBossRetaliation();
        setCombatPhase('DECISION');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [combatPhase, applyBossRetaliation, setCombatPhase]);

  // Loot Generation on Victory
  useEffect(() => {
    if (combatPhase === 'VICTORY') {
      audioManager.playSFX('/audio/sfx/victory_fanfare.mp3');
      const loot = generateLoot(currentRoomId || 'seed', 'medium');
      setPendingLoot(loot);
      markRoomCleared(currentRoomId || '');
      
      // Defeat Dialogue
      startDialogue('boss_defeat_architect');
    }
  }, [combatPhase, currentRoomId, markRoomCleared, startDialogue]);

  // Listen for IDE Success
  useEffect(() => {
    const allPassed = currentProblem?.testCases.length && currentProblem.testCases.every(tc => tc.status === 'passed');
    if (allPassed) {
      const { currentBoss, setCurrentBoss, setCombatPhase } = useCombatStore.getState();
      if (currentBoss) {
        const damage = currentBoss.maxHp * 0.4; 
        const newHp = Math.max(0, currentBoss.hp - damage);
        
        setCurrentBoss({ ...currentBoss, hp: newHp });
        audioManager.playSFX('/audio/sfx/heavy_impact.mp3');
        
        if (newHp <= 0) {
          setCombatPhase('VICTORY');
        } else {
          setCombatPhase('BOSS_RETALIATION');
        }
        
        setIsIDESolverOpen(false);
        resetProblem();
      }
    }
  }, [currentProblem, resetProblem]);

  const handleLootClaim = (item: ItemInstance) => {
    addItem(item);
    setPendingLoot(prev => prev.filter(i => i.instanceId !== item.instanceId));
  };

  const handleVictoryContinue = () => {
    addXp(50);
    if (isDailyActive) {
      completeDaily();
      updateProgress('daily_completions', 1);
    }
    incrementNGPlus();
    unlockBadge('first_descent');
    
    if (ngPlusCount >= 5) {
      unlockBadge('infinite_explorer');
    }
    
    setCombatPhase('EXPLORATION');
    setPendingLoot([]);
  };

  const activeProfile = GRAPHICS_PROFILES[graphicsQuality];

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050508', position: 'relative', overflow: 'hidden' }}>
      
      <Canvas shadows={activeProfile.shadows} dpr={activeProfile.dpr} style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.8, 6]} fov={45} />
          {/* DungeonExplorer is ALWAYS mounted to prevent black screen re-mounts */}
          <DungeonExplorer />
          <Environment preset="night" />

          {activeProfile.bloom && (
            <EffectComposer disableNormalPass>
              <Bloom 
                luminanceThreshold={0.1} 
                mipmapBlur 
                intensity={2.0} 
                resolutionScale={activeProfile.bloomResolutionScale} 
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>

      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
        {/* Subtle Background Dialogue */}
        <AnimatePresence mode="wait">
          {activeDialogueLine && (
            <motion.div 
              key={activeDialogueLine}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '12%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(2, 2, 5, 0.9)',
                backdropFilter: 'blur(20px)',
                color: activeSpeaker === 'Wizard' ? '#FFD700' : '#00E5FF',
                padding: '32px 48px',
                borderRadius: '2px',
                border: `1px solid ${activeSpeaker === 'Wizard' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 229, 255, 0.2)'}`,
                width: '90%',
                maxWidth: '750px',
                textAlign: 'center',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05)',
                pointerEvents: 'none',
                zIndex: 100
              }}
            >
              <div style={{ 
                fontSize: '10px', 
                letterSpacing: '0.5em', 
                marginBottom: '20px', 
                opacity: 0.5,
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px'
              }}>
                <div style={{ width: '30px', height: '1px', background: 'currentColor', opacity: 0.3 }} />
                {activeSpeaker}
                <div style={{ width: '30px', height: '1px', background: 'currentColor', opacity: 0.3 }} />
              </div>
              <p style={{ 
                fontSize: '24px', 
                margin: 0, 
                lineHeight: '1.5',
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 400,
                color: '#E2E8F0',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                "<TypewriterText text={activeDialogueLine} />"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {(combatPhase === 'EXPLORATION' || combatPhase === 'DECISION') && (
          <>
            <Minimap />
            <div style={{ position: 'absolute', top: '24px', left: '24px', color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '14px', pointerEvents: 'auto' }}>
              <div onClick={() => setIsCodexOpen(true)} style={{ cursor: 'pointer', color: '#7C3AED', marginBottom: '8px', textDecoration: 'underline' }}>
                OPEN CODEX [C]
              </div>
              <div onClick={() => {
                setIsIDESolverOpen(true);
              }} style={{ cursor: 'pointer', color: '#00E5FF', textDecoration: 'underline', marginBottom: '12px' }}>
                DECRYPT FRAGMENT [F]
              </div>
              LVL {playerLevel} | HP {playerHp}/{derivedStats.maxHp} | ATK x{derivedStats.damageMultiplier.toFixed(2)}
            </div>
          </>
        )}

        {['DECISION', 'TIMING', 'HIT_RESULT'].includes(combatPhase) && <BossHPBar />}

        <DialogueBox />
        <CodexOverlay isOpen={isCodexOpen} onClose={() => setIsCodexOpen(false)} />
        <ProblemSolver isOpen={isIDESolverOpen} onClose={() => setIsIDESolverOpen(false)} />

        <AnimatePresence mode="wait">
          {combatPhase === 'DECISION' && <CombatDecisionMenu key="decision" />}
          {combatPhase === 'TIMING' && <TimingTrack key="timing" />}
          {combatPhase === 'HIT_RESULT' && <HitResultFlash key="hit-result" />}
          
          {combatPhase === 'VICTORY' && (
            <motion.div
              key="victory"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, pointerEvents: 'auto' }}
            >
              <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '72px', color: '#FFD700', textShadow: '0 0 40px #FFD700', margin: 0 }}>VICTORY</h1>
                {pendingLoot.length > 0 ? (
                  <LootReveal items={pendingLoot} onClaim={handleLootClaim} />
                ) : (
                  <>
                    <p style={{ color: '#00E5FF', fontFamily: 'var(--font-mono)', marginTop: '10px' }}>+50 XP GAINED</p>
                    <button onClick={handleVictoryContinue} style={{ marginTop: '30px', padding: '12px 32px', background: 'transparent', border: '1px solid #FFD700', color: '#FFD700', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>
                      CONTINUE DESCENT
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {combatPhase === 'DEFEAT' && (
            <motion.div
              key="defeat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, pointerEvents: 'auto' }}
            >
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '72px', color: '#EF4444', textShadow: '0 0 40px #EF4444', margin: 0 }}>DEFEAT</h1>
                <p style={{ color: '#FFF', fontFamily: 'var(--font-mono)', opacity: 0.6, marginTop: '10px' }}>"Your recursions were shallow."</p>
                <button onClick={() => { localStorage.removeItem('obsidian_depths_save_v1'); window.location.reload(); }} style={{ marginTop: '30px', padding: '12px 32px', background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>
                  ERASE DATA & REBOOT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
