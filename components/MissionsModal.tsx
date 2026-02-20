
import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import { Button } from './Button';
import { SoundManager } from '../managers/SoundManager';

interface MissionsModalProps {
  onClose?: () => void;
  stats: UserStats;
  onClaimReward: (id: number, reward: number) => void;
}

const MISSIONS_REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

export const MissionsModal: React.FC<MissionsModalProps> = ({ onClose, stats, onClaimReward }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const nextReset = stats.lastMissionsRefresh + MISSIONS_REFRESH_INTERVAL;
      const diff = Math.max(0, nextReset - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [stats.lastMissionsRefresh]);

  // Görev tanımları ve stats'a göre anlık ilerleme hesaplama
  const missionDefinitions = [
    { 
      id: 1, 
      title: "3 GEÇİT TAMAMLA", 
      progress: Math.floor((stats.level - 1) / 6), 
      total: 3, 
      reward: 250, 
      color: "#22d3ee", 
      icon: "🛰️" 
    },
    { 
      id: 2, 
      title: "500 COIN BIRIKTIR", 
      progress: stats.coins, 
      total: 500, 
      reward: 100, 
      color: "#fbbf24", 
      icon: "🪙" 
    },
    { 
      id: 3, 
      title: "10 YILDIZ TOPLA", 
      progress: stats.stars, 
      total: 10, 
      reward: 400, 
      color: "#f472b6", 
      icon: "🎯" 
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] overflow-hidden relative font-montserrat">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] opacity-50 pointer-events-none" />

      {onClose && (
        <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 bg-white/5 backdrop-blur-xl border-[3.5px] border-white/20 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all z-[110]">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      )}

      <div className="pt-16 pb-4 px-8 text-center shrink-0">
        <h1 className="text-5xl font-[900] tracking-tighter text-white drop-shadow-[0_4px_0_#0f172a] uppercase">GÖREVLER</h1>
      </div>

      <div className="flex-1 px-6 pb-24 flex flex-col gap-4 overflow-y-auto custom-scrollbar relative z-10">
        {missionDefinitions.map((mission) => {
          const isDone = mission.progress >= mission.total;
          const isClaimed = stats.claimedMissions.includes(mission.id);

          return (
            <div key={mission.id} className="relative group">
              <div className={`w-full border-b-[12px] border-x-[2px] border-t-[2.5px] rounded-[40px] p-6 shadow-2xl relative overflow-hidden transition-all duration-500 ${
                isClaimed 
                ? 'bg-[#0f172a]/80 border-[#1e293b] opacity-60' 
                : isDone 
                ? 'bg-[#1e293b] border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.2)]'
                : 'bg-[#1e293b] border-[#0f172a] border-t-white/10'
              }`}>
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                
                <div className="relative z-10 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-black/20 rounded-2xl flex items-center justify-center text-3xl border border-white/5 ${isDone && !isClaimed ? 'animate-bounce' : ''}`}>
                        {mission.icon}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-white font-black text-lg uppercase tracking-tighter leading-tight mb-1">{mission.title}</h4>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black tracking-widest text-[#fbbf24]">+{mission.reward} 🪙</span>
                        </div>
                      </div>
                    </div>
                    
                    {isClaimed ? (
                      <div className="flex flex-col items-end gap-1">
                        <div className="bg-[#4ade80]/20 px-3 py-1 rounded-xl border border-[#4ade80]/30">
                          <span className="text-[#4ade80] font-black text-[9px] uppercase tracking-widest">TAMAMLANDI</span>
                        </div>
                      </div>
                    ) : isDone ? (
                      <Button 
                        variant="amber" 
                        onClick={() => {
                          SoundManager.getInstance().playCoin();
                          onClaimReward(mission.id, mission.reward);
                        }}
                        className="!py-1 !px-4 !text-[10px] !rounded-xl !border-b-[4px] animate-pulse"
                      >
                        ÖDÜLÜ AL
                      </Button>
                    ) : null}
                  </div>

                  {/* Alt Kısım: İlerleme veya Geri Sayım */}
                  {isClaimed ? (
                    <div className="w-full flex items-center justify-between bg-black/40 rounded-2xl px-4 py-2 border border-white/5 animate-pulse">
                      <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">YENİLENME SÜRESİ</span>
                      <span className="text-[11px] font-black text-amber-400 tabular-nums tracking-wider">{timeLeft}</span>
                    </div>
                  ) : (
                    <div className="flex gap-1.5 h-6">
                      {[...Array(mission.total)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-lg transition-all duration-700 border ${
                            i < mission.progress 
                            ? 'bg-gradient-to-t from-white/30 to-transparent border-white/40 shadow-inner' 
                            : 'bg-black/40 border-white/5'
                          }`}
                          style={{ backgroundColor: i < mission.progress ? mission.color : undefined }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
