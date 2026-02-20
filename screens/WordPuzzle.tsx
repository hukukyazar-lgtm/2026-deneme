
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { UserStats } from '../types';
import { Cube3D, CubeVisualStyle, RotationAxis } from '../components/Cube3D';
import { SideMenu } from '../components/SideMenu';
import { ParticleBackground } from '../components/ParticleBackground';
import { Button } from '../components/Button';
import { SoundManager } from '../managers/SoundManager';
import { QuitConfirmationModal } from '../components/QuitConfirmationModal';
import { GateQuestion } from '../lib/wordDatabase';

const COLORS = ["#22d3ee", "#fbbf24", "#f472b6", "#818cf8", "#4ade80"];
const MEMORIZE_DURATION = 30; 
const BASE_ROUND_TIME = 10;
const ROTATION_MODES: RotationAxis[] = ['XY', 'X', 'Y', 'TUMBLE'];

type CollectiveMode = 
  | 'CIRCLE' | 'FERRIS' | 'BALLERINA' | 'COG' | 'PENDULUM' 
  | 'WAVE' | 'FIGURE8' | 'PULSE' | 'VORTEX' | 'DNA' 
  | 'ORBIT' | 'DIAMOND' | 'ZIGZAG' | 'BOUNCE' | 'FLOWER' 
  | 'HEART' | 'TORNADO' | 'SNAKE' | 'ELASTIC' | 'TWIN_RING';

const COLLECTIVE_MODES: CollectiveMode[] = [
  'CIRCLE', 'FERRIS', 'BALLERINA', 'COG', 'PENDULUM', 
  'WAVE', 'FIGURE8', 'PULSE', 'VORTEX', 'DNA', 
  'ORBIT', 'DIAMOND', 'ZIGZAG', 'BOUNCE', 'FLOWER'
];

const PHASE_STYLES: CubeVisualStyle[] = [
  'NEON', 'CYBER', 'PLASMA', 'AETHER', 'GOLD', 'CRYSTAL', 'PEARL', 'HOLOGRAPHIC', 'MAGMA', 'PEARL'
];

