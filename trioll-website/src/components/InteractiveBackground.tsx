'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  depth: number;
  color: string;
  blur: number;
  vx: number;
  vy: number;
  vz: number; // Velocity in z-axis for 3D effect
}

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // Handle touch events
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };
    
    // Initialize background particles
    const initParticles = () => {
      const { width, height } = canvas;
      const particlesCount = Math.floor((width * height) / 8000); // Increased density
      const particles: Particle[] = [];
      
      const blackColors = [
        'rgba(0, 0, 0, 0.9)',
        'rgba(20, 20, 20, 0.8)',
        'rgba(40, 40, 40, 0.7)',
        'rgba(60, 60, 60, 0.6)',
        'rgba(80, 80, 80, 0.5)'
      ];

      for (let i = 0; i < particlesCount; i++) {
        // Depth gives 3D effect - closer particles are larger, faster, and less blurry
        const depth = 0.1 + Math.random() * 0.9; // depth between 0.1-1
        
        // Enhance size variation with depth to create stronger 3D effect
        const size = depth < 0.3 ? 
                     0.5 + Math.random() * 1.5 : // Small dots in the distance
                     depth < 0.7 ? 
                     1.5 + Math.random() * 3 :   // Medium dots in the middle
                     3 + Math.random() * 6;      // Large dots in the foreground
        
        // Add blur based on depth - distant particles are more blurred
        const blur = (1 - depth) * 5; // More blur for particles farther away
        
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          depth,
          color: blackColors[Math.floor(Math.random() * blackColors.length)],
          blur,
          vx: (Math.random() - 0.5) * 0.3 * depth, // Faster if closer (higher depth value)
          vy: (Math.random() - 0.5) * 0.3 * depth,
          vz: (Math.random() - 0.5) * 0.01, // Small z-axis velocity for depth changes
        });
      }
      
      particlesRef.current = particles;
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Create white-to-gray gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#ffffff'); // Pure white
      gradient.addColorStop(0.5, '#f5f5f5'); // Very light gray
      gradient.addColorStop(1, '#e0e0e0'); // Light gray

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw and update particles
      const particles = particlesRef.current;
      
      // Sort particles by depth (z-order) for proper layering
      particles.sort((a, b) => a.depth - b.depth);
      
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
        // Update position with wrapping
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Update depth with z-axis velocity for true 3D effect
        particle.depth += particle.vz;
        
        // Keep depth within bounds (0.1-1)
        if (particle.depth < 0.1) {
          particle.depth = 0.1;
          particle.vz *= -1; // Reverse direction
        } else if (particle.depth > 1) {
          particle.depth = 1;
          particle.vz *= -1; // Reverse direction
        }
        
        // Instead of randomly changing size every frame, keep it stable based on depth
        // This prevents flickering while still maintaining the 3D effect
        const sizeBase = particle.depth < 0.3 ? 1 : 
                        particle.depth < 0.7 ? 3 : 5;
        
        // Size is now deterministic based on depth (no random factor per frame)
        particle.size = sizeBase * particle.depth;
        
        // Blur is consistently related to depth (farther = more blur)
        particle.blur = (1 - particle.depth) * 3;
        
        // Wrap around screen edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
        
        // Apply subtle mouse interaction (particles are affected based on depth)
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;
        
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 0.03 * particle.depth;
          particle.vx -= dx * force;
          particle.vy -= dy * force;
          
          // Add subtle z-axis movement when near mouse
          particle.vz += (Math.random() - 0.5) * 0.001;
        }
        
        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        particle.vz *= 0.98; // Slightly more friction on z-axis
        
        // Draw particle with blur effect based on depth
        if (particle.blur > 0) {
          ctx.shadowBlur = particle.blur;
          ctx.shadowColor = particle.color;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Reset shadow/blur for next particle
        ctx.shadowBlur = 0;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    requestRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default InteractiveBackground;
