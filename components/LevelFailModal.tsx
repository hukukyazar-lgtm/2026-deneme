
import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface LevelFailModalProps {
  hearts: number;
  lastLifeRefillTime: number;
  onRetry: () => void;
  onShop: () => void;
  onExit: () => void;
}

const REFILL_TIME = 10 * 60 * 1000;

export const LevelFailModal: React.FC<LevelFailModalProps> = ({ hearts, lastLifeRefillTime, onRetry, onShop, onExit }) => {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    if (hearts >= 5) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const nextRefill = lastLifeRefillTime + REFILL_TIME;
      const remaining = Math.max(0, nextRefill - now);
      
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [hearts, lastLifeRefillTime]);

  return (
    <div className="absolute inset-0 z-[150] flex flex-col items-center justify-center p-4 bg-[#020617]/99 backdrop-blur-3xl overflow-hidden">
      {/* Dramatik Mağlubiyet Arka Planı */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-[radial-gradient(circle_at_center,_#7f1d1d88_0%,_transparent_60%)] animate-[pulse_4s_infinite] pointer-events-none" />
      
      {/* Glitch Efekti Katmanı */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="z-10 text-center w-full max-w-sm animate-[failPopIn_0.8s_cubic-bezier(0.34,1.56,0.64,1)] flex flex-col items-center">
        
        {/* Parçalanmış Bellek Çekirdeği Görseli */}
        <div className="relative mb-8 flex justify-center shrink-0">
            {/* Şiddetli parlama efekti */}
            <div className="absolute inset-[-40px] bg-[#ef4444]/10 blur-[60px] animate-pulse rounded-full" />
            
            <div className="relative">
              {/* Yüzen Parçacıklar */}
              <div className="absolute -top-6 -left-6 w-3 h-3 bg-[#f87171] rounded-sm rotate-45 animate-bounce opacity-40" />
              <div className="absolute top-16 -right-6 w-2 h-2 bg-[#f87171] rounded-full animate-pulse opacity-30" />

              <div className="relative group">
                <div className="text-[100px] drop-shadow-[0_0_30px_#ef4444] animate-[shatterShake_2s_infinite] select-none filter saturate-[1.2]">💔</div>
                <div className="absolute -top-4 -right-4 text-5xl drop-shadow-[0_0_20px_#ef4444] animate-[lightningFlash_1.5s_infinite] opacity-80">⚡</div>
              </div>
            </div>
        </div>

        {/* Mağlubiyet Vurgusu */}
        <div className="space-y-2 mb-4 shrink-0">
          <div className="flex flex-col items-center gap-2">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#f87171] to-transparent rounded-full shadow-[0_0_15px_#f87171] opacity-60" />
            <p className="text-[#f87171] font-[900] tracking-[0.5em] text-[11px] uppercase drop-shadow-[0_0_8px_#f87171]">HAFIZA DAĞILDI</p>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#f87171] to-transparent rounded-full shadow-[0_0_15px_#f87171] opacity-60" />
          </div>
        </div>

        {/* Geçit Durumu */}
        <div className="w-full bg-black/80 border-[4px] border-[#f87171]/10 p-6 rounded-[44px] shadow-3xl mb-6 backdrop-blur-3xl relative overflow-hidden border-b-[12px] border-b-[#450a0a] shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex justify-center gap-3 mb-1">
                {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-9 h-12 rounded-[14px] border-[2px] flex items-center justify-center transition-all duration-1000 relative overflow-hidden
                        ${i < hearts 
                          ? 'bg-gradient-to-b from-[#f87171] to-[#991b1b] border-white/30 scale-105 shadow-[0_8px_16px_rgba(248,113,113,0.3)]' 
                          : 'bg-white/5 border-white/5 opacity-5 scale-90'}`}
                    >
                       <span className={`text-xl drop-shadow-md transition-opacity duration-1000 ${i < hearts ? 'opacity-100' : 'opacity-0'}`}>❤️</span>
                       {i < hearts && <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10" />}
                    </div>
                ))}
            </div>

            {hearts < 5 && countdown && (
              <div className="mt-6 flex flex-col items-center gap-1">
                <div className="px-4 py-1.5 bg-[#f87171]/5 rounded-full border border-[#f87171]/10">
                  <span className="text-[9px] font-[900] text-[#f87171]/60 uppercase tracking-[0.2em] tabular-nums">YENİLEME: {countdown}</span>
                </div>
              </div>
            )}
        </div>

        {/* Karar Butonları */}
        <div className="flex flex-col gap-4 w-full shrink-0">
          {hearts > 0 ? (
            <Button 
              variant="coral" 
              onClick={onRetry} 
              className="w-full !py-6 !text-2xl !rounded-[36px] !border-b-[12px] shadow-[0_20px_40px_rgba(248,113,113,0.4)] active:!border-b-[3px] active:!translate-y-2 transition-all"
            >
              GEÇİDİ ONAR
            </Button>
          ) : (
            <Button 
              variant="amber" 
              onClick={onShop} 
              className="w-full !py-6 !text-2xl !rounded-[36px] !border-b-[12px] shadow-[0_20px_40px_rgba(251,191,36,0.4)] active:!border-b-[3px] active:!translate-y-2 transition-all"
            >
              HAK SATIN AL
            </Button>
          )}
          
          <button 
            onClick={onExit}
            className="group py-4 flex flex-col items-center gap-2 transition-all active:scale-95"
          >
            <span className="text-white/50 group-hover:text-white font-[900] uppercase text-[11px] tracking-[0.3em] transition-all">MENÜYE DÖN</span>
            <div className="w-8 h-0.5 bg-white/10 rounded-full group-hover:w-20 group-hover:bg-white/40 transition-all duration-700" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes failPopIn {
          0% { transform: scale(0.9); opacity: 0; filter: blur(20px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes shatterShake {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-1deg) scale(1.01); }
          75% { transform: rotate(1deg) scale(0.99); }
        }
        @keyframes lightningFlash {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};
