
import React from 'react';
import { Button } from './Button';

interface TeamModalProps {
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ onClose }) => {
  const teams = [
    { name: "NEBULA HUNTERS", members: "45/50", level: 12, icon: "☄️", variant: 'indigo' as const },
    { name: "STAR COMMAND", members: "48/50", level: 15, icon: "🚀", variant: 'cyan' as const },
    { name: "COSMOS SQUAD", members: "32/50", level: 8, icon: "🛸", variant: 'amber' as const },
    { name: "NOVA WARRIORS", members: "12/50", level: 4, icon: "⚔️", variant: 'pink' as const }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] overflow-hidden relative">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-white/5 backdrop-blur-2xl border-[3.5px] border-white/20 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all z-[110]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-6 h-6">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="pt-16 pb-8 px-8 text-center bg-gradient-to-b from-[#818cf8]/10 to-transparent">
        <h1 className="text-5xl font-[900] text-white tracking-tighter drop-shadow-[0_4px_0_#1e1b4b] uppercase">
          TAKIMLAR
        </h1>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-6 overflow-hidden">
        {/* Spline Search Pod */}
        <div className="bg-[#1e293b]/60 border-[5px] border-white/10 backdrop-blur-3xl rounded-[44px] p-7 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col gap-5 border-b-[10px] border-b-[#0f172a]">
          <span className="text-[#22d3ee] font-[900] text-[10px] uppercase tracking-[0.6em] text-center">TAKIM KODU</span>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="KOD..." 
              className="flex-1 h-16 bg-black/40 border-[3px] border-white/10 rounded-[24px] px-6 text-xl font-[900] text-white outline-none focus:border-[#22d3ee] transition-all uppercase placeholder:text-white/10 tracking-[0.2em] shadow-inner"
            />
            <button className="w-16 h-16 bg-[#22d3ee] border-b-[8px] border-[#0891b2] rounded-[24px] flex items-center justify-center text-white active:translate-y-1 active:border-b-0 transition-all shadow-xl">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" className="w-8 h-8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        {/* Team Pods List */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-5 pb-40 mt-2">
          {teams.map((team, i) => (
            <div key={i} className="bg-[#1e293b]/40 border-[5px] border-white/5 rounded-[48px] p-6 flex items-center justify-between shadow-2xl transition-all active:scale-95 border-b-[10px] border-b-[#0f172a] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-18 h-18 bg-white/5 rounded-[28px] flex items-center justify-center text-4xl shadow-inner border-[3px] border-white/10 group-hover:scale-110 transition-transform duration-500">
                  {team.icon}
                </div>
                <div>
                  <div className="text-white font-[900] text-xl leading-none uppercase tracking-tighter mb-2">{team.name}</div>
                  <div className="text-[10px] text-white/30 font-[900] uppercase tracking-[0.2em] flex gap-3">
                    <span className="text-[#4ade80]">{team.members} ÜYE</span>
                    <span>LVL {team.level}</span>
                  </div>
                </div>
              </div>
              <button className={`w-14 h-14 rounded-3xl border-b-[8px] flex items-center justify-center text-white shadow-xl active:translate-y-1 active:border-b-0 transition-all ${
                team.variant === 'cyan' ? 'bg-[#22d3ee] border-[#0891b2]' :
                team.variant === 'indigo' ? 'bg-[#818cf8] border-[#4f46e5]' :
                team.variant === 'pink' ? 'bg-[#f472b6] border-[#db2777]' :
                'bg-[#fbbf24] border-[#d97706]'
              }`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" className="w-7 h-7"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
