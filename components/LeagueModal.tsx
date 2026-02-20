
import React, { useState } from 'react';

type Tab = 'ranking' | 'stats';

interface LeagueModalProps {
  onClose?: () => void;
}

export const LeagueModal: React.FC<LeagueModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('ranking');

  const leaderBoard = [
    { name: "USTA KAŞİF", score: 15420, rank: 1, avatar: "👨‍🚀", color: "#fbbf24" },
    { name: "GEÇİT REHBERİ", score: 14200, rank: 2, avatar: "🛸", color: "#94a3b8" },
    { name: "BULUT GEZGİNİ", score: 12850, rank: 3, avatar: "☄️", color: "#f87171" },
    { name: "ERD (SİZ)", score: 2063, rank: 142, avatar: "👾", isUser: true },
    { name: "NOVAX", score: 9500, rank: 4, avatar: "🪐" },
    { name: "DÜNYA HAKİMİ", score: 8700, rank: 5, avatar: "🛰️" },
  ];

  const userStats = [
    { label: "KRİSTALLER", value: "482", icon: "💎", color: "from-[#22d3ee] to-[#0891b2]", accent: "#22d3ee" },
    { label: "ZAFER %", value: "%78", icon: "🎯", color: "from-[#4ade80] to-[#16a34a]", accent: "#4ade80" },
    { label: "REKOR", value: "3,150", icon: "⚡", color: "from-[#fbbf24] to-[#d97706]", accent: "#fbbf24" },
    { label: "DÜNYA", value: "4/16", icon: "🌍", color: "from-[#818cf8] to-[#4f46e5]", accent: "#818cf8" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] overflow-hidden relative">
      {/* Kapatma Butonu */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-white/5 backdrop-blur-2xl border-[3.5px] border-white/20 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all z-[110]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-6 h-6">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Header */}
      <div className="pt-16 pb-6 px-8 text-center bg-gradient-to-b from-[#22d3ee]/10 to-transparent">
        <h1 className="text-4xl font-[900] text-white tracking-tighter drop-shadow-[0_4px_0_#0f172a] uppercase">
          EBEDİ LİG
        </h1>
      </div>

      {/* Tab Switcher */}
      <div className="px-6 mb-8 flex gap-3">
        {['ranking', 'stats'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`flex-1 h-14 rounded-[22px] border-b-[6px] font-[900] text-[10px] tracking-[0.2em] transition-all active:translate-y-1 active:border-b-0 uppercase ${
              activeTab === tab 
              ? 'bg-[#818cf8] border-[#4f46e5] text-white shadow-[0_8px_20px_rgba(129,140,248,0.3)]' 
              : 'bg-white/5 border-white/10 text-white/30'
            }`}
          >
            {tab === 'ranking' ? 'SIRALAMA' : 'İSTATİSTİK'}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-t-[48px] border-t-[4px] border-white/10 p-6 flex flex-col shadow-inner overflow-hidden">
        
        {activeTab === 'ranking' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Podium */}
            <div className="flex items-end justify-center gap-4 mb-10 h-40 shrink-0">
               <div className="flex flex-col items-center">
                  <div className="text-3xl mb-1 opacity-50">🛸</div>
                  <div className="w-16 h-16 bg-[#94a3b8]/20 border-[4px] border-[#94a3b8] rounded-[22px] flex items-center justify-center shadow-xl backdrop-blur-xl">
                     <span className="text-white font-[900] text-2xl">2</span>
                  </div>
               </div>
               <div className="flex flex-col items-center -translate-y-4">
                  <div className="relative mb-2">
                    <span className="text-4xl drop-shadow-[0_0_15px_#fbbf24]">👑</span>
                  </div>
                  <div className="w-20 h-28 bg-[#fbbf24]/20 border-[5px] border-[#fbbf24] rounded-[28px] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.4)] backdrop-blur-xl">
                     <span className="text-[#fbbf24] font-[900] text-5xl">1</span>
                  </div>
               </div>
               <div className="flex flex-col items-center">
                  <div className="text-2xl mb-1 opacity-50">☄️</div>
                  <div className="w-16 h-14 bg-[#f87171]/20 border-[4px] border-[#f87171] rounded-[22px] flex items-center justify-center shadow-xl backdrop-blur-xl">
                     <span className="text-white font-[900] text-2xl">3</span>
                  </div>
               </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar pb-10">
               {leaderBoard.slice(3).map((player, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-5 p-5 rounded-[32px] border-[3px] transition-all duration-300 ${
                      player.isUser 
                      ? 'bg-[#22d3ee]/20 border-[#22d3ee] scale-[1.02] shadow-2xl z-10' 
                      : 'bg-[#1e293b]/40 border-white/5'
                    }`}
                  >
                     <span className={`font-[900] text-[10px] w-8 text-center ${player.isUser ? 'text-[#22d3ee]' : 'text-white/20'}`}>#{player.rank}</span>
                     <div className="w-14 h-14 bg-white/5 rounded-[20px] flex items-center justify-center border border-white/10 shadow-inner">
                        <span className="text-2xl">{player.avatar}</span>
                     </div>
                     <div className="flex-1">
                        <div className={`font-[900] text-lg uppercase tracking-tighter ${player.isUser ? 'text-white' : 'text-white/80'}`}>{player.name}</div>
                        <div className="text-[9px] text-white/30 font-[900] uppercase tracking-[0.3em] mt-1">{player.score.toLocaleString()} PUAN</div>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar pb-10">
            <div className="grid grid-cols-2 gap-4">
               {userStats.map((stat, i) => (
                 <div key={i} className={`p-6 rounded-[36px] bg-gradient-to-br ${stat.color} border-t-[5px] border-white/20 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group active:scale-95 transition-transform`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
                    <div className="mb-3 drop-shadow-md text-4xl group-hover:scale-125 transition-transform duration-500">
                       {stat.icon}
                    </div>
                    <span className="text-[10px] font-[900] text-white/70 uppercase tracking-[0.2em] mb-1">{stat.label}</span>
                    <span className="text-3xl font-[900] text-white tracking-tighter drop-shadow-lg">{stat.value}</span>
                 </div>
               ))}
            </div>

            <div className="bg-[#1e293b]/40 border-[3px] border-white/10 rounded-[40px] p-8 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#22d3ee]/5 to-transparent pointer-events-none" />
                <div className="flex justify-between items-center mb-5 relative z-10">
                  <span className="text-[#22d3ee] font-[900] text-[10px] uppercase tracking-[0.5em]">GÜNCEL TERFİ</span>
                  <span className="text-white font-[900] text-[10px] opacity-40 uppercase">SIRADAKİ: ELİT LİG</span>
                </div>
                <div className="w-full h-5 bg-black/40 rounded-full border border-white/10 p-1 relative overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-[#22d3ee] to-[#818cf8] rounded-full shadow-[0_0_15px_#22d3ee] w-[64%] transition-all duration-1000" />
                </div>
                <div className="mt-4 flex justify-between relative z-10">
                   <span className="text-white font-[900] text-xs">LV. 12</span>
                   <span className="text-white font-[900] text-xs opacity-30">LV. 15</span>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
