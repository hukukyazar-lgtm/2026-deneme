
import React, { memo } from 'react';

export type RotationAxis = 'X' | 'Y' | 'XY' | 'TUMBLE';
export type CubeVisualStyle = 
  | 'GLASS' | 'CRYSTAL' | 'METAL' | 'NEON' | 'GHOST' | 'DARK' | 'PLASMA' 
  | 'CHROME' | 'LAVA' | 'AETHER' | 'VOID' | 'GOLD' | 'ICE' | 'EMERALD' 
  | 'RUBY' | 'OBSIDIAN' | 'MAGMA' | 'CYBER' | 'POISON' | 'PEARL' 
  | 'GALAXY' | 'QUARTZ' | 'HOLOGRAPHIC';

interface Cube3DProps {
  size?: number;
  width?: number; 
  height?: number; 
  depth?: number; 
  className?: string;
  speed?: number;
  opacity?: number;
  label?: string;
  centerLabel?: string; 
  faceLabels?: string[]; 
  isGlassy?: boolean;
  color?: string;
  rotationAxis?: RotationAxis;
  visualStyle?: CubeVisualStyle;
  status?: 'idle' | 'success' | 'fail';
  delay?: number;
  isRevealed?: boolean;
  isSelected?: boolean;
}

export const Cube3D: React.FC<Cube3DProps> = memo(({ 
  size = 32,
  width,
  height,
  depth,
  className = "", 
  speed = 4,
  opacity = 1,
  label = "",
  centerLabel = "",
  faceLabels,
  isGlassy = true,
  color = "rgba(34, 211, 238, 1)",
  rotationAxis = 'XY',
  visualStyle = 'GLASS',
  status = 'idle',
  delay = 0,
  isRevealed = true,
  isSelected = false
}) => {
  const isSuccess = status === 'success';
  const isFail = status === 'fail';
  const mainText = (centerLabel || label);

  const w = width || size;
  const h = height || size;
  const d = depth || size;

  const overlap = 1.5; 

  const getRotationClass = () => {
    if (isSelected || isSuccess || speed === 0) return "";
    switch (rotationAxis) {
      case 'X': return "animate-cube-x";
      case 'Y': return "animate-cube-y";
      case 'XY': return "animate-cube-xy";
      case 'TUMBLE': return "animate-cube-tumble";
      default: return "animate-cube-xy";
    }
  };

  const renderCube = () => {
    let baseColor = color;
    if (isSuccess) baseColor = '#4ade80'; 
    if (isFail) baseColor = '#f87171';

    const faces = [
      { id: 'front', rot: 'rotateY(0deg)', tz: (d / 2), fw: w + overlap, fh: h + overlap },
      { id: 'back', rot: 'rotateY(180deg)', tz: (d / 2), fw: w + overlap, fh: h + overlap },
      { id: 'right', rot: 'rotateY(90deg)', tz: (w / 2), fw: d + overlap, fh: h + overlap },
      { id: 'left', rot: 'rotateY(-90deg)', tz: (w / 2), fw: d + overlap, fh: h + overlap },
      { id: 'top', rot: 'rotateX(90deg)', tz: (h / 2), fw: w + overlap, fh: d + overlap },
      { id: 'bottom', rot: 'rotateX(-90deg)', tz: (h / 2), fw: w + overlap, fh: d + overlap },
    ];

    return (
      <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
        {faces.map((f, i) => {
          const faceText = (faceLabels && faceLabels[i]) ? faceLabels[i] : mainText;
          
          let faceStyles: React.CSSProperties = {
            position: 'absolute',
            width: f.fw, 
            height: f.fh, 
            left: (w - f.fw) / 2, 
            top: (h - f.fh) / 2, 
            transform: `${f.rot} translate3d(0, 0, ${f.tz}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
            borderRadius: Math.min(w, h) * 0.2, 
            transformStyle: 'preserve-3d',
            overflow: 'hidden'
          };

          // Genişletilmiş Materyal Kütüphanesi (23 Çeşit)
          switch(visualStyle) {
            case 'CRYSTAL':
              faceStyles.background = `linear-gradient(135deg, ${baseColor}88 0%, #ffffff88 50%, ${baseColor}88 100%)`;
              faceStyles.border = `4px solid #ffffffaa`;
              faceStyles.boxShadow = `inset 0 0 20px #ffffff44, 0 0 15px ${baseColor}44`;
              faceStyles.backdropFilter = 'blur(12px)';
              break;
            case 'METAL':
              faceStyles.background = `linear-gradient(to bottom right, #ffffff66, #334155, #000000)`;
              faceStyles.border = `5px solid #94a3b8`;
              faceStyles.boxShadow = `inset 0 0 30px #000000aa`;
              break;
            case 'NEON':
              faceStyles.background = `rgba(2, 6, 23, 0.95)`;
              faceStyles.border = `2.5px solid ${baseColor}`;
              faceStyles.boxShadow = `0 0 12px ${baseColor}, 0 0 25px ${baseColor}44, inset 0 0 15px ${baseColor}88, inset 0 0 2px rgba(255,255,255,0.6)`;
              break;
            case 'PLASMA':
              faceStyles.background = `radial-gradient(circle, ${baseColor} 0%, transparent 80%)`;
              faceStyles.border = `2px solid rgba(255,255,255,0.1)`;
              faceStyles.boxShadow = `0 0 30px ${baseColor}aa, inset 0 0 50px ${baseColor}66`;
              faceStyles.backdropFilter = 'blur(5px)';
              break;
            case 'CHROME':
              faceStyles.background = `linear-gradient(160deg, #ffffff 0%, #94a3b8 40%, #0f172a 45%, #ffffff 50%, #1e293b 100%)`;
              faceStyles.border = `1px solid #ffffff`;
              faceStyles.boxShadow = `inset 0 0 10px rgba(0,0,0,0.5)`;
              break;
            case 'LAVA':
              faceStyles.background = `radial-gradient(circle, #f97316 0%, #450a0a 100%)`;
              faceStyles.border = `3px solid #fbbf24`;
              faceStyles.boxShadow = `0 0 20px #f97316, inset 0 0 15px #000000`;
              break;
            case 'AETHER':
              faceStyles.background = `rgba(255,255,255,0.05)`;
              faceStyles.border = `2px solid rgba(255,255,255,0.4)`;
              faceStyles.boxShadow = `0 0 15px rgba(255,255,255,0.2), inset 0 0 20px rgba(255,255,255,0.1)`;
              faceStyles.backdropFilter = 'blur(25px)';
              break;
            case 'VOID':
              faceStyles.background = `#000000`;
              faceStyles.border = `2px solid #a855f7`;
              faceStyles.boxShadow = `inset 0 0 30px #a855f7, 0 0 10px #a855f744`;
              break;
            case 'GOLD':
              faceStyles.background = `linear-gradient(135deg, #fef3c7 0%, #d97706 50%, #78350f 100%)`;
              faceStyles.border = `2px solid #fbbf24`;
              faceStyles.boxShadow = `0 0 15px rgba(251, 191, 36, 0.4), inset 0 0 10px rgba(255,255,255,0.5)`;
              break;
            case 'ICE':
              faceStyles.background = `rgba(186, 230, 253, 0.4)`;
              faceStyles.border = `3px solid #e0f2fe`;
              faceStyles.boxShadow = `0 0 20px #ffffff66, inset 0 0 20px #ffffff33`;
              faceStyles.backdropFilter = 'blur(10px)';
              break;
            case 'EMERALD':
              faceStyles.background = `radial-gradient(circle, #10b981 0%, #064e3b 100%)`;
              faceStyles.border = `2px solid #34d399`;
              faceStyles.boxShadow = `0 0 15px #10b98144, inset 0 0 10px #ffffff22`;
              break;
            case 'RUBY':
              faceStyles.background = `radial-gradient(circle, #ef4444 0%, #7f1d1d 100%)`;
              faceStyles.border = `2px solid #f87171`;
              faceStyles.boxShadow = `0 0 15px #ef444444, inset 0 0 10px #ffffff22`;
              break;
            case 'OBSIDIAN':
              faceStyles.background = `linear-gradient(to bottom right, #1e293b, #0f172a, #000000)`;
              faceStyles.border = `1.5px solid #334155`;
              faceStyles.boxShadow = `inset 0 0 20px #000000aa`;
              break;
            case 'MAGMA':
              faceStyles.background = `radial-gradient(circle at center, #fb923c, #7c2d12 70%, #000 100%)`;
              faceStyles.border = `2px solid #fb923c`;
              faceStyles.boxShadow = `0 0 25px #fb923c88, inset 0 0 10px #000000`;
              break;
            case 'CYBER':
              faceStyles.background = `rgba(15, 23, 42, 0.95)`;
              faceStyles.border = `2px solid #22d3ee`;
              faceStyles.boxShadow = `0 0 10px #22d3ee, inset 0 0 15px #22d3ee44`;
              // Devre yolları efekti (basit)
              faceStyles.backgroundImage = `linear-gradient(90deg, transparent 45%, #22d3ee22 50%, transparent 55%), linear-gradient(0deg, transparent 45%, #22d3ee22 50%, transparent 55%)`;
              faceStyles.backgroundSize = '20px 20px';
              break;
            case 'POISON':
              faceStyles.background = `radial-gradient(circle, #4ade80 0%, #14532d 100%)`;
              faceStyles.border = `2px solid #86efac`;
              faceStyles.boxShadow = `0 0 20px #4ade80, inset 0 0 10px #000000`;
              break;
            case 'PEARL':
              faceStyles.background = `linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)`;
              faceStyles.border = `1px solid rgba(255,255,255,0.8)`;
              faceStyles.boxShadow = `inset 0 0 15px rgba(0,0,0,0.05), 0 0 10px rgba(255,255,255,0.4)`;
              // Sedefli yansıma
              faceStyles.backgroundImage = `linear-gradient(135deg, rgba(255,192,203,0.1), rgba(173,216,230,0.1), rgba(144,238,144,0.1))`;
              break;
            case 'GALAXY':
              faceStyles.background = `radial-gradient(circle, #4c1d95 0%, #1e1b4b 100%)`;
              faceStyles.border = `2px solid #818cf8`;
              faceStyles.boxShadow = `0 0 20px #4c1d95aa, inset 0 0 10px #ffffff11`;
              // Yıldız efekti
              faceStyles.backgroundImage = `radial-gradient(white 1px, transparent 1px)`;
              faceStyles.backgroundSize = '15px 15px';
              break;
            case 'QUARTZ':
              faceStyles.background = `rgba(255, 255, 255, 0.75)`;
              faceStyles.border = `1px solid #ffffff`;
              faceStyles.boxShadow = `inset 0 0 10px rgba(0,0,0,0.05)`;
              faceStyles.backdropFilter = 'blur(6px)';
              break;
            case 'HOLOGRAPHIC':
              faceStyles.background = `linear-gradient(135deg, #f472b688, #818cf888, #22d3ee88, #4ade8088, #fbbf2488)`;
              faceStyles.border = `2px solid rgba(255,255,255,0.5)`;
              faceStyles.boxShadow = `0 0 15px rgba(255,255,255,0.3)`;
              faceStyles.backdropFilter = 'blur(10px)';
              break;
            case 'GHOST':
              faceStyles.background = `rgba(255,255,255,0.05)`;
              faceStyles.border = `1.5px dashed ${baseColor}88`;
              faceStyles.backdropFilter = 'blur(20px)';
              break;
            case 'DARK':
              faceStyles.background = `radial-gradient(circle, #1e1b4b, #020617)`;
              faceStyles.border = `3px solid #000000`;
              faceStyles.boxShadow = `inset 0 0 40px #000000`;
              break;
            default: // GLASS (Standard)
              faceStyles.background = isGlassy ? `linear-gradient(135deg, ${baseColor}66 0%, ${baseColor}11 100%)` : baseColor;
              faceStyles.border = isSelected ? '5px solid #ffffff' : `3.5px solid ${baseColor}`;
              faceStyles.backdropFilter = isGlassy ? 'blur(8px)' : 'none';
              faceStyles.boxShadow = `inset 0 0 15px ${baseColor}44`;
          }

          if (isSelected) {
            faceStyles.borderColor = '#ffffff';
            faceStyles.borderWidth = '6px';
            if (visualStyle === 'NEON' || visualStyle === 'PLASMA' || visualStyle === 'CYBER') {
              faceStyles.boxShadow = `0 0 30px #ffffff, 0 0 60px ${baseColor}aa, inset 0 0 20px #ffffff`;
            }
          }

          return (
            <div key={i} style={faceStyles}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 pointer-events-none opacity-80" />
              
              {faceText && (
                <span 
                  className={`font-[900] select-none transition-all duration-700 uppercase whitespace-nowrap px-2 z-10 text-white
                    ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                  style={{ 
                    fontSize: Math.min(f.fw * 0.8 / (faceText.length || 1), f.fh * 0.7),
                    textShadow: visualStyle === 'NEON' || visualStyle === 'PLASMA' || visualStyle === 'LAVA' || visualStyle === 'MAGMA'
                      ? `0 0 12px ${baseColor}, 0 2px 10px rgba(0,0,0,1)` 
                      : '0 2px 10px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.5)',
                    transform: 'translateZ(12px)',
                    color: visualStyle === 'GHOST' || visualStyle === 'AETHER' ? baseColor : 'white'
                  }}
                >
                  {faceText}
                </span>
              )}

              {isSelected && !isSuccess && !isFail && f.id === 'front' && (
                <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-2xl z-20 animate-bounce">
                  <span className="text-[14px] text-black font-black">✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const isDrifting = !isSuccess && !isFail && !isSelected && speed > 0 && rotationAxis !== 'X' && rotationAxis !== 'Y';

  return (
    <div 
      className={`relative ${className} ${isDrifting ? 'animate-cube-drift' : ''}`} 
      style={{ 
        width: w, 
        height: h, 
        perspective: '1200px', 
        transformStyle: 'preserve-3d',
        opacity
      }}
    >
      <div 
        className={`w-full h-full ${getRotationClass()}`}
        style={{ 
          transformStyle: 'preserve-3d',
          '--cube-speed': `${isFail ? 0.35 : (speed || 4)}s`,
          transform: (isSelected || isSuccess || speed === 0) ? 'rotateX(0deg) rotateY(0deg)' : 'none',
          transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        } as any}
      >
        {renderCube()}
      </div>
    </div>
  );
});
