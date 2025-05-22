'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import securityStore from '../utils/securityStore';

interface Particle {
  x: number;
  y: number;
  size: number;
  depth: number;
  color: string;
  redColor: string;
  blackColor: string;
  blur: number;
  vx: number;
  vy: number;
  vz: number;
  originalSize: number; // Store original size for consistency
  pulsePhase: number; // For subtle pulsing animation
}

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [securityBreached, setSecurityBreached] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // Subscribe to security breach status
  useEffect(() => {
    setSecurityBreached(securityStore.getSecurityBreached());
    
    const unsubscribe = securityStore.subscribe((breached) => {
      setSecurityBreached(breached);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Optimized particle initialization
  const initParticles = useCallback((width: number, height: number) => {
    const density = Math.min(width * height / 12000, 150); // Cap max particles
    const particles: Particle[] = [];
    
    const blackColors = [
      'rgba(0, 0, 0, 0.9)',
      'rgba(20, 20, 20, 0.8)',
      'rgba(40, 40, 40, 0.7)',
      'rgba(60, 60, 60, 0.6)',
      'rgba(80, 80, 80, 0.5)'
    ];
    
    const redColors = [
      'rgba(220, 0, 0, 0.9)',
      'rgba(200, 0, 0, 0.8)',
      'rgba(180, 0, 0, 0.7)',
      'rgba(160, 0, 0, 0.6)',
      'rgba(140, 0, 0, 0.5)'
    ];

    for (let i = 0; i < density; i++) {
      const depth = 0.1 + Math.random() * 0.9;
      
      // More consistent size calculation
      const baseSize = depth < 0.3 ? 
                       0.8 + Math.random() * 1.2 : 
                       depth < 0.7 ? 
                       1.8 + Math.random() * 2.5 :   
                       3.5 + Math.random() * 4.5;      
        
      const blur = Math.max(0, (1 - depth) * 3);
      
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: baseSize,
        originalSize: baseSize,
        depth,
        color: blackColors[Math.floor(Math.random() * blackColors.length)],
        redColor: redColors[Math.floor(Math.random() * redColors.length)],
        blackColor: blackColors[Math.floor(Math.random() * blackColors.length)],
        blur,
        vx: (Math.random() - 0.5) * 0.2 * depth,
        vy: (Math.random() - 0.5) * 0.2 * depth,
        vz: (Math.random() - 0.5) * 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    
    particlesRef.current = particles;
  }, []);

  // Optimized animation loop with better performance
  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !isVisible) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    // Throttle to ~60fps
    if (currentTime - lastTimeRef.current < 16) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = Math.min(currentTime - lastTimeRef.current, 32); // Cap delta time
    lastTimeRef.current = currentTime;

    const { width, height } = canvas;
    
    // Clear with optimized method
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#f8f8f8');
    gradient.addColorStop(1, '#e8e8e8');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw particles
    const particles = particlesRef.current;
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    const time = currentTime * 0.001;
    
    // Batch similar operations for better performance
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      // Update physics
      particle.x += particle.vx * deltaTime * 0.1;
      particle.y += particle.vy * deltaTime * 0.1;
      particle.depth += particle.vz * deltaTime * 0.1;
      
      // Update pulse phase
      particle.pulsePhase += deltaTime * 0.001;
      
      // Depth boundaries with smooth transitions
      if (particle.depth < 0.1) {
        particle.depth = 0.1;
        particle.vz = Math.abs(particle.vz) * 0.8;
      } else if (particle.depth > 1) {
        particle.depth = 1;
        particle.vz = -Math.abs(particle.vz) * 0.8;
      }
      
      // Size based on depth with subtle pulsing
      const pulse = Math.sin(particle.pulsePhase) * 0.1 + 1;
      particle.size = particle.originalSize * particle.depth * pulse;
      particle.blur = Math.max(0, (1 - particle.depth) * 2);
      
      // Screen wrapping
      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;
      
      // Mouse interaction with improved performance
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distanceSquared = dx * dx + dy * dy;
      const maxDistanceSquared = 40000; // 200px squared
      
      if (distanceSquared < maxDistanceSquared) {
        const distance = Math.sqrt(distanceSquared);
        const force = (1 - distance / 200) * 0.02 * particle.depth;
        particle.vx -= dx * force;
        particle.vy -= dy * force;
        particle.vz += (Math.random() - 0.5) * 0.0008;
      }
      
      // Apply friction
      particle.vx *= 0.995;
      particle.vy *= 0.995;
      particle.vz *= 0.99;
    }
    
    // Sort particles by depth for proper z-ordering (less frequently)
    if (Math.floor(time * 2) % 30 === 0) { // Every ~0.5 seconds
      particles.sort((a, b) => a.depth - b.depth);
    }
    
    // Draw particles
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      // Skip tiny or very blurred particles for performance
      if (particle.size < 0.5) continue;
      
      // Set shadow/blur effects
      if (particle.blur > 0.5) {
        ctx.shadowBlur = particle.blur;
        if (securityBreached) {
          const pulse = Math.sin(time * 3) * 0.3 + 0.7;
          ctx.shadowColor = `rgba(255, 0, 0, ${0.1 + pulse * 0.15})`;
          ctx.fillStyle = particle.redColor;
        } else {
          ctx.shadowColor = particle.color;
          ctx.fillStyle = particle.color;
        }
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = securityBreached ? particle.redColor : particle.color;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Reset shadow for next frame
    ctx.shadowBlur = 0;

    requestRef.current = requestAnimationFrame(animate);
  }, [isVisible, securityBreached]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Optimize canvas for better performance
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    // Optimize visibility handling
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    // Initialize
    handleResize();
    
    // Event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Start animation
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ 
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    />
  );
};

export default InteractiveBackground;
