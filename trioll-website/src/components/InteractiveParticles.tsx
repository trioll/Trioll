"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveParticlesProps {
  active: boolean;
}

interface ShardState {
  x: number;
  y: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  rotationVelocity: number;
  size: number;
  type: number;
}

const InteractiveParticles: React.FC<InteractiveParticlesProps> = ({ active }) => {
  // Always declare hooks at the top level
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 }); // Start off-screen
  const [shards, setShards] = useState<ShardState[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  
  // Create shards on mount
  useEffect(() => {
    if (active) {
      // Create 15-25 logo shards with random positions and velocities
      const numShards = Math.floor(Math.random() * 10) + 20;
      
      // Initial explosion from center
      const centerX = 50;
      const centerY = 40; // Slightly above center where logo would be
      
      const newShards = Array.from({ length: numShards }).map(() => {
        const size = Math.random() * 20 + 10; // Slightly larger shards
        
        // Calculate angle for explosion from center
        const angle = Math.random() * Math.PI * 2;
        const initialDistance = Math.random() * 15; // Initial explosion radius
        
        // Position shards in a circle around the center
        const x = centerX + Math.cos(angle) * initialDistance;
        const y = centerY + Math.sin(angle) * initialDistance;
        
        // Velocity outward from center (explosion effect)
        const speed = Math.random() * 0.5 + 0.3;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        
        return {
          x,
          y,
          rotation: Math.random() * 360,
          velocityX, 
          velocityY,
          rotationVelocity: (Math.random() - 0.5) * 0.8, // More rotation
          size,
          type: Math.floor(Math.random() * 5), // 5 different shard shapes
        };
      });
      setShards(newShards);
      
      // Start the animation loop
      lastUpdateTimeRef.current = Date.now();
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(updateShardPositions);
      }
    }
    
    return () => {
      // Clean up animation frame if component unmounts
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [active]);
  
  // Animation loop for shard movement
  const updateShardPositions = () => {
    const now = Date.now();
    const deltaTime = (now - lastUpdateTimeRef.current) / 16; // Normalize to ~60fps
    lastUpdateTimeRef.current = now;
    
    setShards(prevShards => {
      return prevShards.map(shard => {
        let { x, y, rotation, velocityX, velocityY, rotationVelocity } = shard;
        
        // Update position based on velocity
        x += velocityX * deltaTime;
        y += velocityY * deltaTime;
        rotation = (rotation + rotationVelocity * deltaTime) % 360;
        
        // Boundary collision detection with bounce
        if (x < 0 || x > 100) {
          velocityX *= -0.9; // Bounce with some energy loss
          x = x < 0 ? 0 : 100;
          // Add some random variation on bounce
          velocityY += (Math.random() - 0.5) * 0.1;
        }
        
        if (y < 0 || y > 100) {
          velocityY *= -0.9; // Bounce with some energy loss
          y = y < 0 ? 0 : 100;
          // Add some random variation on bounce
          velocityX += (Math.random() - 0.5) * 0.1;
        }
        
        // Apply friction
        velocityX *= 0.995;
        velocityY *= 0.995;
        rotationVelocity *= 0.998;
        
        // Apply a very small gravity
        velocityY += 0.0003 * deltaTime;
        
        // Cursor collision and repulsion
        const dx = x - mousePosition.x;
        const dy = y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Increased detection radius for more reactive behavior
        const repulsionRadius = 20 + (shard.size / 3);
        
        // If cursor is close enough to a shard, strongly repel it
        if (distance < repulsionRadius) {
          // Calculate repulsion strength - stronger when closer
          // The (1 - distance/repulsionRadius) makes the force stronger as distance decreases
          const repulsionStrength = (1 - distance/repulsionRadius) * 0.15;
          
          // Direction away from cursor
          const angle = Math.atan2(dy, dx);
          
          // Add velocity directly away from cursor
          // Use a stronger direct repulsion instead of just adding to existing velocity
          velocityX = velocityX * 0.3 + Math.cos(angle) * repulsionStrength * 1.5;
          velocityY = velocityY * 0.3 + Math.sin(angle) * repulsionStrength * 1.5;
          
          // Add stronger spin effect when repelled
          rotationVelocity += (Math.random() - 0.5) * repulsionStrength * 4;
          
          // Limit max velocity, but allow higher speeds during repulsion
          const maxVelocity = 1.8;
          const currentVelocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
          if (currentVelocity > maxVelocity) {
            velocityX = (velocityX / currentVelocity) * maxVelocity;
            velocityY = (velocityY / currentVelocity) * maxVelocity;
          }
        }
        
        // Occasionally add a tiny random impulse to keep things moving
        if (Math.random() < 0.02) {
          velocityX += (Math.random() - 0.5) * 0.02;
          velocityY += (Math.random() - 0.5) * 0.02;
        }
        
        return {
          ...shard,
          x,
          y,
          rotation,
          velocityX,
          velocityY,
          rotationVelocity,
        };
      });
    });
    
    animationFrameRef.current = requestAnimationFrame(updateShardPositions);
  };
  
  // Handle click event to create explosion effect
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    // Get click position
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((clientX - rect.left) / rect.width) * 100;
    const clickY = ((clientY - rect.top) / rect.height) * 100;
    
    // Apply explosion effect to all shards
    setShards(prevShards => {
      return prevShards.map(shard => {
        // Calculate angle and distance from click point to shard
        const dx = shard.x - clickX;
        const dy = shard.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // Strength of explosion is stronger closer to click point
        const explosionStrength = Math.max(20 - distance, 0) / 10;
        
        // Add explosive velocity away from click point
        const newVelocityX = shard.velocityX + Math.cos(angle) * explosionStrength * 2.5;
        const newVelocityY = shard.velocityY + Math.sin(angle) * explosionStrength * 2.5;
        
        // Add spin effect from explosion
        const newRotationVelocity = shard.rotationVelocity + (Math.random() - 0.5) * explosionStrength * 5;
        
        return {
          ...shard,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
          rotationVelocity: newRotationVelocity
        };
      });
    });
  };
  
  // Track mouse position for collisions
  useEffect(() => {
    if (!active) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });
    };
    
    // Also handle touch for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });
    };
    
    // Add click handlers for both mouse and touch
    const handleMouseClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      // Need to convert native MouseEvent to React event format
      handleClick({
        clientX: e.clientX,
        clientY: e.clientY
      } as React.MouseEvent);
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return;
      // Need to convert native TouchEvent to React event format
      handleClick({
        touches: [{
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        }]
      } as unknown as React.TouchEvent);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [active]);
  
  // Don't render if not active
  if (!active) return null;
  
  // Create a clip-path for each shard type
  const getClipPath = (type: number) => {
    switch(type) {
      case 0: // Triangle pointing up
        return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 1: // Triangle pointing right
        return 'polygon(0% 0%, 0% 100%, 100% 50%)';
      case 2: // Quadrilateral (irregular)
        return 'polygon(0% 0%, 100% 25%, 100% 75%, 25% 100%)';
      case 3: // Triangle pointing down
        return 'polygon(0% 0%, 100% 0%, 50% 100%)';
      case 4: // Diamond shape
        return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
      default:
        return 'polygon(50% 0%, 0% 100%, 100% 100%)';
    }
  };
  
  return (
    <motion.div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 overflow-hidden rounded-[28px] cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      {/* Shards */}
      {shards.map((shard, i) => (
        <div
          key={i}
          className="absolute bg-white shadow-glow"
          style={{
            width: shard.size,
            height: shard.size,
            clipPath: getClipPath(shard.type),
            filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))',
            left: `${shard.x}%`,
            top: `${shard.y}%`,
            transform: `rotate(${shard.rotation}deg)`,
            transition: 'none'
          }}
        />
      ))}
    </motion.div>
  );
};

export default InteractiveParticles;
