
import React, { useState } from 'react';
import { Button } from './Button';
import { SoundManager } from '../managers/SoundManager';

interface ChestModalProps {
  onClose: () => void;
  onReward: (amount: number) => void;
}

export const ChestModal: React.FC<ChestModalProps> = ({ onClose, onReward }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    SoundManager.getInstance().playJackpot();
    setTimeout(() => {
        onReward(250);
    }, 500);
  };

  return (
    <div className="absolute inset-0 z-[400] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
      <div className="w-full max-sm flex flex-col items-center animate-[popIn_0.4s_ease-out] text-center">
        
        <div className="relative mb-12 cursor-pointer group" onClick={handleOpen}>
           <div className={`absolute inset-0 bg-blue-400/20 blur-[80px] rounded-full transition-all duration-1000 ${isOpened ? 'scale-[4] opacity-80' : 'scale-150'}`} />
           
           <div className={`text-[140px] transition-all duration-700 transform drop-shadow-[0_0_30px_rgba(34,211,238,0.4)] ${isOpened ? 'scale-125 -translate-y-10' : 'group-hover:scale-110 active:scale-90'}`}>
              {isOpened ? '🌌' : '🎁'}
           </div>

           {isOpened && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-20 animate-[floatReward_2s_ease-out_infinite]">
                <div className="flex flex-col items-center">
                  <span className="text-7xl drop-shadow-[0_0_30px_#fcd34d]">🪙</span>
                  <div className="text-white font-[900] text-3xl tracking-tighter mt-2">+250</div>
                </div>
              </div>
           )}
        </div>

        <h2 className="text-5xl font-[900] text-white tracking-tighter mb-4 uppercase drop-shadow-[0_5px_0_#1d4ed8]">
           {isOpened ? 'YÜCE KAZANÇ!' : 'GÜNLÜK HEDİYE'}
        </h2>

        <div className={`bg-white/5 border-[5px] border-white/10 backdrop-blur-xl p-8 rounded-[40px] w-full mb-10 transition-all duration-500 shadow-2xl overflow-hidden relative ${isOpened ? 'opacity-100 translate-y-0 scale-105 border-blue-400/40' : 'opacity-60 translate-y-4'}`}>
           <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none" />
           {isOpened ? (
             <div className="space-y-2 relative z-10">
                <p className="text-blue-400 font-[900] uppercase text-[10px] tracking-[0.4em]">ENVANTERE EKLENDİ</p>
                <div className="flex items-center justify-center gap-4">
                   <span className="text-4xl">💰</span>
                   <span className="text-white font-black text-lg uppercase tracking-tight">Lumicoin Cüzdanı</span>
                </div>
             </div>
           ) : (
             <p className="text-white/80 font-black text-xl uppercase tracking-tight leading-tight">SANDIĞI AÇMAK İÇİN<br/>ÜZERİNE DOKUN!</p>
           )}
        </div>

        <Button 
          variant={isOpened ? "amber" : "white"} 
          onClick={onClose} 
          className="w-full !py-7 !text-2xl shadow-2xl"
        >
          {isOpened ? "HARİKA!" : "KAPAT"}
        </Button>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes floatReward {
          0%, 100% { transform: translate(-50%, -20px) scale(1); }
          50% { transform: translate(-50%, -40px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};
