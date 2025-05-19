"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface PixelExplosionProps {
  active: boolean;
  onExplosionComplete: () => void;
}

const PixelExplosion: React.FC<PixelExplosionProps> = ({ active, onExplosionComplete }) => {
  // Always declare hooks first, even if we may not render anything
  const [hasExploded, setHasExploded] = React.useState(false);
  
  // Handle the explosion effect timing
  React.useEffect(() => {
    if (active && !hasExploded) {
      // Set a small delay before explosion to create tension
      const timer = setTimeout(() => {
        setHasExploded(true);
        
        // Notify parent after explosion animation is complete
        // This will trigger the transition to floating shards
        setTimeout(() => {
          onExplosionComplete();
        }, 1500); // Time for explosion animation to complete
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    // Reset when not active
    if (!active && hasExploded) {
      setHasExploded(false);
    }
  }, [active, hasExploded, onExplosionComplete]);
  
  if (!active) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none rounded-[28px] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          opacity: hasExploded ? 0 : 1,
          scale: hasExploded ? [1, 1.4, 0.9] : 1,
          filter: hasExploded ? 'blur(3px) brightness(2.5)' : 'none',
          x: hasExploded ? [0, -8, 12, -10, 0] : 0,
          y: hasExploded ? [0, 7, -9, 4, 0] : 0
        }}
        transition={{ 
          duration: hasExploded ? 0.4 : 0,
          ease: "easeOut"
        }}
        className="relative"
      >
        <motion.div
          animate={{
            filter: ['brightness(1)', 'brightness(1.5)', 'brightness(0.8)', 'brightness(2)', 'brightness(0.5)'],
            x: [0, 2, -3, 1, -1],
            y: [0, -1, 2, -2, 1]
          }}
          transition={{ 
            duration: 0.3, 
            repeat: 5, 
            repeatType: "mirror" 
          }}
        >
          <Image
            src="/Trioll_Logo_White.png"
            alt="TRIOLL"
            width={200}
            height={100}
            className="object-contain invert brightness-0"
          />
        </motion.div>
      </motion.div>
      
      {/* Circular faded particles */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {hasExploded && Array.from({ length: 130 }).map((_, i) => {
          // Larger sized circles for a more ethereal look
          const size = Math.random() * 18 + 4; 
          const angle = Math.random() * Math.PI * 2;
          // Wider distance for particle spread
          const distance = 250 * Math.random() + 100; 
          // More varied delays for less uniform explosion
          const delay = Math.random() * 0.4;
          
          // Create different colored particles with more subtle, translucent colors
          const colors = [
            'bg-white/40', 'bg-red-400/30', 'bg-white/50', 
            'bg-red-300/25', 'bg-white/30', 'bg-red-200/20'
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          // Calculate a float path with gentle waviness
          const floatX = Math.random() * 30 - 15;
          const floatY = Math.random() * 30 - 15;
          const floatDuration = 3 + Math.random() * 4;
          
          return (
            <motion.div
              key={i}
              className={`absolute ${color} rounded-full`}
              style={{ 
                width: size, 
                height: size,
                x: 0,
                y: 0,
                filter: 'blur(2px)',
                opacity: 0,
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
              }}
              animate={{
                x: [0, Math.cos(angle) * distance, Math.cos(angle) * distance + floatX],
                y: [0, Math.sin(angle) * distance, Math.sin(angle) * distance + floatY],
                opacity: [0, 0.7, 0.3, 0],
                filter: ['blur(2px)', 'blur(3px)', 'blur(5px)', 'blur(7px)'],
                scale: [0.5, 1.3, 1, 0.8, 0.5] // Pulsing effect as particles float
              }}
              transition={{
                duration: floatDuration,
                delay: delay,
                ease: "easeOut",
                times: [0, 0.2, 0.7, 1], // Control timing of animation keyframes
                scale: {
                  repeat: 2,
                  duration: floatDuration / 3,
                  repeatType: "reverse"
                }
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default PixelExplosion;
