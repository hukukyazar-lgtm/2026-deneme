
import React, { useState, useMemo, useEffect } from 'react';
import { UserStats } from '../types';
import { Button } from '../components/Button';
import { QuitConfirmationModal } from '../components/QuitConfirmationModal';
import { SideMenu } from '../components/SideMenu';
import { ParticleBackground } from '../components/ParticleBackground';
import { Cube3D, CubeVisualStyle } from '../components/Cube3D';
import { SoundManager } from '../managers/SoundManager';

interface MemoryGameProps {
  stats: UserStats;
  backgroundUrl: string;
  words: string[];
  targetWords: string[];
  onNext: (correctCount: number) => void;
  onFail: () => void;
  onExit: () => void;
  initialScore?: number;
}

const GEÇİT_PALETİ = [
  { bg: 'rgba(34, 211, 238, 1)', glow: '#0891b2' },
  { bg: 'rgba(129, 140, 248, 1)', glow: '#4f46e5' },
  { bg: 'rgba(244, 114, 182, 1)', glow: '#db2777' },
  { bg: 'rgba(251, 191, 36, 1)', glow: '#d97706' },
  { bg: 'rgba(74, 222, 128, 1)', glow: '#16a34a' },
];

const GRID_POSITIONS = [
  { t: '12%', l: '20%' }, { t: '12%', l: '40%' }, { t: '12%', l: '60%' }, { t: '12%', l: '80%' },
  { t: '26%', l: '20%' }, { t: '26%', l: '40%' }, { t: '26%', l: '60%' }, { t: '26%', l: '80%' },
  { t: '40%', l: '20%' }, { t: '40%', l: '40%' }, { t: '40%', l: '60%' }, { t: '40%', l: '80%' },
  { t: '54%', l: '20%' }, { t: '54%', l: '40%' }, { t: '54%', l: '60%' }, { t: '54%', l: '80%' },
  { t: '68%', l: '20%' }, { t: '68%', l: '40%' }, { t: '68%', l: '60%' }, { t: '68%', l: '80%' }
];

const VISUAL_STYLES: CubeVisualStyle[] = [
  'GLASS', 'CRYSTAL', 'METAL', 'NEON', 'PLASMA', 'CHROME', 'AETHER', 
  'VOID', 'GOLD', 'ICE', 'EMERALD', 'RUBY', 'OBSIDIAN', 'MAGMA', 
  'CYBER', 'POISON', 'PEARL', 'GALAXY', 'QUARTZ', 'HOLOGRAPHIC',
  'GHOST', 'DARK'
];

