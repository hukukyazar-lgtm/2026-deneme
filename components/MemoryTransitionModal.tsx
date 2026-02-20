
import React from 'react';
import { Button } from './Button';
import { Cube3D } from './Cube3D';

interface MemoryTransitionModalProps {
  onConfirm: () => void;
  onExit?: () => void;
}

export const MemoryTransitionModal: React.FC<MemoryTransitionModalProps> = ({ onConfirm, onExit }) => {
  return (
    <div className="absolute inset-0 z-[500] flex items-center justify-center p-8 bg-[#020617]/95 backdrop-blur-3xl animate-[fadeIn_0.5s_ease-out]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.15)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="w-full max-w-sm flex flex-col items-center text-center z-10">
        {/* Odaklanma İkonu */}
        <div className="mb-14 relative">
          <div className="absolute inset-[-40px] bg-[#22d3ee]/20 blur-[60px] animate-pulse rounded-full" />
          <div className="relative transform hover:scale-110 transition-transform duration-700">
            <Cube3D 
              size={140} 
              color="#22d3ee" 
              speed={25} 
              isGlassy={true} 
              rotationAxis="TUMBLE" 
              faceLabels={['L', 'U', 'M', 'I', 'N', 'A']}
            />
          </div>
        </div>

        {/* Ana Metin */}
        <div className="mb-16">
          <h2 className="text-white text-4xl font-[900] tracking-tighter uppercase leading-[1.1] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            5 DOĞRU KELİMENİ <br/>
            <span className="text-[#22d3ee] drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">HATIRLIYOR MUSUN?</span>
          </h2>
        </div>

        {/* Aksiyon */}
        <div className="w-full relative group">
          <div className="absolute inset-0 bg-[#22d3ee]/10 blur-2xl group-hover:bg-[#22d3ee]/20 transition-all rounded-full" />
          <Button 
            variant="cyan" 
            onClick={onConfirm} 
            className="w-full !py-8 !text-3xl !rounded-[44px] !border-b-[14px] !shadow-[0_20px_50px_rgba(34,211,238,0.3)] active:!border-b-[4px] active:!translate-y-2"
          >
            HAZIRIM
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