export const WordPuzzle: React.FC<{ 
  stats: UserStats; 
  questions: GateQuestion[];
  onComplete: (e: number, t: string[], d: string[]) => void; 
  onExit: () => void; 
  onUpdateStats: (s: Partial<UserStats>) => void 
}> = ({ stats, questions, onComplete, onExit, onUpdateStats }) => {
  
  const [currentRound, setCurrentRound] = useState(0);

  const activeRoundData = useMemo(() => 
    questions[currentRound] || { 
      planetId: 0,
      planetName: "HATA",
      gateId: 0,
      quesId: 0,
      target: "HATA", 
      distractors: ["HATA", "HATA", "HATA"], 
      dds: 1.15 
    }, 
  [questions, currentRound]);
  
  // App.tsx'den gelen kümülatif zorluk
  const currentDDS = useMemo(() => stats.difficultyFactor, [stats.difficultyFactor]);
  const dynamicRoundTime = useMemo(() => BASE_ROUND_TIME / currentDDS, [currentDDS]);
  
  const currentRotationAxis = useMemo(() => ROTATION_MODES[currentRound % ROTATION_MODES.length], [currentRound]);
  const currentVisualStyle = useMemo(() => {
    if (stats.streak >= 3) return 'MAGMA';
    if (stats.streak >= 2) return 'PLASMA';
    return PHASE_STYLES[currentRound % PHASE_STYLES.length];
  }, [currentRound, stats.streak]);

  const currentCollectiveMode = useMemo(() => COLLECTIVE_MODES[currentRound % COLLECTIVE_MODES.length], [currentRound]);

  const [timeLeft, setTimeLeft] = useState(MEMORIZE_DURATION);
  const [gamePhase, setGamePhase] = useState<'MEMORIZE' | 'GUESS'>('MEMORIZE');
  const [sessionScore, setSessionScore] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [choiceStatus, setChoiceStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [roundResults, setRoundResults] = useState<( 'success' | 'fail' | null)[]>(new Array(5).fill(null));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showReflexBonus, setShowReflexBonus] = useState(false);

  // Kümülatif çarpanlar
  const overdriveMultiplier = useMemo(() => 1 + (stats.streak * 0.1), [stats.streak]);
  
  const effectiveDDS = useMemo(() => {
    if (gamePhase === 'MEMORIZE') return currentDDS;
    const timeProgress = 1 - (timeLeft / dynamicRoundTime);
    const timeRamp = 1 + (Math.pow(timeProgress, 2) * 0.5);
    return currentDDS * timeRamp * overdriveMultiplier;
  }, [currentDDS, timeLeft, dynamicRoundTime, gamePhase, overdriveMultiplier]);

  const pulseFactor = useMemo(() => {
    return 1 + (Math.sin(rotationOffset * 0.15) * 0.2 * (effectiveDDS > 1.6 ? 1 : 0));
  }, [rotationOffset, effectiveDDS]);
  
  const adrenalineFactor = useMemo(() => {
    if (gamePhase === 'MEMORIZE') return 1;
    const timeRatio = timeLeft / dynamicRoundTime;
    return effectiveDDS * (timeRatio < 0.3 ? 2 : 1) * pulseFactor;
  }, [timeLeft, effectiveDDS, gamePhase, dynamicRoundTime, pulseFactor]);

  const [isFrozen, setIsFrozen] = useState(false);
  const [hintRevealUsed, setHintRevealUsed] = useState(false);
  const [isHintMenuOpen, setIsHintMenuOpen] = useState(false);

  const timerRef = useRef<number | null>(null);
  
  const activeOptions = useMemo(() => {
    return [activeRoundData.target, ...activeRoundData.distractors].sort(() => Math.random() - 0.5);
  }, [activeRoundData]);

  const handleFreeze = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFrozen || stats.hintsFreeze <= 0 || gamePhase !== 'GUESS') return;
    onUpdateStats({ hintsFreeze: stats.hintsFreeze - 1 });
    setIsFrozen(true);
    SoundManager.getInstance().playPop();
    setIsHintMenuOpen(false);
    setTimeout(() => setIsFrozen(false), 5000); 
  };

  const handleReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hintRevealUsed || stats.hintsReveal <= 0 || gamePhase !== 'GUESS') return;
    onUpdateStats({ hintsReveal: stats.hintsReveal - 1 });
    setHintRevealUsed(true);
    SoundManager.getInstance().playPop();
    setIsHintMenuOpen(false);
  };

  useEffect(() => {
    if (choiceStatus !== 'idle' || selectedChoice || isMenuOpen || isTransitioning || showQuitModal) return;
    
    timerRef.current = window.setInterval(() => {
      if (!isFrozen) {
        setTimeLeft(prev => {
          const nextTime = prev - 0.05;
          if (gamePhase === 'MEMORIZE' && nextTime <= 0) {
            setGamePhase('GUESS');
            return dynamicRoundTime;
          }
          if (gamePhase === 'GUESS' && nextTime <= 0) {
            handleChoice("TIME_UP");
            return dynamicRoundTime;
          }
          return nextTime;
        });
      }

      setRotationOffset(prev => {
        const speed = gamePhase === 'MEMORIZE' ? 0.75 : 0.25;
        return prev + (speed * effectiveDDS * pulseFactor);
      });

    }, 50);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [choiceStatus, selectedChoice, isMenuOpen, isTransitioning, currentRound, showQuitModal, effectiveDDS, pulseFactor, gamePhase, isFrozen, dynamicRoundTime]);

  const handleChoice = (choice: string) => {
    if (gamePhase !== 'GUESS' || selectedChoice || choiceStatus !== 'idle' || isTransitioning) return;
    setSelectedChoice(choice);
    setIsHintMenuOpen(false);
    
    setTimeout(() => {
      const isCorrect = choice === activeRoundData.target;
      
      const reflexTime = dynamicRoundTime - timeLeft;
      const isReflex = isCorrect && reflexTime < 2.0;
      if (isReflex) {
        setShowReflexBonus(true);
        setTimeout(() => setShowReflexBonus(false), 1000);
      }

      if (isCorrect) {
        SoundManager.getInstance().playSuccess();
        // Global seriyi artır
        onUpdateStats({ streak: stats.streak + 1 });
      } else {
        if (choice !== "TIME_UP") SoundManager.getInstance().playFail();
        // Global seriyi boz
        onUpdateStats({ streak: 0 });
      }

      const isCriticalSuccess = isCorrect && timeLeft < 1.0;
      const pointsMultiplier = (isCriticalSuccess ? 5 : 1) * (isReflex ? 2.5 : 1);
      
      const points = Math.floor((100 + timeLeft * 20) * effectiveDDS * (isFrozen ? 0.8 : 1.2) * pointsMultiplier);
      const nextResults = [...roundResults];
      setChoiceStatus(isCorrect ? 'success' : 'fail');
      nextResults[currentRound] = isCorrect ? 'success' : 'fail';
      const nextScore = isCorrect ? sessionScore + points : Math.max(0, sessionScore - Math.floor(75 * effectiveDDS));
      setSessionScore(nextScore);
      
      const delay = isCorrect ? (activeRoundData.target.length * 150 + 1000) : 1000;
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          if (currentRound === questions.length - 1) {
            onComplete(nextScore, questions.map(r => r.target), questions.flatMap(r => r.distractors));
          } else {
            setCurrentRound(prev => prev + 1);
            setTimeLeft(MEMORIZE_DURATION);
            setGamePhase('MEMORIZE');
            setChoiceStatus('idle');
            setSelectedChoice(null);
            setRevealedIndex(-1);
            setRoundResults(nextResults);
            setIsTransitioning(false);
            setHintRevealUsed(false);
            setIsFrozen(false);
          }
        }, 400);
      }, delay);
    }, 500); 
  };

  useEffect(() => {
    if (choiceStatus === 'success') {
      let currentIdx = 0;
      const interval = setInterval(() => {
        setRevealedIndex(currentIdx);
        currentIdx++;
        if (currentIdx >= activeRoundData.target.length) clearInterval(interval);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [choiceStatus, activeRoundData.target]);

  const ringItems = useMemo(() => {
    return activeRoundData.target.split("").map((char, i) => ({
      char,
      color: COLORS[i % COLORS.length]
    }));
  }, [activeRoundData]);

  const isCritical = gamePhase === 'GUESS' && timeLeft < 3 && !isFrozen;
  const isOverdrive = stats.streak >= 3;
  const isInsane = effectiveDDS > 2.2; 
  const isGlitch = effectiveDDS > 2.5;

  const calculatePosition = (idx: number, total: number, time: number, mode: CollectiveMode, baseDist: number) => {
    const baseAngle = (idx / total) * 360;
    const angle = baseAngle + rotationOffset;
    const rad = (angle * Math.PI) / 180;
    const t = rotationOffset * 0.05;
    let x = 0, y = 0, z = 20;
    const zBreath = Math.sin(t * 1.5 + idx) * 40 * (effectiveDDS > 1.5 ? 1 : 0);
    z += zBreath;

    const getModePos = (m: CollectiveMode) => {
      let mx = 0, my = 0, mz = 20;
      switch(m) {
        case 'CIRCLE': mx = Math.cos(rad) * baseDist; my = Math.sin(rad) * baseDist; break;
        case 'FERRIS': mx = Math.cos(rad) * baseDist; my = Math.sin(rad) * baseDist; break;
        case 'BALLERINA': mx = Math.cos(rad) * baseDist; my = Math.sin(rad) * baseDist + Math.sin(t * 3 + idx) * 20; break;
        case 'COG': const sRad = (Math.floor(angle / 15) * 15 * Math.PI) / 180; mx = Math.cos(sRad) * baseDist; my = Math.sin(sRad) * baseDist; break;
        case 'PENDULUM': const sw = Math.sin(t) * 90; const swR = ((baseAngle + sw) * Math.PI) / 180; mx = Math.cos(swR) * baseDist; my = Math.sin(swR) * baseDist; break;
        case 'WAVE': mx = (idx - (total - 1) / 2) * 60; my = Math.sin(t * 2 + idx * 0.8) * 50; break;
        case 'FIGURE8': mx = Math.sin(rad) * baseDist; my = Math.sin(rad * 2) * (baseDist / 2); break;
        case 'PULSE': const p = baseDist * (1 + Math.sin(t * 4) * 0.2); mx = Math.cos(rad) * p; my = Math.sin(rad) * p; break;
        case 'VORTEX': const vD = baseDist * (1 + Math.sin(t + idx) * 0.3); mx = Math.cos(rad) * vD; my = Math.sin(rad) * vD; mz = Math.cos(t + idx) * 50; break;
        case 'DNA': mx = Math.sin(t + idx * 0.5) * 60; my = (idx - (total - 1) / 2) * 60; mz = Math.cos(t + idx * 0.5) * 60; break;
        case 'ORBIT': mx = Math.cos(rad) * baseDist * 1.5; my = Math.sin(rad) * baseDist * 0.6; break;
        case 'DIAMOND': const dR = (angle * Math.PI) / 180; mx = Math.sign(Math.cos(dR)) * Math.pow(Math.abs(Math.cos(dR)), 0.5) * baseDist; my = Math.sign(Math.sin(dR)) * Math.pow(Math.abs(Math.sin(dR)), 0.5) * baseDist; break;
        case 'ZIGZAG': mx = (idx - (total - 1) / 2) * 60; my = (Math.abs((t * 100 + idx * 50) % 200 - 100) - 50); break;
        case 'BOUNCE': mx = Math.cos(rad) * baseDist; my = Math.abs(Math.sin(t * 2 + idx)) * -baseDist; break;
        case 'FLOWER': const rF = baseDist * Math.cos(3 * rad); mx = Math.cos(rad) * rF; my = Math.sin(rad) * rF; break;
        case 'HEART': const hT = rad; mx = 10 * (16 * Math.pow(Math.sin(hT), 3)); my = -10 * (13 * Math.cos(hT) - 5 * Math.cos(2*hT) - 2 * Math.cos(3*hT) - Math.cos(4*hT)); break;
        case 'TORNADO': const tH = (idx / total); const tDt = baseDist * (0.5 + tH); mx = Math.cos(rad * 2) * tDt; my = (tH - 0.5) * 200; mz = Math.sin(rad * 2) * tDt; break;
        case 'SNAKE': const sA = rotationOffset + (idx * 20); const sR = (sA * Math.PI) / 180; mx = Math.cos(sR) * baseDist; my = Math.sin(sR) * baseDist; break;
        case 'ELASTIC': const eT = t + Math.sin(t + idx) * 0.2; const eR = (eT * 50 + baseAngle) * Math.PI / 180; mx = Math.cos(eR) * baseDist; my = Math.sin(eR) * baseDist; break;
        case 'TWIN_RING': const dir = idx % 2 === 0 ? 1 : -1; const twR = (baseAngle + rotationOffset * dir) * Math.PI / 180; mx = Math.cos(twR) * (baseDist + (dir * 20)); my = Math.sin(twR) * (baseDist + (dir * 20)); break;
        default: mx = Math.cos(rad) * baseDist; my = Math.sin(rad) * baseDist;
      }
      return { mx, my, mz };
    };

    const pos = getModePos(mode);
    x = pos.mx; y = pos.my; z = pos.mz + zBreath;
    return { x, y, z };
  };

  return (
    <div className={`absolute inset-0 transition-all duration-300 flex flex-col overflow-hidden ${isInsane ? 'bg-purple-950/30' : isOverdrive ? 'bg-orange-950/20' : isCritical ? 'bg-red-950/20' : 'bg-gradient-to-b from-[#020617] to-[#010413]'} ${showReflexBonus ? 'brightness-150' : ''}`}>
      <ParticleBackground speedMultiplier={choiceStatus === 'success' ? 0.05 : 0.2 * adrenalineFactor} />
      
      <div className={`pt-12 px-8 flex justify-between items-center z-20 transition-opacity duration-500 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col gap-1">
          <div className="bg-[#1E293B] border-x-[2px] border-t-[2.5px] border-white/10 border-b-[8px] border-b-[#0F172A] rounded-[24px] px-6 py-3 shadow-2xl flex flex-col items-center relative">
              <div className="flex gap-2 relative z-10">
                {roundResults.map((res, i) => (
                  <div key={i} className={`w-5 h-5 rounded-lg border-2 transition-all duration-500 ${res === 'success' ? 'bg-[#00C853] border-white' : res === 'fail' ? 'bg-[#D50000] border-white' : i === currentRound ? 'bg-[#22d3ee] border-white animate-pulse' : 'bg-black/40 border-white/5'}`} />
                ))}
              </div>
              <span className="text-[9px] font-[900] text-white/30 tracking-[0.3em] uppercase mt-2">{activeRoundData.planetName} - G{activeRoundData.gateId}</span>
          </div>
          {isOverdrive && (
            <div className="bg-orange-500 text-black text-[9px] font-black px-3 py-1 rounded-full text-center shadow-[0_0_15px_#f97316] animate-bounce">
              🔥 OVERDRIVE x{overdriveMultiplier.toFixed(1)}
            </div>
          )}
        </div>
        <div className={`text-4xl font-[900] transition-all duration-300 tabular-nums ${isInsane ? 'text-purple-400 scale-125 drop-shadow-[0_0_25px_#a855f7]' : isOverdrive ? 'text-orange-400 scale-110 drop-shadow-[0_0_20px_#fb923c]' : isCritical ? 'text-red-500 scale-110 drop-shadow-[0_0_15px_#ef4444]' : 'text-white drop-shadow-[0_4px_0_#0f172a]'}`}>
            {sessionScore.toLocaleString()}
        </div>
      </div>

      <div className={`flex-1 relative flex items-center justify-center perspective-[1500px] z-10 min-h-0 ${isMenuOpen || isHintMenuOpen ? 'blur-sm brightness-50' : ''}`}>
        <div className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-75 blur-lg' : 'opacity-100 scale-100'} ${isCritical || isOverdrive || isInsane ? (isInsane ? 'animate-[insaneShake_0.1s_infinite]' : 'animate-[shake_0.2s_infinite]') : ''}`} style={{ transformStyle: 'preserve-3d' }}>
           {ringItems.map((item, idx) => {
             const isSuccess = choiceStatus === 'success';
             let x = 0, y = 0, z = 20, scale = 1;
             const baseDist = 130 * (isCritical || isOverdrive || isInsane ? 1.1 : 1);
             if (!isSuccess) {
                const pos = calculatePosition(idx, ringItems.length, rotationOffset, currentCollectiveMode, baseDist);
                x = pos.x; y = pos.y; z = pos.z;
             } else {
                x = (idx - (ringItems.length - 1) / 2) * 55;
                y = 0; scale = 1.1 + (revealedIndex === idx ? 0.2 : 0);
             }
             return (
               <div key={idx} className="absolute transition-all duration-400" style={{ transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`, transformStyle: 'preserve-3d', zIndex: Math.round(z + 100) }}>
                  <Cube3D size={isSuccess ? 64 : 58} label={gamePhase === 'GUESS' && !isSuccess ? '?' : item.char} color={item.color} visualStyle={isInsane ? 'VOID' : isOverdrive ? 'MAGMA' : isCritical ? 'LAVA' : currentVisualStyle} status={choiceStatus} isRevealed={true} speed={isSuccess ? 0 : 4} rotationAxis={currentRotationAxis} />
               </div>
             );
           })}
        </div>
      </div>

      <div className={`px-6 pb-14 flex flex-col gap-6 z-20 transition-all duration-700 shrink-0 ${isTransitioning || choiceStatus === 'success' ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'} ${isMenuOpen ? 'blur-sm' : ''}`}>
        <div className={`w-full h-10 bg-black/40 rounded-[20px] border-b-[6px] border-black p-[6px] relative overflow-hidden`}>
          <div className={`h-full relative transition-all duration-100 ease-linear rounded-full`} style={{ width: `${(timeLeft / (gamePhase === 'MEMORIZE' ? MEMORIZE_DURATION : dynamicRoundTime)) * 100}%`, backgroundColor: isInsane ? '#a855f7' : isOverdrive ? '#f97316' : isCritical ? '#ef4444' : (isFrozen ? '#22d3ee' : '#fbbf24') }} />
        </div>
        {gamePhase === 'MEMORIZE' ? (
          <Button variant="green" onClick={() => { setGamePhase('GUESS'); setTimeLeft(dynamicRoundTime); }} className="w-full !h-28 !rounded-[40px] !text-4xl shadow-[0_15px_30px_rgba(74,222,128,0.4)]">BULDUM!</Button>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {activeOptions.map((opt, i) => (
              <Button key={i} variant={selectedChoice === opt ? (choiceStatus === 'success' ? 'green' : 'coral') : (['indigo', 'pink', 'amber', 'cyan'][i % 4] as any)} onClick={() => handleChoice(opt)} className="w-full !h-24 !rounded-[36px] !text-[20px]" disabled={selectedChoice !== null}>{hintRevealUsed && opt === activeRoundData.target ? `(${opt[0]}) ${opt.slice(1)}` : opt}</Button>
            ))}
          </div>
        )}
      </div>

      <div className="fixed right-4 bottom-4 z-[300]">
        <SideMenu onExit={() => setShowQuitModal(true)} onToggle={setIsMenuOpen} isMinimal={true} expandDirection="up" />
      </div>
      {showQuitModal && <QuitConfirmationModal onConfirm={onExit} onCancel={() => setShowQuitModal(false)} />}
    </div>
  );
};
