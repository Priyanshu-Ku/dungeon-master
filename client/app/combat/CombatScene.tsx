'use client';

import React, { Suspense, useEffect, useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

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
    serializeCombatState, hydrateCombatState, playerLevel, playerMaxHp, playerMaxMp, playerHp, playerMp, enemyHp
  } = useCombatStore();
  
  const { 
    initDungeon, currentRoomId, serializeDungeonState, hydrateDungeonState, markRoomCleared 
  } = useDungeonStore();

  const { activeDialogueLine, activeSpeaker, showCheckpointNotif, showCodingChallenge, setShowCodingChallenge } = useCombatStore();

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
      
      <Canvas 
        shadows={activeProfile.shadows ? { type: THREE.PCFShadowMap } : false} 
        dpr={activeProfile.dpr} 
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      >
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
        {/* ── CHECKPOINT NOTIFICATION ── */}
        <AnimatePresence>
          {showCheckpointNotif && (
            <motion.div
              initial={{ x: 120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 120, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '50%',
                right: '32px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                zIndex: 300,
                width: '260px',
              }}
            >
              {/* Glow backdrop */}
              <div style={{
                position: 'absolute', inset: '-4px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,140,0,0.1))',
                filter: 'blur(12px)',
              }} />

              <div style={{
                position: 'relative',
                background: 'linear-gradient(160deg, rgba(20,15,0,0.97), rgba(10,8,0,0.99))',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: '8px',
                padding: '20px 20px 16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,215,0,0.08)',
                backdropFilter: 'blur(20px)',
                overflow: 'hidden',
              }}>

                {/* Corner accents */}
                {[{top:'6px',left:'6px',bw:'2px 0 0 2px'},{top:'6px',right:'6px',bw:'2px 2px 0 0'},
                  {bottom:'6px',left:'6px',bw:'0 0 2px 2px'},{bottom:'6px',right:'6px',bw:'0 2px 2px 0'}]
                  .map((c,i) => (
                  <div key={i} style={{
                    position:'absolute', width:'10px', height:'10px',
                    borderStyle:'solid', borderColor:'rgba(255,215,0,0.5)',
                    borderWidth: c.bw, ...c,
                  }}/>
                ))}

                {/* Icon row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  {/* Pulsing checkpoint ring */}
                  <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
                    <motion.div
                      animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50%',
                        border: '2px solid #FFD700',
                      }}
                    />
                    <div style={{
                      position: 'absolute', inset: '4px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #3a2800, #1a1000)',
                      border: '1px solid rgba(255,215,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px',
                    }}>✦</div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.4em',
                      color: 'rgba(255,215,0,0.5)',
                      textTransform: 'uppercase',
                      marginBottom: '4px',
                    }}>Quest Milestone</div>
                    <div style={{
                      fontSize: '15px',
                      fontFamily: 'var(--font-cinzel)',
                      fontWeight: 700,
                      color: '#FFD700',
                      letterSpacing: '0.05em',
                    }}>Checkpoint Unlocked</div>
                  </div>
                </div>

                {/* Subtext */}
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(200,180,100,0.7)',
                  marginBottom: '14px',
                  lineHeight: '1.5',
                }}>The Wizard awaits your plea…</div>

                {/* Auto-dismiss progress bar */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 2.5, ease: 'linear' }}
                  style={{
                    height: '2px',
                    background: 'linear-gradient(to right, #FFD700, #FF8C00)',
                    borderRadius: '1px',
                    transformOrigin: 'left',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── DIALOGUE BOX ── */}
        <AnimatePresence mode="wait">
          {activeDialogueLine && activeSpeaker && (() => {
            const isWizard = activeSpeaker === 'Wizard';
            const accent   = isWizard ? '#C9A84C' : '#4FC3F7';
            const avatarBg = isWizard
              ? 'radial-gradient(circle at 40% 35%, #2a1d00, #0a0700)'
              : 'radial-gradient(circle at 40% 35%, #002030, #000b12)';
            return (
              <motion.div
                key={activeDialogueLine}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  bottom: '6%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '88%',
                  maxWidth: '820px',
                  pointerEvents: 'none',
                  zIndex: 200,
                }}
              >
                {/* Panel */}
                <div style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  background: 'rgba(6, 6, 14, 0.92)',
                  backdropFilter: 'blur(18px)',
                  border: `1px solid rgba(${isWizard ? '201,168,76' : '79,195,247'},0.2)`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: `0 16px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.03)`,
                }}>

                  {/* Left accent bar */}
                  <div style={{
                    width: '4px',
                    flexShrink: 0,
                    background: `linear-gradient(to bottom, ${accent}, transparent)`,
                  }} />

                  {/* Avatar */}
                  <div style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px 20px 20px 16px',
                  }}>
                    <motion.div
                      animate={{
                        boxShadow: [
                          `0 0 10px ${accent}55`,
                          `0 0 22px ${accent}99`,
                          `0 0 10px ${accent}55`,
                        ],
                      }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: avatarBg,
                        border: `1.5px solid ${accent}66`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '26px',
                        userSelect: 'none',
                      }}
                    >
                      {isWizard ? '🧙' : '⚔️'}
                    </motion.div>
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, padding: '18px 24px 18px 4px', minWidth: 0 }}>
                    {/* Speaker label */}
                    <div style={{
                      fontSize: '9px',
                      letterSpacing: '0.45em',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: accent,
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                      opacity: 0.85,
                    }}>
                      {activeSpeaker}
                    </div>

                    {/* Dialogue */}
                    <p style={{
                      margin: 0,
                      fontSize: '17px',
                      lineHeight: '1.7',
                      fontFamily: 'Georgia, serif',
                      fontWeight: 400,
                      color: '#D8DFE8',
                      textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                    }}>
                      <TypewriterText text={activeDialogueLine} speed={22} />
                    </p>
                  </div>

                  {/* Right: animated sound bars */}
                  <div style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    paddingRight: '20px',
                    gap: '3px',
                  }}>
                    {[0.5, 0.9, 0.6, 1, 0.4].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ scaleY: [h, 1, h * 0.3, 0.8, h] }}
                        transition={{
                          duration: 0.7 + i * 0.09,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.11,
                        }}
                        style={{
                          width: '3px',
                          height: '18px',
                          borderRadius: '2px',
                          background: accent,
                          transformOrigin: 'center',
                          opacity: 0.65,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>



        {(combatPhase === 'EXPLORATION' || combatPhase === 'DECISION' || combatPhase === 'REALTIME_COMBAT') && (
          <>
            <Minimap />
            <PremiumHUD 
              playerHp={playerHp} 
              playerMaxHp={playerMaxHp} 
              playerLevel={playerLevel}
              enemyHp={enemyHp}
              isCombatActive={combatPhase === 'REALTIME_COMBAT'}
              onOpenCodex={() => setIsCodexOpen(true)}
              onOpenSolver={() => setIsIDESolverOpen(true)}
            />
          </>
        )}

        {['DECISION', 'TIMING', 'HIT_RESULT'].includes(combatPhase) && <BossHPBar />}

        <DialogueBox />
        <CodexOverlay isOpen={isCodexOpen} onClose={() => setIsCodexOpen(false)} />
        <ProblemSolver
          isOpen={showCodingChallenge || isIDESolverOpen}
          onClose={() => { setShowCodingChallenge(false); setIsIDESolverOpen(false); }}
        />

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
function PremiumHUD({ 
  playerHp, playerMaxHp, playerLevel, enemyHp, isCombatActive 
}: { 
  playerHp: number, playerMaxHp: number, playerLevel: number, enemyHp: number, isCombatActive: boolean
}) {
  return (
    <div style={{
      position: 'absolute',
      top: '30px',
      left: '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      pointerEvents: 'none',
      zIndex: 1000,
      fontFamily: "'Cinzel', serif" // Fantasy/Ancient font
    }}>
      {/* Google Font Import for Cinzel */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');
      `}} />

      {/* Player Frame (Ancient Stone) */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
          padding: '12px 20px',
          borderRadius: '4px',
          border: '2px solid #8B7355', // Aged Gold/Bronze
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(139, 115, 85, 0.2)',
          minWidth: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Corner Accents */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderTop: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', borderTop: '2px solid #D4AF37', borderRight: '2px solid #D4AF37' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '36px', height: '36px', 
              background: '#0a0a0a',
              border: '2px solid #D4AF37',
              borderRadius: '2px', transform: 'rotate(45deg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
            }}>
              <span style={{ transform: 'rotate(-45deg)', color: '#D4AF37', fontWeight: '900', fontSize: '14px' }}>{playerLevel}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '4px' }}>
              <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '16px', letterSpacing: '2px' }}>WARRIOR</span>
              <span style={{ color: '#8B7355', fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px' }}>LEVEL STATUS</span>
            </div>
          </div>
          <div style={{ fontSize: '18px', filter: 'sepia(1) saturate(5)' }}>🛡️</div>
        </div>

        {/* HP Bar Container (Deep Ruby) */}
        <div style={{ position: 'relative', width: '100%', marginTop: '4px' }}>
          <div style={{ 
            width: '100%', height: '18px', background: '#0a0a0a', 
            border: '1px solid #4a4a4a', borderRadius: '2px', overflow: 'hidden',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8)'
          }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              style={{ 
                height: '100%', 
                background: playerHp < 30 
                  ? 'linear-gradient(90deg, #7f1d1d, #450a0a)' 
                  : 'linear-gradient(90deg, #991b1b, #7f1d1d)',
                boxShadow: '0 0 15px rgba(153, 27, 27, 0.4)',
                borderRight: '2px solid #D4AF37'
              }}
            />
          </div>
          <div style={{ position: 'absolute', right: '8px', top: '2px', color: '#D4AF37', fontSize: '10px', fontWeight: 'bold', textShadow: '1px 1px 2px black' }}>
            {Math.ceil(playerHp)} <span style={{ opacity: 0.6 }}>/ {playerMaxHp}</span>
          </div>
        </div>
      </motion.div>

      {/* Enemy Bar (Ancient Runic) */}
      <AnimatePresence>
        {isCombatActive && enemyHp > 0 && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              padding: '10px 18px',
              border: '1px solid #581c1c',
              borderTop: '2px solid #D4AF37',
              minWidth: '280px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px' }}>DREAD KNIGHT</span>
              <span style={{ color: '#581c1c', fontSize: '10px', fontWeight: 'bold' }}>ANCIENT FOE</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: '#0a0a0a', border: '1px solid #333' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(enemyHp / 100) * 100}%` }}
                style={{ 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #450a0a, #7f1d1d)',
                  boxShadow: '0 0 10px rgba(127, 29, 29, 0.5)'
                }}
              />
            </div>
            {/* Runic Symbol Decoration */}
            <div style={{ position: 'absolute', bottom: '-15px', left: '50%', transform: 'translateX(-50%)', color: '#D4AF37', fontSize: '12px', opacity: 0.5 }}>
              ᛚ ᛟ ᛇ ᚦ
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
