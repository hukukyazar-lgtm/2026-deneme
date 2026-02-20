
import React from 'react';
import { Button } from './Button';

interface QuitConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const QuitConfirmationModal: React.FC<QuitConfirmationModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-[#020617]/80 backdrop-blur-md">
      <div className="bg-slate-900/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">UYARI!</h2>
        <p className="text-white/60 mb-8 leading-relaxed text-sm">
          Şu an çıkarsan <span className="text-red-400 font-bold">1 Can</span> kaybedeceksin. Ayrılmak istediğine emin misin?
        </p>
        
        <div className="w-full space-y-3">
          <Button 
            variant="white"
            onClick={onCancel}
            className="w-full !py-4 !bg-white !text-indigo-950 font-black"
          >
            OYUNA DEVAM ET
          </Button>
          
          <button 
            onClick={onConfirm}
            className="w-full py-3 text-red-400/60 hover:text-red-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
          >
            EVET, ÇIK VE CAN KAYBET
          </button>
        </div>
      </div>
    </div>
  );
};
