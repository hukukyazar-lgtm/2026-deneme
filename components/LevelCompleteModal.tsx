
import React, { useEffect, useState, useMemo } from 'react';
import { Button } from './Button';
import { Cube3D } from './Cube3D';
import { Sphere3D } from './Sphere3D';
import { SoundManager } from '../managers/SoundManager';

interface LevelCompleteModalProps {
  level: number;
  coinsEarned: number;
  starsEarned: number;
  onContinue: () => void;
  onMenu: () => void;
}

const BASE_NAMES = ["DÜNYA", "MARS", "VENÜS", "MERKÜR", "JÜPİTER", "SATÜRN", "URANÜS", "NEPTÜN", "PLÜTON", "LUMINA"];
const PALETTE_COLORS = ['#818cf8', '#f472b6', '#22d3ee', '#fbbf24', '#4ade80'];

const SuccessParticles = () => {
  const particles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 3,
    delay: Math.random() * 5,
    duration: Math.random() * 6 + 4,
    color: PALETTE_COLORS[i % PALETTE_COLORS.length],
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute animate-[floatUp_var(--duration)_linear_infinite] opacity-0"
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`, 
            animationDelay: `${p.delay}s`,
            '--duration': `${p.duration}s`
          } as any}
        >
          <div 
            className="rounded-full blur-[1px]" 
            style={{ 
              width: p.size, 
              height: p.size, 
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`
            }} 
          />
        </div>
      ))}
    </div>
  );
};

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({ 
  level, 
  coinsEarned, 
  starsEarned,
  onContinue,
  onMenu
}) => {
  const [visibleStars, setVisibleStars] = useState(0);
  const [displayCoins, setDisplayCoins] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentSystemIndex = Math.floor((level - 1) / 6);
  const nextSystemIndex = currentSystemIndex + 1;
  const isSystemFinalLevel = level % 6 === 0;
  
  const currentSystemName = BASE_NAMES[currentSystemIndex % BASE_NAMES.length];
  const nextSystemName = BASE_NAMES[nextSystemIndex % BASE_NAMES.length];
  const nextSystemColor = PALETTE_COLORS[nextSystemIndex % PALETTE_COLORS.length];
  
  const progressInSystem = ((level - 1) % 6) + 1;

  useEffect(() => {
    setIsLoaded(true);
    SoundManager.getInstance().playJackpot();

    const starTimer = setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        if (count < starsEarned) {
          count++;
          setVisibleStars(count);
          SoundManager.getInstance().playPop();
        } else {
          clearInterval(interval);
        }
      }, 400);
      return () => clearInterval(interval);
    }, 400);

    const coinTimer = setTimeout(() => {
      let start = 0;
      const end = coinsEarned;
      const counter = setInterval(() => {
        start += 15;
        if (start >= end) {
          setDisplayCoins(end);
          clearInterval(counter);
        } else {
          setDisplayCoins(start);
        }
      }, 16);
      return () => clearInterval(counter);
    }, 1000);

    return () => {
      clearTimeout(starTimer);
      clearTimeout(coinTimer);
    };
  }, [starsEarned, coinsEarned]);

  return (
    <div className="absolute inset-0 z-[500] flex flex-col items-center bg-[#020617] overflow-hidden font-montserrat select-none">
      <SuccessParticles />

      <div className={`absolute inset-0 transition-opacity duration-1000 ${isSystemFinalLevel ? 'bg-[radial-gradient(circle_at_50%_40%,_rgba(251,191,36,0.1)_0%,_transparent_60%)]' : 'bg-[radial-gradient(circle_at_50%_40%,_rgba(34,211,238,0.1)_0%,_transparent_60%)]'} pointer-events-none`} />

      <div className={`flex-1 w-full max-w-sm flex flex-col items-center px-6 pt-6 pb-4 z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        <div className="text-center w-full mb-1 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
             <span className="text-[9px] font-[900] text-white tracking-[0.2em] uppercase">GEÇİT ONAYLANDI</span>
          </div>
          <h1 className="text-white text-4xl font-[900] tracking-tighter uppercase leading-none drop-shadow-[0_4px_0_#0f172a]">
            TEBRİKLER
          </h1>
        </div>

        <div className="relative w-full aspect-square max-h-[36vh] perspective-[1500px] mb-3 flex-shrink min-h-0">
           <div 
             onClick={() => setIsFlipped(!isFlipped)}
             className={`relative w-full h-full transition-transform duration-1000 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
             style={{ transformStyle: 'preserve-3d' }}
           >
              <div className="absolute inset-0 backface-hidden rounded-[40px] bg-[#1e293b]/90 border-[5px] border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-3xl p-5 flex flex-col items-center justify-between overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="w-full flex justify-between items-center z-10">
                     <div className="bg-black/60 rounded-xl p-2 border border-white/5">
                        <span className="text-[7px] font-[900] text-white/30 uppercase tracking-widest block mb-0.5">KAZANÇ</span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-[900] text-[#fbbf24]">{displayCoins}</span>
                          <span className="text-xs">🪙</span>
                        </div>
                     </div>
                     <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`text-xl transition-all duration-700 ${visibleStars >= i ? 'scale-110 drop-shadow-[0_0_10px_#fbbf24]' : 'opacity-10 scale-50'}`}>⭐</div>
                        ))}
                     </div>
                  </div>

                  <div className="relative w-32 h-32 flex items-center justify-center">
                      <div className={`absolute inset-0 rounded-full blur-[30px] opacity-30 ${isSystemFinalLevel ? 'bg-[#fbbf24]' : 'bg-[#22d3ee]'}`} />
                      <div className={`relative w-28 h-28 rounded-full bg-[#020617] border-[6px] ${isSystemFinalLevel ? 'border-[#fbbf24]' : 'border-[#22d3ee]'} shadow-xl flex items-center justify-center overflow-hidden`}>
                          <span className="text-white text-6xl font-[900] tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] z-10">
                            {level}
                          </span>
                      </div>
                  </div>

                  <span className="text-white/20 font-[900] text-[8px] uppercase tracking-[0.4em] animate-pulse">KARTI ÇEVİR</span>
              </div>

              <div className="absolute inset-0 backface-hidden rounded-[40px] bg-[#0f172a] border-[5px] border-[#fbbf24] shadow-2xl p-6 flex flex-col items-center justify-between rotate-y-180" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <div className="px-4 py-1.5 bg-[#fbbf24] text-[#713f12] text-[9px] font-[900] rounded-lg uppercase tracking-widest shadow-md">
                    GEÇİT KAŞİFİ
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <div className="w-14 h-14 bg-white/5 border-2 border-white/10 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-3xl">{isSystemFinalLevel ? '🏆' : '🪐'}</span>
                     </div>
                     <h3 className="text-white text-lg font-[900] tracking-tighter uppercase text-center">{currentSystemName} SİSTEMİ</h3>
                  </div>
                  <div className="w-full space-y-1.5">
                     <div className="flex justify-between items-center px-1">
                        <span className="text-[7px] font-[900] text-white/40 tracking-[0.2em] uppercase">BELLEK VERİSİ</span>
                        <span className="text-[9px] font-[900] text-[#fbbf24]">%{Math.round((progressInSystem / 6) * 100)}</span>
                     </div>
                     <div className="w-full h-2 bg-black/60 rounded-full border border-white/5 p-0.5 overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-[#fbbf24] to-[#f472b6] rounded-full transition-all duration-1000 shadow-[0_0_8px_#fbbf24]" 
                          style={{ width: `${(progressInSystem / 6) * 100}%` }}
                        />
                     </div>
                  </div>
              </div>
           </div>
        </div>

        <div className="w-full space-y-3 shrink-0">
          <div className="bg-[#1e293b]/50 border-2 border-white/5 rounded-[32px] p-4 backdrop-blur-3xl shadow-xl flex flex-col items-center gap-3 relative overflow-hidden">
              <div className="flex items-center gap-3 w-full relative z-10">
                 <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                    <Sphere3D size={36} color={nextSystemColor} isCurrent={true} />
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className="text-[8px] font-[900] text-white/30 uppercase tracking-[0.3em]">SIRADAKİ HEDEF</span>
                    <h4 className="text-white text-base font-[900] tracking-tighter uppercase truncate">{nextSystemName} SİSTEMİ</h4>
                 </div>
              </div>

              <div className="w-full flex justify-between items-center px-1 gap-1 relative z-10">
                 {[1, 2, 3, 4, 5, 6].map((port) => {
                    const isPortActive = port <= progressInSystem;
                    return (
                      <div key={port} className="flex-1 flex flex-col items-center gap-1">
                         <div 
                          className={`w-full h-1 rounded-full transition-all duration-700 ${isPortActive ? 'bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]' : 'bg-white/5'}`} 
                         />
                         <div className={`w-1.5 h-1.5 rounded-full transition-all duration-1000 ${isPortActive ? 'bg-[#22d3ee] shadow-[0_0_5px_#22d3ee] scale-110' : 'bg-white/5 scale-75'}`} />
                      </div>
                    );
                 })}
              </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              variant={isSystemFinalLevel ? "amber" : "cyan"} 
              onClick={onContinue}
              className="w-full !py-5 !text-xl !rounded-[28px] !border-b-[10px] !border-x-[3px] !shadow-[0_12px_24px_rgba(0,0,0,0.5)] active:!border-b-[3px] active:!translate-y-2 transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="flex items-center justify-center gap-3 relative z-10">
                 <span>{isSystemFinalLevel ? "SİSTEME ATLA" : "YOLA DEVAM ET"}</span>
                 <span className="text-xl">➔</span>
              </div>
            </Button>

            <button 
              onClick={onMenu}
              className="w-full py-4 flex flex-col items-center gap-2 group transition-all active:scale-95"
            >
              <span className="text-white/40 group-hover:text-white font-[900] uppercase text-[11px] tracking-[0.4em] transition-colors">MENÜYE DÖN</span>
              <div className="w-12 h-0.5 bg-white/10 rounded-full group-hover:w-24 group-hover:bg-white/30 transition-all duration-700" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .transform-style-3d { transform-style: preserve-3d; }
        
        @keyframes floatUp {
          0% { transform: translateY(110vh) scale(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-20vh) scale(1.5) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
