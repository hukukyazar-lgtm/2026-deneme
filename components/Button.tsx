
import React from 'react';
import { SoundManager } from '../managers/SoundManager';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'cyan' | 'indigo' | 'pink' | 'amber' | 'green' | 'coral' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'cyan', 
  className = '',
  size = 'md',
  disabled = false
}) => {
  const handleInternalClick = () => {
    if (!disabled) {
      SoundManager.getInstance().playClick();
      onClick();
    }
  };

  const baseStyles = "btn-spline relative font-[900] uppercase tracking-tighter rounded-[28px] flex items-center justify-center border-b-[8px] border-x-[2px] border-t-[2.5px] overflow-hidden select-none active:border-b-[2px] active:translate-y-[6px]";
  
  const variants = {
    cyan: "bg-[#22d3ee] text-white border-[#0891b2] border-t-[#cffafe] shadow-[0_20px_40px_rgba(34,211,238,0.4)]",
    indigo: "bg-[#818cf8] text-white border-[#4f46e5] border-t-[#e0e7ff] shadow-[0_20px_40px_rgba(129,140,248,0.3)]",
    pink: "bg-[#f472b6] text-white border-[#db2777] border-t-[#fce7f3] shadow-[0_20px_40px_rgba(244,114,182,0.3)]",
    amber: "bg-[#fbbf24] text-[#78350f] border-[#d97706] border-t-[#fef3c7] shadow-[0_20px_40px_rgba(251,191,36,0.35)]",
    green: "bg-[#4ade80] text-white border-[#16a34a] border-t-[#dcfce7] shadow-[0_20px_40px_rgba(74,222,128,0.3)]",
    coral: "bg-[#f87171] text-white border-[#dc2626] border-t-[#fee2e2] shadow-[0_20px_40px_rgba(248,113,113,0.3)]",
    white: "bg-white text-[#0f172a] border-[#cbd5e1] border-t-[#f8fafc] shadow-[0_20px_40px_rgba(255,255,255,0.2)]"
  };

  const sizes = {
    sm: "px-5 py-2 text-xs",
    md: "px-8 py-4 text-xl",
    lg: "px-10 py-5 text-2xl"
  };

  return (
    <button 
      onClick={handleInternalClick} 
      disabled={disabled}
      className={`
        ${baseStyles} 
        ${variants[variant as keyof typeof variants] || variants.cyan} 
        ${sizes[size]} 
        ${disabled ? 'opacity-40 grayscale cursor-not-allowed border-b-[4px] translate-y-[4px]' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="w-[40%] h-[200%] bg-white/30 blur-2xl absolute -top-[50%] -left-[100%] rotate-[25deg] animate-[shimmer_2s_infinite_linear]" />
      </div>
      <span className="relative z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] tracking-tight">
        {children}
      </span>
      <div className="absolute inset-0 border border-white/20 rounded-[28px] pointer-events-none" />
    </button>
  );
};
