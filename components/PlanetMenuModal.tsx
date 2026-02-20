
import React, { useEffect, useRef, useMemo } from 'react';
import { Cube3D } from './Cube3D';
import { Sphere3D } from './Sphere3D';
import { WordDatabase } from '../lib/wordDatabase';

interface PlanetMenuModalProps {
  onClose: () => void;
  currentLevel: number;
}

export const PlanetMenuModal: React.FC<PlanetMenuModalProps> = ({ onClose, currentLevel }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Gezegen listesini doğrudan CSV verisinden çek
  const planets = useMemo(() => {
    const csvPlanets = WordDatabase.getAllPlanets();
    return csvPlanets.map((p, i) => {
      const paletteColors = ['#818cf8', '#f472b6', '#22d3ee', '#fbbf24', '#4ade80'];
      const planetColor = p.id === 100 || p.id === 21 ? '#fbbf24' : paletteColors[i % paletteColors.length];
      return {
        ...p,
        color: planetColor
      };
    });
  }, []);

  const sortedPlanets = [...planets].reverse();
  const activePlanetId = Math.ceil(currentLevel / 6);

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeElement = document.getElementById(`planet-${activePlanetId}`);
      if (activeElement) activeElement.scrollIntoView({ behavior: 'auto', block: 'center' });
    }, 100);
    return () => clearTimeout(timer);
  }, [activePlanetId]);

  const scrollToTop = () => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' });

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] overflow-hidden relative font-montserrat">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#22d3ee]/10 to-transparent pointer-events-none z-0" />

      {/* Kapatma Butonu */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-white/5 backdrop-blur-xl border-[3.5px] border-white/20 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all z-[120]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-6 h-6">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="pt-20 pb-8 px-8 text-center shrink-0 z-10">
        <h1 className="text-6xl font-[900] text-white tracking-tighter drop-shadow-[0_4px_0_#0f172a] uppercase">
          HARİTA
        </h1>
      </div>

      {/* Navigasyon Okları */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-[120]">
        <button onClick={scrollToTop} className="w-14 h-14 bg-[#22d3ee] border-b-[8px] border-x-[1.5px] border-t-[2px] border-[#0891b2] border-t-white/30 rounded-2xl flex items-center justify-center shadow-2xl active:translate-y-1 active:border-b-0 transition-all group">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-7 h-7 group-hover:-translate-y-1 transition-transform"><path d="M18 15l-6-6-6 6" /></svg>
        </button>
        <button onClick={scrollToBottom} className="w-14 h-14 bg-[#f87171] border-b-[8px] border-x-[1.5px] border-t-[2px] border-[#dc2626] border-t-white/30 rounded-2xl flex items-center justify-center shadow-2xl active:translate-y-1 active:border-b-0 transition-all group">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-7 h-7 group-hover:translate-y-1 transition-transform"><path d="M6 9l6 6 6-6" /></svg>
        </button>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-16 custom-scrollbar pb-60 pt-6 relative z-10">
        {sortedPlanets.map((planet) => {
          const isCompleted = currentLevel > planet.id * 6;
          const isCurrent = !isCompleted && currentLevel > (planet.id - 1) * 6;
          // Değişiklik: Sadece ID 100 küp olarak kalsın, ID 21 küre olsun.
          const isLumina = planet.id === 100;

          return (
            <div key={planet.id} id={`planet-${planet.id}`} className="relative w-full flex flex-col items-center transition-all duration-700">
              
              <div 
                className={`w-full bg-[#1e293b] border-b-[12px] border-x-[2px] border-t-[2.5px] border-[#0f172a] border-t-white/10 rounded-[48px] p-8 shadow-2xl relative transition-all flex flex-col items-center ${isCurrent ? 'animate-[pulse_4s_infinite]' : ''}`}
                style={{ 
                    borderColor: isCurrent ? planet.color : (isCompleted ? '#4ade80' : 'rgba(255,255,255,0.1)'), 
                    borderBottomColor: isCurrent ? planet.color : (isCompleted ? '#16a34a' : '#0f172a'),
                    boxShadow: isCurrent ? `0 20px 50px ${planet.color}33` : 'none'
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className={`mb-6 transition-all duration-1000 ${isCurrent ? 'scale-110' : 'scale-100'}`}>
                        {isLumina ? (
                          <Cube3D 
                            size={90} 
                            color={planet.color} 
                            speed={2} 
                            label={planet.id.toString()}
                            isGlassy={true}
                            rotationAxis="TUMBLE"
                          />
                        ) : (
                          <Sphere3D 
                            size={72} 
                            color={planet.color} 
                            label={planet.id.toString()} 
                            isLocked={false} 
                            isCurrent={isCurrent}
                          />
                        )}
                    </div>

                    <h2 className="text-2xl font-[900] tracking-tighter uppercase drop-shadow-2xl mb-4 text-white">
                      {planet.name}
                    </h2>

                    {isCompleted ? (
                        <div className="px-5 py-2 bg-[#4ade80] border border-white/20 rounded-2xl shadow-lg border-b-4 border-b-[#16a34a]">
                            <span className="text-white font-[900] text-[9px] uppercase tracking-[0.3em]">TAMAMLANDI</span>
                        </div>
                    ) : isCurrent ? (
                        <div className="px-5 py-2 bg-[#22d3ee] border border-white/20 rounded-2xl shadow-xl border-b-4 border-b-[#0891b2]">
                            <span className="text-white font-[900] text-[9px] uppercase tracking-[0.3em]">ŞİMDİKİ DURAK</span>
                        </div>
                    ) : (
                        <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-2xl border-b-4 border-b-black">
                            <span className="text-white/60 font-[900] text-[9px] uppercase tracking-[0.4em]">KEŞFEDİLMEYİ BEKLİYOR</span>
                        </div>
                    )}
                </div>
              </div>
              
              {planet.id !== 1 && (
                <div className="flex flex-col items-center gap-3 mt-4 opacity-20">
                    <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-[#4ade80]' : 'bg-white'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-[#4ade80]' : 'bg-white'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
