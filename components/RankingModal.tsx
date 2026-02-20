
import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { UserStats } from '../types';
import { LoginModal } from './LoginModal';

type Tab = 'ranking' | 'stats';

interface RankingModalProps {
  onClose?: () => void;
  stats: UserStats;
}

export const RankingModal: React.FC<RankingModalProps> = ({ onClose, stats }) => {
  const [activeTab, setActiveTab] = useState<Tab>('ranking');
  const [showLogin, setShowLogin] = useState(false);

  // Kullanıcı skoru hesaplama (Seviye, Yıldız ve Coin ağırlıklı)
  const userScore = useMemo(() => {
    return (stats.level * 1000) + (stats.stars * 50) + Math.floor(stats.coins / 10);
  }, [stats]);

  // Rütbe Bilgisi (ProfileModal ile tutarlı)
  const rankData = useMemo(() => {
    const sys = Math.ceil(stats.level / 6);
    const titleIdx = Math.floor((sys - 1) / 10);
    const titles = [
      "GÖZLEMCİ", "KAYITÇI", "ANIMSATICI", "ARŞİVCİ", "MUHAFIZ", 
      "ODAKLAYICI", "KODLAYICI", "GERİÇAĞIRICI", "SIR-KÂŞİFİ", "MUTLAK BELLEK"
    ];
    const safeIdx = Math.min(Math.max(0, titleIdx), titles.length - 1);
    const progressInTier = ((sys - 1) % 10) + 1;
    return { title: titles[safeIdx], progress: progressInTier };
  }, [stats.level]);

  // Dinamik Liderlik Tablosu
  const leaderBoard = useMemo(() => [
    { name: "KOSMOS MASTER", score: 45200, rank: 1, avatar: "🛸", color: "#fbbf24", title: "MUTLAK BELLEK" },
    { name: "NEBULA_RUNNER", score: 38400, rank: 2, avatar: "🥈", color: "#94a3b8", title: "SIR-KÂŞİFİ" },
    { name: "ASTRAL_WALKER", score: 32150, rank: 3, avatar: "🥉", color: "#f472b6", title: "GERİÇAĞIRICI" },
    { name: "LUMINA KAŞİFİ (SİZ)", score: userScore, rank: 142, avatar: "👾", isUser: true, title: rankData.title },
    { name: "VOID_FINDER", score: 29500, rank: 4, avatar: "🪐", title: "KODLAYICI" },
    { name: "PORTAL_GUARD", score: 26700, rank: 5, avatar: "🛰️", title: "MUHAFIZ" },
  ], [userScore, rankData.title]);

  // İstatistik Hesaplamaları
  const winRate = useMemo(() => {
    if (stats.performanceHistory.length === 0) return 0;
    const wins = stats.performanceHistory.filter(h => h).length;
    return Math.round((wins / stats.performanceHistory.length) * 100);
  }, [stats.performanceHistory]);

  const statsDisplay = [
    { label: "YILDIZLAR", value: stats.stars, icon: "⭐", color: "from-[#22d3ee] to-[#0891b2]", accent: "#22d3ee" },
    { label: "ZAFER %", value: `%${winRate}`, icon: "🎯", color: "from-[#4ade80] to-[#16a34a]", accent: "#4ade80" },
    { label: "REKOR", value: stats.maxStreak, icon: "⚡", color: "from-[#fbbf24] to-[#d97706]", accent: "#fbbf24" },
    { label: "GEÇİT", value: `${Math.ceil(stats.level / 6)}/100`, icon: "🪐", color: "from-[#818cf8] to-[#4f46e5]", accent: "#818cf8" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] overflow-hidden relative font-montserrat">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] opacity-60 pointer-events-none" />

      {/* Kapatma Butonu */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 bg-white/5 backdrop-blur-2xl border-[3px] border-white/20 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all z-[110]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-5 h-5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Başlık */}
      <div className="pt-12 pb-2 px-8 text-center shrink-0">
        <h1 className="text-4xl font-[900] tracking-tighter text-white drop-shadow-[0_4px_0_#0f172a] uppercase">
          EBEDİ LİG
        </h1>
      </div>

      {/* Tab Switcher */}
      <div className="px-6 mb-4 flex gap-3 shrink-0">
        {(['ranking', 'stats'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 h-12 rounded-[24px] border-b-[8px] border-x-[1.5px] border-t-[1.5px] font-[900] text-[10px] tracking-[0.2em] transition-all active:translate-y-1 active:border-b-0 uppercase relative overflow-hidden ${
              activeTab === tab 
              ? 'bg-[#818cf8] border-[#4f46e5] text-white border-t-white/30 shadow-xl' 
              : 'bg-[#1e293b] border-[#0f172a] text-white/20 border-t-white/5'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 pointer-events-none" />
            {tab === 'ranking' ? 'LİDERLER' : 'BİLGİLER'}
          </button>
        ))}
      </div>

      <div className="flex-1 px-5 pb-24 overflow-y-auto custom-scrollbar flex flex-col gap-3 relative z-10">
        
        {activeTab === 'ranking' ? (
          <>
            {/* 3D PODYUM ALANI */}
            <div className="flex items-end justify-center gap-2 h-44 mb-4 mt-2">
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 mb-2 flex items-center justify-center text-3xl opacity-60">🥈</div>
                <div className="w-full bg-[#94a3b8] border-b-[8px] border-[#475569] border-x-[1.5px] border-t-[1.5px] border-t-white/30 rounded-t-[24px] h-20 flex flex-col items-center justify-center relative shadow-xl overflow-hidden">
                   <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 pointer-events-none" />
                   <span className="text-white text-2xl font-black">2</span>
                </div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-14 h-14 mb-2 flex items-center justify-center text-4xl animate-[levitate_3s_ease-in-out_infinite]">✨</div>
                <div className="w-full bg-[#fbbf24] border-b-[12px] border-[#d97706] border-x-[1.5px] border-t-[2px] border-t-white/40 rounded-t-[28px] h-32 flex flex-col items-center justify-center relative shadow-[0_15px_30px_rgba(251,191,36,0.3)] overflow-hidden">
                   <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 pointer-events-none" />
                   <span className="text-[#713f12] text-4xl font-black">1</span>
                </div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 mb-2 flex items-center justify-center text-3xl opacity-60">🥉</div>
                <div className="w-full bg-[#f472b6] border-b-[6px] border-[#db2777] border-x-[1.5px] border-t-[1.5px] border-t-white/30 rounded-t-[20px] h-16 flex flex-col items-center justify-center relative shadow-xl overflow-hidden">
                   <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 pointer-events-none" />
                   <span className="text-white text-xl font-black">3</span>
                </div>
              </div>
            </div>

            {/* OYUNCU LİSTESİ */}
            <div className="flex flex-col gap-3">
              {leaderBoard.map((player, i) => (
                <div 
                  key={i} 
                  className={`w-full border-b-[8px] border-x-[1.5px] border-t-[1.5px] rounded-[28px] p-4 flex items-center gap-4 relative overflow-hidden shadow-xl transition-all ${
                    player.isUser 
                    ? 'bg-[#22d3ee] border-[#0891b2] border-t-white/40' 
                    : 'bg-[#1e293b] border-[#0f172a] border-t-white/10'
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 pointer-events-none" />
                  <div className="w-8 text-center shrink-0">
                    <span className={`text-base font-black ${player.isUser ? 'text-[#083344]' : 'text-white/20'}`}>#{player.rank}</span>
                  </div>
                  <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center text-2xl border border-white/5 shrink-0 relative">
                    {player.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-black text-sm uppercase tracking-tighter truncate leading-none mb-0.5 ${player.isUser ? 'text-[#083344]' : 'text-white'}`}>
                      {player.name}
                    </h4>
                    <p className={`text-[8px] font-black uppercase tracking-[0.1em] ${player.isUser ? 'text-[#083344]/50' : 'text-white/30'}`}>
                      {player.score.toLocaleString()} PUAN • {player.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 animate-[fadeIn_0.5s_ease-out]">
            
            {/* KİŞİSEL ÖZET */}
            <div className="w-full bg-[#1e293b] border-b-[10px] border-x-[1.5px] border-t-[1.5px] border-[#0f172a] border-t-white/10 rounded-[32px] p-6 shadow-xl relative overflow-hidden text-center">
               <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
               <div className="w-20 h-20 bg-gradient-to-b from-[#22d3ee] to-[#0891b2] border-[4px] border-white rounded-[24px] mx-auto flex items-center justify-center shadow-lg mb-3">
                  <span className="text-4xl">👾</span>
               </div>
               <h3 className="text-white text-2xl font-black tracking-tighter uppercase mb-0.5">LİG REKORU</h3>
               <p className="text-[#22d3ee] font-black text-[10px] uppercase tracking-[0.3em]">{userScore.toLocaleString()} GEÇİT PUANI</p>
            </div>

            {/* RÜTBE GEÇİDİ */}
            <div className="w-full bg-[#f472b6] border-b-[10px] border-x-[1.5px] border-t-[2px] border-[#db2777] border-t-[#fce7f3] rounded-[32px] p-5 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
               
               <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-white font-[900] text-[7px] uppercase tracking-[0.4em] mb-0.5 opacity-80">RÜTBE GEÇİDİ</span>
                    <span className="text-white text-lg font-black tracking-tighter uppercase block">{rankData.title}</span>
                  </div>
                  <div className="bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                    <span className="text-white font-black text-base">{rankData.progress} <span className="text-[10px] opacity-30">/ 10</span></span>
                  </div>
               </div>

               {/* Segmentli 3D Bar */}
               <div className="flex gap-1 h-6">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 h-full rounded-md border-x-[1px] border-t-[1px] border-b-[3px] transition-all duration-500 ${
                        (i + 1) <= rankData.progress 
                        ? 'bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.3)] border-b-[#f472b6]/20' 
                        : 'bg-black/20 border-white/5 border-b-black/40'
                      }`}
                    />
                  ))}
               </div>
            </div>

            {/* İSTATİSTİK GRID */}
            <div className="grid grid-cols-2 gap-3">
               {statsDisplay.map((s, i) => (
                 <div 
                   key={i} 
                   className="p-5 rounded-[24px] border-b-[8px] border-x-[1px] border-t-[1.5px] flex flex-col items-center shadow-lg relative overflow-hidden bg-gradient-to-br"
                   style={{ 
                     backgroundColor: s.accent, 
                     borderBottomColor: 'rgba(0,0,0,0.3)', 
                     borderTopColor: 'rgba(255,255,255,0.4)', 
                     borderColor: 'rgba(0,0,0,0.1)' 
                   }}
                 >
                   <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                   <span className="text-3xl mb-2">{s.icon}</span>
                   <span className="text-[9px] font-black text-black/40 uppercase tracking-widest mb-1">{s.label}</span>
                   <span className="text-2xl font-black text-white tracking-tighter">{s.value}</span>
                 </div>
               ))}
            </div>

            {/* Kaydet Butonu */}
            <Button 
              variant="indigo" 
              onClick={() => setShowLogin(true)} 
              className="w-full !py-5 !text-lg !rounded-[28px] !border-b-[8px] shadow-xl mt-1"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">👤</span>
                <span className="tracking-tighter">SIRALAMAYI BULUTA YEDEKLE</span>
              </div>
            </Button>

          </div>
        )}

      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes levitate {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          display: none;
        }
      `}</style>
    </div>
  );
};
