
import React from 'react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  userPhoto?: string | null;
  isSyncing?: boolean;
  onSettings?: () => void;
  onProfile?: () => void;
  onShop?: () => void;
}

const StatBox = ({ icon, value, color, borderColor, topColor, onClick }: { 
  icon: string, 
  value: string | number, 
  color: string, 
  borderColor: string,
  topColor: string,
  onClick?: () => void 
}) => (
  <div 
    onClick={onClick}
    className={`h-14 px-3 flex items-center gap-1.5 transition-all rounded-[22px] border-b-[8px] border-x-[2px] border-t-[2.5px] shadow-lg relative overflow-hidden active:border-b-0 active:translate-y-1 pointer-events-auto shrink-0 ${onClick ? 'cursor-pointer' : ''}`}
    style={{ 
      backgroundColor: color, 
      borderColor: borderColor,
      borderTopColor: topColor
    }}
  >
    <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 pointer-events-none" />
    <span className="text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10">{icon}</span>
    <span className="text-white text-sm font-[900] tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10">
      {value}
    </span>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ stats, userPhoto, isSyncing, onSettings, onProfile, onShop }) => {
  return (
    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none gap-2">
      {/* Profil Butonu (Fotoğraf veya Baykuş) */}
      <div className="relative pointer-events-auto">
        <button 
          onClick={onProfile}
          className="w-14 h-14 bg-[#818cf8] border-b-[8px] border-x-[2px] border-t-[2.5px] border-[#4f46e5] border-t-[#e0e7ff] rounded-[22px] flex items-center justify-center active:border-b-0 active:translate-y-1 transition-all group shrink-0 relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 pointer-events-none" />
          {userPhoto ? (
            <img src={userPhoto} className="w-full h-full object-cover relative z-10" alt="Profile" />
          ) : (
            <span className="text-3xl group-hover:scale-110 transition-transform relative z-10">🦉</span>
          )}
        </button>
        
        {/* Sync Indicator */}
        {isSyncing && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#22d3ee] border-2 border-white rounded-full flex items-center justify-center animate-bounce shadow-lg z-20">
            <span className="text-[10px]">☁️</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pointer-events-auto">
        <StatBox icon="⭐" value={stats.stars} color="#22d3ee" borderColor="#0891b2" topColor="#cffafe" />
        <StatBox icon="❤️" value={stats.hearts} color="#f87171" borderColor="#dc2626" topColor="#fee2e2" />
        <StatBox icon="🪙" value={stats.coins.toLocaleString()} color="#fbbf24" borderColor="#d97706" topColor="#fef3c7" onClick={onShop} />
      </div>

      <button 
        onClick={onSettings}
        className="w-14 h-14 bg-[#1e293b] border-b-[8px] border-x-[2px] border-t-[2.5px] border-[#0f172a] border-t-white/10 rounded-[22px] flex items-center justify-center pointer-events-auto active:border-b-0 active:translate-y-1 transition-all shrink-0 relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 pointer-events-none" />
        <svg xmlns="http://www.w3.org/2000/swap" className="w-7 h-7 text-[#22d3ee] relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
    </div>
  );
};
