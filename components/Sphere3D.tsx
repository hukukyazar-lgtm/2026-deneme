
import React from 'react';

interface Sphere3DProps {
  size?: number;
  color?: string;
  label?: string;
  isLocked?: boolean;
  isCurrent?: boolean;
  className?: string;
}

export const Sphere3D: React.FC<Sphere3DProps> = ({ 
  size = 72, 
  color = "#22d3ee", 
  label = "", 
  isLocked = false, 
  isCurrent = false,
  className = "" 
}) => {
  const baseColor = isLocked ? "#334155" : color;
  
  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-1000 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Atmosphere Glow */}
      <div 
        className={`absolute inset-[-20%] rounded-full blur-2xl transition-all duration-1000 ${isCurrent ? 'opacity-60 scale-110' : isLocked ? 'opacity-5' : 'opacity-20 scale-100'}`}
        style={{ backgroundColor: isLocked ? 'white' : baseColor }}
      />
      
      {/* Sphere Body */}
      <div 
        className="relative w-full h-full rounded-full border-[2px] border-white/20 overflow-hidden shadow-2xl transition-transform duration-700"
        style={{ 
          background: isLocked 
            ? `radial-gradient(circle at 30% 30%, #475569 0%, #0f172a 100%)`
            : `radial-gradient(circle at 30% 30%, ${baseColor} 0%, #000 100%)`,
          boxShadow: isCurrent ? `0 0 30px ${baseColor}80, inset 0 0 20px rgba(255,255,255,0.2)` : `inset 0 0 15px rgba(255,255,255,0.1)`,
          transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
          filter: isLocked ? 'desaturate(1)' : 'none'
        }}
      >
        {/* Surface Texture Overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        
        {/* Specular Highlight */}
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-gradient-to-br from-white/40 to-transparent rounded-full blur-sm" />
        
        {/* Label Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-white font-[900] select-none pointer-events-none drop-shadow-lg"
            style={{ 
              fontSize: label === "🔒" ? size * 0.5 : size * 0.4,
              opacity: isLocked ? 0.4 : 1
            }}
          >
            {label}
          </span>
        </div>
      </div>
      
      {/* Shadow Casting */}
      <div 
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/40 blur-lg rounded-full"
      />
    </div>
  );
};
