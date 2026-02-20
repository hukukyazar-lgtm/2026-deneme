
import React from 'react';
import { Button } from './Button';

interface ShopModalProps {
  onClose: () => void;
  coins: number;
  onBuyHearts: (cost: number, amount: number, type: 'HEART' | 'FREEZE' | 'REVEAL') => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ coins, onBuyHearts, onClose }) => {
  const shopItems = [
    { id: 'h1', amount: 1, cost: 500, color: '#f87171', icon: '❤️', label: '1 CAN', desc: 'TAKVIYE', variant: 'coral' as const, type: 'HEART' as const },
    { id: 'h5', amount: 5, cost: 2000, color: '#f472b6', icon: '💖', label: 'TAM CAN', desc: 'MAKSIMUM', variant: 'pink' as const, type: 'HEART' as const },
    { id: 'f3', amount: 3, cost: 1200, color: '#22d3ee', icon: '❄️', label: '3 DONDUR', desc: 'ZAMANI DURDUR', variant: 'cyan' as const, type: 'FREEZE' as const },
    { id: 'r3', amount: 3, cost: 1200, color: '#fbbf24', icon: '🎯', label: '3 BAŞ HARF', desc: 'İLK ADIMI GÖR', variant: 'amber' as const, type: 'REVEAL' as const },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] overflow-hidden relative font-montserrat">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] opacity-50 pointer-events-none" />

      <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 bg-white/5 backdrop-blur-xl border-[3.5px] border-white/20 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all z-[110]">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      <div className="pt-16 pb-4 px-8 text-center shrink-0">
        <h1 className="text-5xl font-[900] tracking-tighter text-white drop-shadow-[0_4px_0_#0f172a] uppercase">MARKET</h1>
      </div>

      <div className="flex-1 px-6 pb-24 flex flex-col gap-5 overflow-y-auto custom-scrollbar relative z-10">
        {/* Cüzdan Kartı */}
        <div className="w-full bg-[#1e293b] border-b-[12px] border-x-[2px] border-t-[2.5px] border-[#0f172a] border-t-white/10 rounded-[40px] p-6 shadow-2xl relative overflow-hidden flex items-center justify-between">
           <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
           <div className="flex flex-col">
              <span className="text-[#fbbf24] font-black text-[10px] uppercase tracking-[0.4em] mb-1">CÜZDAN</span>
              <span className="text-white font-black text-3xl tracking-tighter">{coins.toLocaleString()} <span className="text-xs opacity-30">🪙</span></span>
           </div>
           <div className="w-14 h-14 bg-black/20 rounded-2xl flex items-center justify-center text-3xl border border-white/5">🪙</div>
        </div>

        {/* Ürünler */}
        {shopItems.map((item) => (
          <div key={item.id} className="relative w-full group">
             <div className="w-full bg-[#1e293b] border-b-[12px] border-x-[2px] border-t-[2.5px] border-[#0f172a] border-t-white/10 rounded-[36px] p-6 shadow-xl relative overflow-hidden flex items-center justify-between">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-14 h-14 flex items-center justify-center bg-black/20 rounded-2xl border border-white/5 text-3xl">
                     {item.icon}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-white font-black text-xl tracking-tighter uppercase leading-none mb-1">{item.label}</span>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 leading-none" style={{ color: item.color }}>{item.desc}</span>
                   </div>
                </div>

                <Button 
                  variant={item.variant}
                  onClick={() => onBuyHearts(item.cost, item.amount, item.type)}
                  disabled={coins < item.cost}
                  className="!py-3 !px-6 !text-lg !rounded-2xl !border-b-[6px] shadow-lg"
                >
                  {item.cost} 🪙
                </Button>
             </div>
          </div>
        ))}

        {/* Reklam Butonu */}
        <Button 
          variant="indigo" 
          onClick={() => {}}
          className="w-full !py-6 !text-2xl !rounded-[32px] flex items-center justify-center gap-4 border-b-[12px] shadow-2xl mt-4"
        >
          <span className="text-3xl">📺</span>
          ÜCRETSİZ +50
        </Button>
      </div>
    </div>
  );
};
