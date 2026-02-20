
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { LoginModal } from './LoginModal';
import { auth, logout } from '../lib/firebase.ts';
import { onAuthStateChanged, User } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

interface ProfileModalProps {
  level: number;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ level, onClose }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const currentSystem = Math.ceil(level / 6);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);
  
  const stats = [
    { label: "PUAN", value: "14.2K", icon: "📊", variant: 'indigo' },
    { label: "GEÇİT", value: `${currentSystem}/100`, icon: "🪐", variant: 'cyan' },
    { label: "BAŞARI", value: "8", icon: "🏆", variant: 'amber' },
  ];

  const getRankData = (lvl: number) => {
    const sys = Math.ceil(lvl / 6);
    const titleIdx = Math.floor((sys - 1) / 10);
    const titles = ["GÖZLEMCİ", "KAYITÇI", "ANIMSATICI", "ARŞİVCİ", "MUHAFIZ", "ODAKLAYICI", "KODLAYICI", "GERİÇAĞIRICI", "SIR-KÂŞİFİ", "MUTLAK BELLEK"];
    const colors = ["#94a3b8", "#64748b", "#22d3ee", "#06b6d4", "#818cf8", "#6366f1", "#f472b6", "#d946ef", "#fbbf24", "#ffffff"];
    const safeIdx = Math.min(Math.max(0, titleIdx), titles.length - 1);
    const nextIdx = Math.min(safeIdx + 1, titles.length - 1);
    const progressInTier = ((sys - 1) % 10) + 1;
    return { currentTitle: titles[safeIdx], nextTitle: titles[nextIdx], color: colors[safeIdx], progress: progressInTier, isMax: safeIdx === titles.length - 1 && progressInTier === 10 };
  };

  const rankData = getRankData(level);

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] overflow-hidden relative font-montserrat">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] opacity-60 pointer-events-none" />

      <button onClick={onClose} className="absolute top-4 right-4 w-11 h-11 bg-white/5 backdrop-blur-2xl border-[3px] border-white/20 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all z-[110]">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      <div className="pt-12 pb-2 px-8 text-center shrink-0">
        <h1 className="text-4xl font-[900] tracking-tighter text-white drop-shadow-[0_4px_0_#0f172a] uppercase">PROFİL</h1>
      </div>

      <div className="flex-1 px-5 flex flex-col gap-3 overflow-hidden relative z-10 justify-center">
        <div className="w-full bg-[#1e293b] border-b-[8px] border-x-[1.5px] border-t-[1.5px] border-[#0f172a] border-t-white/10 rounded-[32px] p-4 flex items-center gap-4">
           <div className="relative shrink-0">
             <div className="w-14 h-14 bg-gradient-to-b from-[#818cf8] to-[#4f46e5] border-[3px] border-white rounded-2xl flex items-center justify-center shadow-xl">
               <span className="text-2xl">{user?.photoURL ? <img src={user.photoURL} className="w-full h-full rounded-xl object-cover" alt="" /> : '🦉'}</span>
               <div className="absolute -bottom-1 -right-1 bg-[#fbbf24] border-[2px] border-white rounded-lg px-1.5 py-0.5 flex items-center justify-center">
                  <span className="text-[9px] font-black text-[#78350f]">{level}</span>
               </div>
             </div>
           </div>
           <div className="flex flex-col min-w-0">
             <h2 className="text-white text-lg font-[900] tracking-tighter leading-none mb-1 uppercase truncate">
               {user?.displayName || "LUMINA KAŞİFİ"}
             </h2>
             <span className="text-[8px] font-[900] uppercase tracking-[0.2em]" style={{ color: rankData.color }}>
               {rankData.currentTitle}
             </span>
           </div>
        </div>

        <div className="w-full bg-[#f472b6] border-b-[10px] border-x-[1.5px] border-t-[2px] border-[#db2777] border-t-[#fce7f3] rounded-[32px] p-4 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
           <div className="relative z-10 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-white font-[900] text-[7px] uppercase tracking-[0.4em] mb-0.5 opacity-80">RÜTBE GEÇİDİ</span>
                    <div className="flex items-center gap-1.5">
                       <span className="text-white font-[900] text-lg tracking-tighter">{rankData.currentTitle}</span>
                       {!rankData.isMax && <span className="text-white/40 text-[10px] font-black">➔</span>}
                       {!rankData.isMax && <span className="text-white/60 font-[900] text-xs tracking-tighter">{rankData.nextTitle}</span>}
                    </div>
                 </div>
                 <div className="bg-black/30 px-2.5 py-1 rounded-lg border border-white/10">
                    <span className="text-white font-[900] text-base tracking-tighter">{rankData.progress}<span className="text-[10px] opacity-30 ml-0.5">/10</span></span>
                 </div>
              </div>
              <div className="flex justify-between items-center gap-1 w-full h-6">
                 {[...Array(10)].map((_, i) => (
                   <div key={i} className={`flex-1 h-full rounded-md border-x-[1px] border-t-[1px] border-b-[3px] transition-all duration-500 ${(i + 1) <= rankData.progress ? 'bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.3)] border-b-[#f472b6]/20' : 'bg-black/20 border-white/5 border-b-black/40'}`} />
                 ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className={`relative border-x-[1px] border-t-[1.5px] border-b-[6px] rounded-[24px] py-3 px-1 flex flex-col items-center text-center shadow-lg transition-all overflow-hidden bg-[${stat.variant}]`} style={{ backgroundColor: stat.variant === 'indigo' ? '#818cf8' : stat.variant === 'cyan' ? '#22d3ee' : '#fbbf24', borderBottomColor: stat.variant === 'indigo' ? '#4f46e5' : stat.variant === 'cyan' ? '#0891b2' : '#d97706' }}>
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 pointer-events-none" />
              <span className="text-lg mb-1">{stat.icon}</span>
              <span className="text-[7px] font-[900] text-black/30 uppercase tracking-[0.1em] mb-0.5">{stat.label}</span>
              <span className="text-sm font-[900] text-white tracking-tighter">{stat.value}</span>
            </div>
          ))}
        </div>

        {user ? (
          <button 
            onClick={() => logout()}
            className="w-full py-4 text-white/30 font-[900] text-[10px] uppercase tracking-[0.4em] hover:text-red-400 transition-colors"
          >
            OTURUMU KAPAT
          </button>
        ) : (
          <Button 
            variant="indigo" 
            onClick={() => setShowLogin(true)}
            className="w-full !py-4 !text-lg !rounded-[28px] !border-b-[8px] shadow-xl mt-1"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">👤</span>
              <span className="tracking-tighter">HESABI BAĞLA</span>
            </div>
          </Button>
        )}
      </div>

      <div className="pb-8 text-center shrink-0">
        <span className="text-white/10 font-[900] text-[8px] uppercase tracking-[0.4em]">VERSİYON 1.2.0-GEÇİT</span>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};
