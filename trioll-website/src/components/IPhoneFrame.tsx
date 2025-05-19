"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import GameCarousel from "@/components/GameCarousel";
import PixelExplosion from "@/components/PixelExplosion";
import InteractiveParticles from "@/components/InteractiveParticles";
import securityStore from '../utils/securityStore';

const IPhoneFrame: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [enteredPin, setEnteredPin] = useState("");
  const [incorrectAttempt, setIncorrectAttempt] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [securityLockdown, setSecurityLockdown] = useState(false);
  const [pixelExplosion, setPixelExplosion] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const phoneRef = useRef<HTMLDivElement>(null);
  
  // For 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse motion into rotation (with dampening)
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);
  
  // Add spring physics for smoother, more natural movement
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });
  
  const correctPin = "477235";
  
  // Define handlers with useCallback to prevent unnecessary re-renders
  const handlePinInput = useCallback((digit: string) => {
    if (securityLockdown) return; // Prevent input during lockdown
    
    if (enteredPin.length < 6) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      
      if (newPin.length === 6) {
        if (newPin === correctPin) {
          setTimeout(() => {
            setIsLocked(false);
            setFailedAttempts(0); // Reset counter on success
          }, 300);
        } else {
          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);
          setIncorrectAttempt(true);
          
          if (newFailedAttempts >= 6) {
            // Trigger security lockdown after 6 failed attempts
            setTimeout(() => {
              setSecurityLockdown(true);
              securityStore.setSecurityBreached(true);
              
              // Start pixel explosion animation after 2 seconds
              setTimeout(() => {
                setPixelExplosion(true);
              }, 2000);
            }, 500);
          } else {
            setTimeout(() => {
              setEnteredPin("");
              setIncorrectAttempt(false);
            }, 500);
          }
        }
      }
    }
  }, [enteredPin, correctPin, failedAttempts, securityLockdown]);

  const handleDelete = useCallback(() => {
    if (securityLockdown) return; // Prevent input during lockdown
    setEnteredPin(enteredPin.slice(0, -1));
  }, [enteredPin, securityLockdown]);

  const handleLock = useCallback(() => {
    setIsLocked(true);
    setEnteredPin("");
    setSecurityLockdown(false);
    setPixelExplosion(false);
    setShowParticles(false);
    setFailedAttempts(0);
  }, []);

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
      );
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    // Mouse move handler for 3D effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneRef.current) return;
      
      const rect = phoneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center (for dampening effect near center)
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Apply dampening based on distance
      mouseX.set(distanceX);
      mouseY.set(distanceY);
    };
    
    // Keyboard handler for number inputs when lock screen is active
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked) return;
      
      if (e.key >= '0' && e.key <= '9') {
        handlePinInput(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    
    // Add mousemove and keydown event listeners to document
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mouseX, mouseY, isLocked, enteredPin, handleDelete, handlePinInput]);

  return (
    <div className="relative max-w-[220px] md:max-w-[250px] mx-auto">
      {/* iPhone frame with 3D tilt effect */}
      <motion.div 
        ref={phoneRef}
        className="relative rounded-[40px] border-8 border-black shadow-lg overflow-hidden
                  w-full aspect-[9/19.5] bg-black max-w-[250px]"
        style={{
          transformStyle: 'preserve-3d',
          perspective: 800,
          rotateX: springRotateX,
          rotateY: springRotateY,
          // Add subtle shadow shift on movement
          boxShadow: '0 10px 30px -15px rgba(0,0,0,0.7)',
          transition: 'transform 0.3s ease'
        }}
        whileHover={{ scale: 1.03 }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-1/3 h-5 bg-black rounded-full z-10"></div>
        
        {/* Screen with content */}
        <div className="relative w-full h-full overflow-hidden rounded-[32px] bg-black z-0">
          {/* Lock screen or home screen based on isLocked state */}
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="lockscreen"
                initial={{ opacity: 0 }}
                animate={securityLockdown ? {
                  opacity: 1,
                  backgroundColor: showParticles ? 
                    'rgb(0, 0, 0)' : 
                    ['rgba(0,0,0,1)', 'rgba(255,0,0,0.85)', 'rgba(0,0,0,1)']
                } : { 
                  opacity: 1 
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  backgroundColor: { 
                    repeat: securityLockdown && !showParticles ? Infinity : 0, 
                    repeatType: "mirror",
                    duration: 0.5
                  } 
                }}
                className="absolute inset-0 flex flex-col items-center justify-start pt-8 px-3"
                style={{
                  backgroundImage: 'url(/lockscreen-bg.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Lock screen content - only shown when not in security lockdown */}
                {!securityLockdown && (
                  <div className="flex flex-col items-center">
                    <div className="text-white text-3xl font-light mt-2">{currentTime}</div>
                    <div className="text-white/80 text-base mb-2">{currentDate}</div>
                  </div>
                )}
                
                {/* Middle content - TRIOLL Logo */}
                <div className="flex flex-col items-center space-y-2 px-3 mt-1">
                  <div className="flex justify-center w-full relative">
                    {/* Show inverted logo when in security lockdown but before pixel explosion */}
                    {securityLockdown && !pixelExplosion ? (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                          scale: [1.2, 1.5, 1.4, 1.6],
                          filter: [
                            'drop-shadow(0 0 4px rgba(255,0,0,0.5))', 
                            'drop-shadow(0 0 12px rgba(255,0,0,0.9))',
                            'drop-shadow(0 0 8px rgba(255,0,0,0.7))',
                            'drop-shadow(0 0 16px rgba(255,0,0,1.0))'
                          ],
                          x: [0, -2, 3, -3, 0, 1, -1, 0],
                          y: [0, 1, -2, 3, -1, 0, 2, 0]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          repeatType: "mirror",
                          duration: 3,
                          ease: "easeInOut"
                        }}
                        className="relative"
                      >
                        <Image
                          src="/Trioll_Logo_White.png"
                          alt="TRIOLL"
                          width={200}
                          height={100}
                          className="object-contain invert brightness-0"
                        />
                      </motion.div>
                    ) : (
                      !securityLockdown && (
                        <Image
                          src="/Trioll_Logo_White.png"
                          alt="TRIOLL"
                          width={150}
                          height={75}
                          className="object-contain"
                        />
                      )
                    )}
                  </div>
                  
                  {/* Passcode entry - only shown when not in security lockdown */}
                  {!securityLockdown && (
                    <>
                      <div className="text-white/90 text-sm mb-2">Enter Passcode</div>
                      
                      {/* Pin dots */}
                      <motion.div 
                        animate={incorrectAttempt ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                        className="flex gap-2 mb-3"
                      >
                        {[...Array(6)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-3 h-3 rounded-full ${i < enteredPin.length ? 'bg-white' : 'bg-white/30'}`}
                          />
                        ))}
                      </motion.div>
                      
                      {/* Keypad */}
                      <div className="grid grid-cols-3 gap-2 w-full max-w-[170px]">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((digit, i) => (
                          <motion.div 
                            key={i}
                            whileTap={{ scale: 0.9 }}
                            className={`
                              ${digit === '' ? 'invisible' : ''}
                              ${digit === 'del' ? 'text-sm' : 'text-lg'}
                              h-10 w-10 rounded-full bg-white/20 backdrop-blur-md 
                              flex items-center justify-center text-white font-light
                              ${typeof digit === 'number' ? 'cursor-pointer' : ''}
                              active:outline-none focus:outline-none
                            `}
                            style={{
                              WebkitTapHighlightColor: 'transparent',
                              touchAction: 'manipulation'
                            }}
                            onClick={() => {
                              if (typeof digit === 'number') handlePinInput(digit.toString());
                              else if (digit === 'del') handleDelete();
                            }}
                          >
                            {digit === 'del' ? '⌫' : digit}
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Special Animation Components */}
                <PixelExplosion 
                  active={pixelExplosion} 
                  onExplosionComplete={() => {
                    // Start interactive particles after explosion completes
                    setShowParticles(true);
                  }}
                />
                <InteractiveParticles active={showParticles} />
              </motion.div>
            ) : (
              <motion.div
                key="gamecarousel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <GameCarousel />
                
                {/* Lock button */}
                <div 
                  className="absolute top-2 right-2 bg-white/20 rounded-full p-1 cursor-pointer"
                  onClick={handleLock}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gray-600 rounded-full"></div>
      </motion.div>
      
      {/* Instruction text */}
      <div className="mt-2 text-center text-white/70 text-xs">
        <p>{isLocked ? "Enter passcode: 477235" : "Swipe to preview games"}</p>
      </div>
      
      {/* Styles for text glow effects */}
      <style jsx global>{`
        .text-shadow-white {
          text-shadow: 0 0 3px rgba(255, 255, 255, 0.8),
                      0 0 5px rgba(255, 255, 255, 0.6),
                      0 0 8px rgba(255, 255, 255, 0.4);
        }
        
        .shadow-glow {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
                      0 0 15px rgba(255, 255, 255, 0.3);
        }
        
        @keyframes subtle-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(255,255,255,0.9)) drop-shadow(0 0 8px rgba(255,255,255,0.6)); }
          50% { filter: drop-shadow(0 0 6px rgba(255,255,255,0.9)) drop-shadow(0 0 12px rgba(255,255,255,0.7)); }
        }
      `}</style>
    </div>
  );
};

export default IPhoneFrame;
