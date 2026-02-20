
import React, { useMemo } from 'react';

interface Portal3DProps {
  level: number;
  active: boolean;
  difficulty?: number;
}

export const Portal3D: React.FC<Portal3DProps> = ({ level, active, difficulty = 1.0 }) => {
  const isHighDifficulty = difficulty > 1.5;
  const rotationSpeed = useMemo(() => 5 / difficulty, [difficulty]); 
  const glowIntensity = useMemo(() => 30 + (difficulty * 40), [difficulty]);

  const getFontSize = () => {
    const digits = level.toString().length;
    if (digits >= 4) return 'text-[80px]';
    if (digits === 3) return 'text-[110px]';
    if (digits === 2) return 'text-[140px]';
    return 'text-[180px]';
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-all duration-1000 ${active ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}>
      
      {/* Background Aura influenced by DDS */}
      <div 
        className={`absolute w-80 h-80 rounded-full blur-[100px] transition-all duration-500 ${isHighDifficulty ? 'animate-[pulse_0.5s_infinite]' : 'animate-pulse'}`} 
        style={{ 
          backgroundColor: isHighDifficulty ? 'rgba(239, 68, 68, 0.2)' : `rgba(34, 211, 238, ${0.1 * difficulty})`,
          boxShadow: `0 0 ${glowIntensity}px ${isHighDifficulty ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 211, 238, 0.4)'}`
        }} 
      />

      {/* Dynamic Vibration for high DDS */}
      <div 
        className={`relative z-20 select-none pointer-events-none flex items-center justify-center w-full ${isHighDifficulty ? 'animate-[vibrate_0.1s_infinite]' : ''}`}
        style={{ animation: `pureFloat ${rotationSpeed}s infinite ease-in-out` }}
      >
        <div className="relative flex items-center justify-center w-full px-12">
          <span 
            className={`${getFontSize()} font-[900] tracking-tighter leading-none block text-center transition-all duration-500 ${isHighDifficulty ? 'text-red-100' : 'text-white'}`}
            style={{
              textShadow: isHighDifficulty 
                ? `0 0 20px #ef4444, 0 4px 0 #991b1b, 0 20px 60px rgba(0,0,0,0.9)`
                : `0 4px 0 #cbd5e1, 0 10px 0 #94a3b8, 0 20px 0 #64748b, 0 40px 80px rgba(0,0,0,0.8)`
            }}
          >
            {level}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pureFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(${-20 * difficulty}px); }
        }
        @keyframes vibrate {
          0% { transform: translate(0); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
          75% { transform: translate(2px, 2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
};
