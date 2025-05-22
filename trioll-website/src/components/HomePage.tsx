"use client";

import Image from "next/image";
import { motion, useAnimate } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import InteractiveBackground from "@/components/InteractiveBackground";
import ContactForm from "@/components/ContactForm";
import IPhoneFrame from "@/components/IPhoneFrame";

const HomePage = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [scope, animate] = useAnimate();
  const [glow1Ref, animateGlow1] = useAnimate();
  const [glow2Ref, animateGlow2] = useAnimate();
  const [glow3Ref, animateGlow3] = useAnimate();
  
  // Start animations after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Floating glow animation effect
  const startGlowAnimations = useCallback(() => {
    if (!shouldAnimate || !glow1Ref.current || !glow2Ref.current || !glow3Ref.current) return;
    
    // Enhance text visibility with subtle shadow
    animate(scope.current, {
      textShadow: "0 0 1px rgba(0, 0, 0, 0.6), 0 0 2px rgba(0, 0, 0, 0.3)"
    }, { duration: 0.5 });
    
    // Glow 1 - Logo to text movement
    animateGlow1(glow1Ref.current, {
      x: ['calc(100% - 80px)', '60%', '20%', '10%', '30%', '70%', 'calc(100% - 80px)'],
      y: ['25%', '15%', '35%', '45%', '25%', '15%', '25%'],
      scale: [1, 1.3, 0.8, 1.4, 0.9, 1.2, 1],
      filter: [
        'blur(12px) grayscale(1) brightness(0.8)',
        'blur(18px) grayscale(1) brightness(1.3)',
        'blur(22px) grayscale(1) brightness(0.9)',
        'blur(14px) grayscale(1) brightness(1.2)',
        'blur(16px) grayscale(1) brightness(1.0)',
      ],
      opacity: [0.6, 0.4, 0.7, 0.5, 0.6, 0.4, 0.6]
    }, {
      duration: 16,
      repeat: Infinity,
      ease: "easeInOut",
    });
    
    // Glow 2 - Text to logo movement
    animateGlow2(glow2Ref.current, {
      x: ['15%', '40%', '75%', '85%', '55%', '25%', '15%'],
      y: ['30%', '55%', '20%', '40%', '65%', '30%', '30%'],
      scale: [0.8, 1.2, 0.7, 1.4, 0.9, 1.3, 0.8],
      filter: [
        'blur(16px) grayscale(1) brightness(0.9)',
        'blur(12px) grayscale(1) brightness(1.4)',
        'blur(20px) grayscale(1) brightness(0.8)',
        'blur(14px) grayscale(1) brightness(1.3)',
        'blur(18px) grayscale(1) brightness(1.0)',
      ],
      opacity: [0.5, 0.7, 0.4, 0.6, 0.5, 0.7, 0.5]
    }, {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    });
    
    // Glow 3 - Background tagline glow
    animateGlow3(glow3Ref.current, {
      scale: [1, 1.2, 0.9, 1.15, 1],
      filter: [
        'blur(20px) grayscale(1) opacity(0.5)',
        'blur(15px) grayscale(1) opacity(0.7)',
        'blur(25px) grayscale(1) opacity(0.4)',
        'blur(12px) grayscale(1) opacity(0.6)',
        'blur(20px) grayscale(1) opacity(0.5)',
      ],
    }, {
      duration: 14,
      repeat: Infinity,
      ease: "easeInOut",
    });
  }, [shouldAnimate, animate, animateGlow1, animateGlow2, animateGlow3, scope, glow1Ref, glow2Ref, glow3Ref]);
  
  useEffect(() => {
    startGlowAnimations();
  }, [startGlowAnimations]);
  
  return (
    <>
      <InteractiveBackground />
      
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
        {/* Floating glow effects */}
        <div className="fixed top-0 left-0 right-0 h-40 overflow-visible z-30 pointer-events-none">
          {/* Glow orbs with improved styling */}
          <div 
            ref={glow1Ref}
            className="absolute w-[280px] h-[70px] rounded-full mix-blend-screen pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(200, 200, 200, 0.6) 0%, rgba(200, 200, 200, 0.1) 70%)',
              filter: 'blur(12px)',
              top: '30px',
              right: '60px',
            }}
          />
          
          <div 
            ref={glow2Ref}
            className="absolute w-[240px] h-[60px] rounded-full mix-blend-screen pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(240, 240, 240, 0.5) 0%, rgba(240, 240, 240, 0.1) 70%)',
              filter: 'blur(16px)',
              top: '35px',
              left: '40px',
            }}
          />
          
          <div 
            ref={glow3Ref}
            className="absolute w-[360px] h-[80px] rounded-full mix-blend-screen pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(220, 220, 220, 0.4) 0%, rgba(220, 220, 220, 0.1) 70%)',
              filter: 'blur(20px)',
              top: '25px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: -1
            }}
          />
        </div>
        
        {/* Header section */}
        <motion.header 
          className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* TRIOLL title */}
          <div className="flex flex-col items-start justify-center">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold tracking-wider cursor-pointer mb-1 select-none"
              whileHover={{ 
                scale: 1.05, 
                textShadow: "0 0 8px rgba(255, 255, 255, 0.9), 0 0 16px rgba(255, 255, 255, 0.6), 0 0 24px rgba(255, 255, 255, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                textShadow: [
                  "0 0 1px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 0, 0, 0.3)", 
                  "0 0 2px rgba(0, 0, 0, 0.6), 0 0 4px rgba(0, 0, 0, 0.4)",
                  "0 0 1px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 0, 0, 0.3)"
                ]
              }}
              transition={{ 
                textShadow: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 400, damping: 12 }
              }}
            >
              <span className="relative z-10 text-black">TRIOLL</span>
            </motion.h1>
          </div>
          
          {/* Tagline - centered */}
          <div className="flex-1 flex items-center justify-center">
            <div 
              ref={scope}
              className="text-base md:text-lg text-black/90 font-medium tracking-wide flex flex-wrap justify-center gap-x-2 gap-y-1"
            >
              {['Level', 'Up', 'Your', 'Game', 'Discovery'].map((word, index) => (
                <motion.span 
                  key={index} 
                  className="inline-block select-none"
                  whileHover={{
                    scale: 1.1,
                    y: -3,
                    textShadow: "0 0 6px rgba(255, 255, 255, 0.8)"
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 12,
                  }}
                >
                  {word}{index === 4 ? '.' : ''}
                </motion.span>
              ))}
            </div>
          </div>
          
          {/* Logo */}
          <motion.div
            whileHover={{ 
              scale: 1.05,
              filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.5))"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              filter: { type: "tween", duration: 0.3 },
              scale: { type: "spring", stiffness: 400, damping: 12 }
            }}
            className="cursor-pointer"
          >
            <Image
              src="/Trioll_Logo_Black.png"
              alt="TRIOLL"
              width={70}
              height={28}
              priority
              className="object-contain"
            />
          </motion.div>
        </motion.header>
        
        {/* Main content */}
        <main className="container mx-auto flex flex-col items-center max-w-6xl mt-20 pt-10">
          {/* iPhone Game Preview */}
          <section className="w-full my-16">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.4, 
                duration: 1,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
            >
              <IPhoneFrame />
            </motion.div>
          </section>
          
          {/* Contact Section */}
          <section className="w-full max-w-lg mb-60">
            <div className="h-96"></div> {/* Spacer for scroll trigger */}
            <ContactForm />
          </section>
        </main>
        
        {/* Footer */}
        <motion.footer 
          className="mt-16 text-black/60 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          © {new Date().getFullYear()} TRIOLL. All rights reserved.
        </motion.footer>
      </div>
      
      {/* Global styles for better text rendering */}
      <style jsx global>{`
        .text-shadow-glow-dark {
          font-weight: 700;
          text-shadow: 0 0 1px rgba(0, 0, 0, 0.5),
                      0 0 3px rgba(0, 0, 0, 0.3),
                      0 0 5px rgba(0, 0, 0, 0.2);
        }
        
        .text-shadow-subtle {
          font-weight: 400;
          text-shadow: 0 0 1px rgba(0, 0, 0, 0.4),
                      0 0 2px rgba(0, 0, 0, 0.2);
          color: rgba(0, 0, 0, 0.85);
        }
        
        .text-shadow-enhanced {
          font-weight: 600;
          text-shadow: 0 0 2px rgba(0, 0, 0, 0.6),
                      0 0 4px rgba(0, 0, 0, 0.4),
                      0 0 6px rgba(0, 0, 0, 0.2);
          color: rgba(0, 0, 0, 1);
        }

        /* Improved selection styles */
        ::selection {
          background-color: rgba(0, 0, 0, 0.1);
        }
        
        /* Better text rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Prevent text selection on interactive elements */
        .select-none {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </>
  );
};

export default HomePage;