export const MemoryGame: React.FC<MemoryGameProps> = ({ stats, words, targetWords, onNext, onFail, onExit }) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isRevealing, setIsRevealing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [echoPoint, setEchoPoint] = useState<{ x: string, y: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const currentCubeVisualStyle = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * VISUAL_STYLES.length);
    return VISUAL_STYLES[randomIndex];
  }, [words]);

  const displayWords = useMemo(() => words.map((word, i) => {
    const basePos = GRID_POSITIONS[i] || { t: '50%', l: '50%' };
    const driftT = Math.sin(gameTime * 0.5 + i) * 1.5 * stats.difficultyFactor;
    const driftL = Math.cos(gameTime * 0.5 + i) * 1.5 * stats.difficultyFactor;
    
    return { 
      word, 
      color: GEÇİT_PALETİ[i % 5], 
      pos: { 
        t: `calc(${basePos.t} + ${driftT}px)`, 
        l: `calc(${basePos.l} + ${driftL}px)` 
      },
      zOffset: (Math.random() * 40 - 20) * (stats.difficultyFactor > 1.2 ? 1 : 0)
    };
  }), [words, stats.difficultyFactor, gameTime]);

  const correctIndices = useMemo(() => new Set(displayWords.map((item, i) => targetWords.includes(item.word) ? i : -1).filter(i => i !== -1)), [displayWords, targetWords]);

  const handleWordClick = (i: number, e: React.MouseEvent) => {
    if (isRevealing || isMenuOpen) return;
    SoundManager.getInstance().playPop();
    
    // AŞAMA 5.3: Quantum Echo Noktası Belirle
    setEchoPoint({ x: `${e.clientX}px`, y: `${e.clientY}px` });
    setTimeout(() => setEchoPoint(null), 600);

    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i); else if (n.size < 5) n.add(i);
      return n;
    });
  };

  const handleSubmit = () => {
    if (selected.size < 5 || isRevealing || isMenuOpen) return;
    setIsRevealing(true);
    
    const res: boolean[] = [];
    let correct = 0;
    const selectedIndices = Array.from(selected);
    selectedIndices.forEach(idx => {
      const isCorrect = correctIndices.has(idx);
      res.push(isCorrect);
      if (isCorrect) correct++;
    });
    
    setResults(res);
    if (correct >= 3) SoundManager.getInstance().playSuccess();
    else SoundManager.getInstance().playFail();
    
    setTimeout(() => {
      if (correct >= 3) onNext(correct);
      else {
        onFail();
        setIsRevealing(false);
        setSelected(new Set());
        setResults([]);
        setGameTime(0);
      }
    }, 2500);
  };

  const vignetteIntensity = Math.min(0.8, gameTime * 0.05);
  const isShaking = gameTime > 10; 
  const shakeIntensity = Math.min(1.5, (gameTime - 10) * 0.2);
  
  // AŞAMA 5.3: Neural Pulse (Nöral Ritim)
  const pulseScale = 1 + (Math.sin(gameTime * 2) * 0.02 * stats.difficultyFactor);
  
  return (
    <div className="absolute inset-0 bg-[#020617] flex flex-col overflow-hidden transition-all duration-300">
      <ParticleBackground speedMultiplier={0.3 * stats.difficultyFactor} level={stats.level} />
      
      {/* AŞAMA 5.3: Quantum Echo Ripple Effect */}
      {echoPoint && (
        <div 
          className="absolute w-2 h-2 rounded-full border-2 border-purple-400/80 animate-[ping_0.6s_ease-out_infinite] z-[1000] pointer-events-none"
          style={{ left: echoPoint.x, top: echoPoint.y, transform: 'translate(-50%, -50%)' }}
        />
      )}

      {/* AŞAMA 5.3: Chromatic Aberration & Pulse Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-[50] transition-opacity duration-1000"
        style={{ 
          background: `radial-gradient(circle, transparent 20%, rgba(15, 23, 42, ${vignetteIntensity}) 100%)`,
          boxShadow: `inset 0 0 ${gameTime * 20}px rgba(139, 92, 246, ${vignetteIntensity * 0.5})`,
          filter: isShaking ? `contrast(1.2) saturate(1.1) drop-shadow(2px 0px 1px rgba(255,0,0,0.2)) drop-shadow(-2px 0px 1px rgba(0,0,255,0.2))` : 'none',
          transform: `scale(${pulseScale})`
        }}
      />

      <div className={`fixed inset-0 z-[250] bg-black/20 backdrop-blur-lg transition-opacity duration-500 pointer-events-none ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} />

      <div className={`z-40 pt-10 px-8 flex flex-col items-center gap-4 shrink-0 transition-all duration-500 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="bg-black/60 backdrop-blur-3xl border-[3px] border-white/10 px-6 py-2 rounded-[24px] shadow-2xl flex flex-col items-center border-b-[5px] border-b-[#0f172a]">
            <span className="text-[8px] font-[900] text-[#22d3ee] tracking-[0.4em] uppercase opacity-60 mb-1">HAFIZA GEÇİDİ</span>
            <div className="flex gap-2">
                {[0,1,2,3,4].map(i => {
                  const isSel = selected.size > i;
                  const res = results[i];
                  let dotClass = isSel ? 'bg-[#22d3ee] shadow-[0_0_12px_#22d3ee]' : 'bg-white/5 border border-white/10';
                  if (isRevealing && res !== undefined) dotClass = res ? 'bg-[#4ade80] shadow-[0_0_15px_#4ade80] border-white' : 'bg-[#f87171] border-white';
                  return <div key={i} className={`w-3.5 h-3.5 rounded-md border-2 transition-all duration-700 ${dotClass} ${isRevealing && res ? 'animate-pulse' : ''}`} />;
                })}
            </div>
        </div>
      </div>

      <div className={`flex-1 relative z-10 perspective-[2000px] min-h-0 transition-all duration-500 ${isMenuOpen ? 'blur-md brightness-50' : ''} ${isShaking ? 'animate-seismic' : ''}`} style={{ '--shake-intensity': shakeIntensity } as any}>
          {displayWords.map((item, i) => {
            const isSel = selected.has(i);
            const isCorrect = correctIndices.has(i);
            const isGhosting = stats.difficultyFactor > 2.0 && Math.sin(gameTime * 2 + i) > 0.8;
            
            return (
              <div 
                key={i} 
                onClick={(e) => handleWordClick(i, e)}
                style={{ 
                  position: 'absolute', 
                  top: item.pos.t, 
                  left: item.pos.l, 
                  transform: `translate(-50%, -50%) translateZ(${item.zOffset}px)`, 
                  zIndex: isSel ? 200 : 10 + i,
                  willChange: 'transform',
                  padding: '4px',
                  opacity: isGhosting ? 0.3 : 1,
                  filter: isGhosting ? 'blur(2px)' : 'none'
                }}
                className={`transition-all duration-700 ${isRevealing && !isSel ? 'pointer-events-none' : ''}`}
              >
                <Cube3D 
                  width={75} 
                  height={44}
                  depth={24} 
                  label={item.word} 
                  color={item.color.bg} 
                  isSelected={isSel}
                  visualStyle={currentCubeVisualStyle}
                  status={isRevealing && isSel ? (isCorrect ? 'success' : 'fail') : 'idle'}
                  speed={selected.size >= 5 || isRevealing ? 0 : 3.5} 
                  rotationAxis="X" 
                  delay={i * 0.03}
                />
              </div>
            );
          })}
      </div>

      <div className={`px-10 pb-8 z-[100] mt-auto shrink-0 transition-all duration-500 ${isMenuOpen ? 'blur-md pointer-events-none' : 'opacity-100'}`}>
        <Button 
          variant={selected.size >= 5 ? "green" : "cyan"}
          onClick={handleSubmit} 
          disabled={selected.size < 5 || isRevealing} 
          className="w-full !py-5 !text-2xl !rounded-[32px] !border-b-[10px] shadow-2xl active:!border-b-[3px] active:!translate-y-2 transition-all tracking-widest"
        >
          {isRevealing ? 'DOĞRULANIYOR...' : 'GEÇİDİ AÇ'}
        </Button>
      </div>

      <div className="fixed right-4 bottom-4 z-[300]">
        <SideMenu onExit={() => setShowQuitModal(true)} onToggle={setIsMenuOpen} isMinimal={true} expandDirection="up" />
      </div>

      {showQuitModal && <QuitConfirmationModal onConfirm={onExit} onCancel={() => setShowQuitModal(false)} />}
    </div>
  );
};
