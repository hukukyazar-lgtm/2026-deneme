import React, { useMemo, useState } from 'react';
import { Cube3D } from './Cube3D';

interface CollectionModalProps {
  level: number;
  onClose: () => void;
}

const BASE_NAMES = ["DÜNYA", "MARS", "VENÜS", "MERKÜR", "JÜPİTER", "SATÜRN", "URANÜS", "NEPTÜN", "PLÜTON", "LUMINA"];
const CARD_IMAGES = [
  "1614730321146-b6fa6a46bc46", 
  "1614728894747-a83421e2b9c9", 
  "1614732414444-096e5f1122d5", 
  "1534796636912-3b95b3ab5986",
  "1446776811953-b23d57bd21aa",
  "1451187580459-43490279c0fa",
  "1446941611752-94270ba21bf6"
];

const rarities = [
  { label: "YAYGIN", color: "#94a3b8", gradient: "from-[#94a3b8] to-[#1e293b]", shadow: "rgba(148, 163, 184, 0.3)" },
  { label: "NADİR", color: "#22d3ee", gradient: "from-[#22d3ee] to-[#0891b2]", shadow: "rgba(34, 211, 238, 0.4)" },
  { label: "EPİK", color: "#f472b6", gradient: "from-[#f472b6] to-[#831843]", shadow: "rgba(244, 114, 182, 0.4)" },
  { label: "EFSANEVİ", color: "#fbbf24", gradient: "from-[#fbbf24] to-[#78350f]", shadow: "rgba(251, 191, 36, 0.5)" }
];

export const CollectionModal: React.FC<CollectionModalProps> = ({ level, onClose }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const currentPlanetId = Math.ceil(level / 6);

  const inventory = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const id = i + 1;
      const planetName = id === 100 ? "LUMINA" : `${BASE_NAMES[i % BASE_NAMES.length]}-${Math.floor(i / 10) + 1}`;
      const imageId = CARD_IMAGES[i % CARD_IMAGES.length];
      const isOwned = currentPlanetId >= id;
      
      let rarityIdx = 0;
      if (id === 100) rarityIdx = 3;
      else if (id % 10 === 0) rarityIdx = 2;
      else if (id % 5 === 0) rarityIdx = 1;

      return {
        id,
        name: planetName,
        rarity: rarities[rarityIdx],
        image: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=400`,
        owned: isOwned,
        galaxy: Math.floor(i / 10) + 1
      };
    });
  }, [currentPlanetId]);

  const galaxies = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const ownedCount = inventory.filter(c => c.owned).length;

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

      <div className="pt-24 pb-4 px-8 text-center shrink-0 z-20">
        <h1 className="text-5xl font-[900] text-white tracking-tighter drop-shadow-[0_4px_0_#0f172a] uppercase">
          ALBÜM
        </h1>
        
        <div className="mt-6 bg-[#1e293b]/60 border-[4px] border-white/10 backdrop-blur-3xl rounded-[36px] p-5 flex justify-between items-center shadow-2xl relative border-b-[8px] border-b-[#0f172a]">
           <div className="flex flex-col items-start">
              <span className="text-[9px] font-[900] text-[#f472b6] tracking-[0.4em] uppercase mb-1">KOLEKSİYON TAMAMLANMA</span>
              <div className="flex items-center gap-2">
                 <span className="text-2xl font-[900] text-white tracking-tighter">{ownedCount}</span>
                 <span className="text-white/20 font-[900] text-lg">/ 100</span>
              </div>
           </div>
           <div className="h-12 w-12 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#f472b6]/20 to-transparent animate-pulse" />
              <span className="text-2xl drop-shadow-lg z-10">🎴</span>
           </div>
        </div>
      </div>

      <div className="flex gap-3 px-8 pb-6 overflow-x-auto custom-scrollbar shrink-0 z-20">
         {rarities.map((r, i) => (
           <button 
             key={i}
             onClick={() => setActiveFilter(activeFilter === r.label ? null : r.label)}
             className={`px-6 py-3 rounded-2xl border-[3px] font-[900] text-[10px] tracking-widest uppercase transition-all whitespace-nowrap active:scale-95 ${activeFilter === r.label ? 'bg-white text-[#0f172a] border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-white/40 border-white/5'}`}
           >
             {r.label}
           </button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar z-10 pb-20">
        {galaxies.map((galaxyNum) => {
          const galaxyCards = inventory.filter(c => c.galaxy === galaxyNum && (!activeFilter || c.rarity.label === activeFilter));
          if (galaxyCards.length === 0) return null;

          return (
            <div key={galaxyNum} className="mb-12">
               <div className="px-8 mb-4 flex justify-between items-end">
                  <h3 className="text-white/40 font-[900] text-[11px] tracking-[0.6em] uppercase">GALAKSİ #{galaxyNum}</h3>
                  <span className="text-[9px] font-[900] text-white/20 uppercase">KAYDIR ➔</span>
               </div>
               
               <div className="flex gap-6 overflow-x-auto px-8 py-4 snap-x custom-scrollbar perspective-[1000px]">
                  {galaxyCards.map((card) => (
                    <div 
                      key={card.id} 
                      className={`relative flex-shrink-0 w-48 aspect-[3/4.8] rounded-[44px] border-[5px] overflow-hidden transition-all duration-500 snap-center shadow-2xl border-b-[10px] ${card.owned ? 'scale-100' : 'opacity-20 grayscale scale-90'}`}
                      style={{ 
                          borderColor: card.owned ? card.rarity.color : 'rgba(255,255,255,0.05)',
                          borderBottomColor: card.owned ? card.rarity.color : '#0f172a',
                          boxShadow: card.owned ? `0 20px 40px ${card.rarity.shadow}` : 'none'
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.rarity.gradient} opacity-40`} />
                      
                      {card.owned && (
                        <>
                          <img src={card.image} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-110" alt="" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                        </>
                      )}

                      <div className="absolute inset-0 p-5 flex flex-col items-center justify-between z-10 text-center">
                         <div className="w-full flex justify-between">
                            <span className="text-[9px] font-[900] bg-black/60 px-3 py-1 rounded-xl text-white/80 border border-white/10 uppercase">#{card.id}</span>
                            {card.owned && card.rarity.label === 'EFSANEVİ' && <span className="text-xl animate-bounce">👑</span>}
                         </div>

                         <div className="w-20 h-20 flex items-center justify-center relative group">
                            <Cube3D 
                                size={60} 
                                color={card.owned ? card.rarity.color : '#475569'} 
                                speed={card.owned ? 5 : 0} 
                                label={card.owned ? "" : "?"}
                                isGlassy={true}
                                opacity={card.owned ? 1 : 0.2}
                            />
                         </div>

                         <div className="w-full">
                            <h4 className="text-white font-[900] text-[16px] tracking-tighter uppercase truncate mb-1">{card.owned ? card.name : '???'}</h4>
                            <div className="text-[8px] font-[900] uppercase tracking-[0.3em]" style={{ color: card.rarity.color }}>{card.rarity.label}</div>
                         </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};