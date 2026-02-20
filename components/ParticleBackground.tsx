
import React, { useEffect, useRef, memo, useMemo } from 'react';

interface ParticleBackgroundProps {
  speedMultiplier?: number;
  level?: number;
}

// Gezegen/Geçit temalarına uygun renk paletleri
const NEBULA_PALETTES = [
  ['#083344', '#1e1b4b'], // Derin Cyan/Indigo (Geçit 1-5)
  ['#4c1d95', '#1e1b4b'], // Mor/Karanlık (Geçit 6-10)
  ['#701a75', '#450a0a'], // Pembe/Bordo (Geçit 11-15)
  ['#713f12', '#1e1b4b'], // Altın/Amber (Geçit 16-20)
  ['#064e3b', '#020617'], // Zümrüt (Geçit 21+)
];

export const ParticleBackground: React.FC<ParticleBackgroundProps> = memo(({ speedMultiplier = 1, level = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Seviyeye göre palet seçimi
  const palette = useMemo(() => {
    const idx = Math.floor((level - 1) / 5) % NEBULA_PALETTES.length;
    return NEBULA_PALETTES[idx];
  }, [level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      sparkle: number;
      sparkleSpeed: number;
    }> = [];

    let nebulas: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      pulse: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      particles = [];
      const count = 45;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.3,
          speedX: (Math.random() - 0.5) * 0.12,
          speedY: (Math.random() - 0.5) * 0.12,
          opacity: Math.random() * 0.5 + 0.2,
          sparkle: Math.random() * Math.PI,
          sparkleSpeed: Math.random() * 0.03 + 0.01
        });
      }

      nebulas = [];
      // 3 ana nebula katmanı
      for (let i = 0; i < 3; i++) {
        nebulas.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * (canvas.width * 0.5) + canvas.width * 0.3,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          color: i % 2 === 0 ? palette[0] : palette[1],
          pulse: Math.random() * Math.PI
        });
      }
    };

    const draw = () => {
      // Temel arka plan
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Nebulaları çiz (Yıldızlardan önce derinlik katmanı olarak)
      nebulas.forEach((n) => {
        n.pulse += 0.005;
        const currentRadius = n.radius * (1 + Math.sin(n.pulse) * 0.05);
        
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, currentRadius);
        grad.addColorStop(0, `${n.color}33`); // %20 opacity
        grad.addColorStop(0.5, `${n.color}11`); // %7 opacity
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(n.x - currentRadius, n.y - currentRadius, currentRadius * 2, currentRadius * 2);
        
        n.x += n.vx * speedMultiplier;
        n.y += n.vy * speedMultiplier;
        
        if (n.x < -n.radius) n.x = canvas.width + n.radius;
        if (n.x > canvas.width + n.radius) n.x = -n.radius;
        if (n.y < -n.radius) n.y = canvas.height + n.radius;
        if (n.y > canvas.height + n.radius) n.y = -n.radius;
      });

      ctx.globalCompositeOperation = 'source-over';
      
      // Yıldızları çiz
      particles.forEach((p) => {
        p.sparkle += p.sparkleSpeed;
        const currentOpacity = p.opacity * (Math.sin(p.sparkle) * 0.5 + 0.5);
        
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = '#ffffff';
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX * speedMultiplier;
        p.y += p.speedY * speedMultiplier;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speedMultiplier, palette]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
    />
  );
});
