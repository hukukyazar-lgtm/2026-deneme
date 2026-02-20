
import React, { useState } from 'react';
import { GAME_ASSETS } from '../App';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    music: true,
    sound: true,
    hint: true,
    notifications: false
  });

  const Toggle = ({ label, value, onToggle, variant = 'cyan' }: { label: string, value: boolean, onToggle: () => void, variant?: 'cyan' | 'amber' }) => {
    const colors = variant === 'cyan' 
      ? { bg: '#22d3ee', border: '#0891b2', top: '#cffafe' } 
      : { bg: '#fbbf24', border: '#d97706', top: '#fef3c7' };

    return (
      <div className="flex flex-col items-center gap-3 w-full group">
        <span className="text-white text-[10px] font-[900] tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">{label}</span>
        <button 
          onClick={onToggle}
          className={`w-full h-16 bg-[#1e293b]/80 border-b-[8px] border-x-[2px] border-t-[2.5px] border-[#0f172a] border-t-white/10 rounded-[28px] relative overflow-hidden flex items-center shadow-xl active:translate-y-1 active:border-b-0 transition-all backdrop-blur-md`}
        >
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 pointer-events-none" />
          <div 
            className={`absolute h-10 w-[44%] rounded-2xl transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) flex items-center justify-center border-b-[5px] border-x-[1px] border-t-[1px] ${
              value ? `translate-x-[8%] text-white` : 'translate-x-[118%] text-white/20'
            }`}
            style={{ 
              backgroundColor: value ? colors.bg : 'rgba(255,255,255,0.05)',
              borderColor: value ? colors.border : 'rgba(255,255,255,0.1)',
              borderTopColor: value ? colors.top : 'rgba(255,255,255,0.2)'
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 pointer-events-none rounded-t-2xl" />
            <span className="text-[10px] font-[900] uppercase tracking-tighter">
              {value ? 'AÇIK' : 'KAPALI'}
            </span>
          </div>
          <span className={`w-full text-center text-[10px] font-[900] uppercase tracking-tighter transition-all duration-500 ${value ? 'opacity-0 scale-75 translate-x-10' : 'opacity-10 translate-x-[-25%]'}`}>
            AÇIK
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] overflow-hidden relative font-montserrat">
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: `url('${GAME_ASSETS.HUB_BG}')` }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] opacity-50 pointer-events-none" />

      <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 bg-white/5 backdrop-blur-xl border-[3.5px] border-white/20 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all z-[110]">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      <div className="pt-20 pb-8 px-8 text-center shrink-0 z-10">
        <h1 className="text-5xl font-[900] tracking-tighter text-white drop-shadow-[0_4px_0_#0f172a] uppercase">AYARLAR</h1>
      </div>

      <div className="flex-1 px-6 space-y-10 overflow-y-auto custom-scrollbar pb-24 z-10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8">
          <Toggle label="MÜZİK" value={settings.music} onToggle={() => setSettings(s => ({...s, music: !s.music}))} />
          <Toggle label="SES" value={settings.sound} onToggle={() => setSettings(s => ({...s, sound: !s.sound}))} />
        </div>
      </div>
    </div>
  );
};
