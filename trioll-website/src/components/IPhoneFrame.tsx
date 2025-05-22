"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import GameCarousel from "@/components/GameCarousel";
import PixelExplosion from "@/components/PixelExplosion";
import InteractiveParticles from "@/components/InteractiveParticles";
import securityStore from '../utils/securityStore';

const IPhoneFrame: React.FC = () => {
  // State management
  const [isLocked, setIsLocked] = useState(true);
  const [enteredPin, setEnteredPin] = useState("");
  const [incorrectAttempt, setIncorrectAttempt] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [securityLockdown, setSecurityLockdown] = useState(false);
  const [pixelExplosion, setPixelExplosion] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  
  const phoneRef = useRef<HTMLDivElement>(null);
  
  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [3, -3]);
  const rotateY = useTransform(mouseX, [-300, 300], [-3, 3]);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 30 });
  
  const correctPin = "477235";
  
  // Improved unlock sequence
  const handleUnlock = useCallback(async () => {
    setIsUnlocking(true);
    
    // Step 1: Brief pause after correct PIN
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Step 2: Unlock the phone
    setIsLocked(false);
    setFailedAttempts(0);
    
    // Step 3: Wait for unlock animation to complete
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Step 4: Start rotation
    setIsRotated(true);
    
    // Step 5: Wait for rotation to complete, then show iframe
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowIframe(true);
    setIsUnlocking(false);
  }, []);

  const handlePinInput = useCallback((digit: string) => {
    if (securityLockdown || isUnlocking) return;
    
    if (enteredPin.length < 6) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      
      if (newPin.length === 6) {
        if (newPin === correctPin) {
          handleUnlock();
        } else {
          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);
          setIncorrectAttempt(true);
          
          if (newFailedAttempts >= 6) {
            setTimeout(() => {
              setSecurityLockdown(true);
              securityStore.setSecurityBreached(true);
              setTimeout(() => setPixelExplosion(true), 2000);
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
  }, [enteredPin, correctPin, failedAttempts, securityLockdown, isUnlocking, handleUnlock]);

  const handleDelete = useCallback(() => {
    if (securityLockdown || isUnlocking) return;
    setEnteredPin(enteredPin.slice(0, -1));
  }, [enteredPin, securityLockdown, isUnlocking]);

  const handleLock = useCallback(() => {
    setShowIframe(false);
    setIsRotated(false);
    setIsLocked(true);
    setEnteredPin("");
    setSecurityLockdown(false);
    setPixelExplosion(false);
    setShowParticles(false);
    setFailedAttempts(0);
    setIsUnlocking(false);
  }, []);

  // Time and mouse movement effects
  useEffect(() => {
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
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneRef.current || isRotated) return;
      
      const rect = phoneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked) return;
      
      if (e.key >= '0' && e.key <= '9') {
        handlePinInput(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mouseX, mouseY, isLocked, isRotated, handleDelete, handlePinInput]);

  return (
    <div className="relative max-w-[220px] md:max-w-[250px] mx-auto">
      {/* iPhone frame with improved animations */}
      <motion.div 
        ref={phoneRef}
        className="relative rounded-[40px] border-8 border-black shadow-2xl overflow-hidden
                  w-full aspect-[9/19.5] bg-black max-w-[250px]"
        animate={{
          rotate: isRotated ? 90 : 0,
          scale: isRotated ? 1.4 : 1,
          y: isRotated ? 20 : 0,
        }}
        transition={{
          duration: 1.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "tween"
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1000,
          rotateX: !isRotated ? springRotateX : 0,
          rotateY: !isRotated ? springRotateY : 0,
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
        whileHover={{ 
          scale: isRotated ? 1.4 : 1.02,
          transition: { duration: 0.2 }
        }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-1/3 h-5 bg-black rounded-full z-10"></div>
        
        {/* Screen content */}
        <div className="relative w-full h-full overflow-hidden rounded-[32px] bg-black">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="lockscreen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={securityLockdown ? {
                  opacity: 1,
                  scale: 1,
                  backgroundColor: showParticles ? 
                    'rgb(0, 0, 0)' : 
                    ['rgba(0,0,0,1)', 'rgba(255,0,0,0.85)', 'rgba(0,0,0,1)']
                } : { 
                  opacity: 1,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 1.05,
                  transition: { duration: 0.6, ease: "easeInOut" }
                }}
                transition={{ 
                  backgroundColor: { 
                    repeat: securityLockdown && !showParticles ? Infinity : 0, 
                    repeatType: "mirror",
                    duration: 0.5
                  },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                className="absolute inset-0 flex flex-col items-center justify-start pt-8 px-3"
                style={{
                  backgroundImage: 'url(/lockscreen-bg.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Lock screen content */}
                {!securityLockdown && (
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="text-white text-3xl font-light mt-2">{currentTime}</div>
                    <div className="text-white/80 text-base mb-2">{currentDate}</div>
                  </motion.div>
                )}
                
                {/* TRIOLL Logo section */}
                <motion.div 
                  className="flex flex-col items-center space-y-2 px-3 mt-1"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="flex justify-center w-full relative">
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
                  
                  {/* Passcode entry */}
                  {!securityLockdown && (
                    <>
                      <motion.div 
                        className="text-white/90 text-sm mb-2"
                        animate={isUnlocking ? { opacity: [1, 0.5, 1] } : {}}
                        transition={{ repeat: isUnlocking ? Infinity : 0, duration: 1 }}
                      >
                        {isUnlocking ? "Unlocking..." : "Enter Passcode"}
                      </motion.div>
                      
                      {/* PIN dots with improved animation */}
                      <motion.div 
                        animate={incorrectAttempt ? { 
                          x: [0, -10, 10, -10, 10, 0],
                          transition: { duration: 0.5 }
                        } : {}}
                        className="flex gap-2 mb-3"
                      >
                        {[...Array(6)].map((_, i) => (
                          <motion.div 
                            key={i}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              i < enteredPin.length ? 'bg-white scale-110' : 'bg-white/30'
                            }`}
                            animate={i === enteredPin.length - 1 && enteredPin.length > 0 ? {
                              scale: [1, 1.3, 1.1],
                              transition: { duration: 0.3 }
                            } : {}}
                          />
                        ))}
                      </motion.div>
                      
                      {/* Improved keypad */}
                      <div className="grid grid-cols-3 gap-2 w-full max-w-[170px]">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((digit, i) => (
                          <motion.div 
                            key={i}
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
                            className={`
                              ${digit === '' ? 'invisible' : ''}
                              ${digit === 'del' ? 'text-sm' : 'text-lg'}
                              h-10 w-10 rounded-full bg-white/20 backdrop-blur-md 
                              flex items-center justify-center text-white font-light
                              ${typeof digit === 'number' ? 'cursor-pointer' : ''}
                              transition-all duration-150 select-none
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
                </motion.div>
                
                {/* Pixel explosion and particles */}
                <PixelExplosion 
                  active={pixelExplosion} 
                  onExplosionComplete={() => setShowParticles(true)}
                />
                <InteractiveParticles active={showParticles} />
              </motion.div>
            ) : (
              <motion.div
                key="homescreen"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full"
              >
                {showIframe ? (
                  <div className="w-full h-full overflow-hidden">
                    <motion.div 
                      className="relative w-full h-full"
                      animate={{
                        rotate: isRotated ? -90 : 0
                      }}
                      transition={{
                        duration: 1.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: 0.1
                      }}
                      style={{
                        transformOrigin: 'center center',
                      }}
                    >
                      <iframe 
                        src="https://grant-glaze-26957295.figma.site/"
                        style={{
                          width: isRotated ? '180%' : '100%',
                          height: isRotated ? '85%' : '100%',
                          border: 'none',
                          borderRadius: '24px',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          aspectRatio: isRotated ? '19.5/9' : '9/19.5',
                          transformOrigin: 'center center',
                          scale: isRotated ? 0.9 : 1,
                        }}
                        title="TRIOLL Game Interface"
                      />
                    </motion.div>
                  </div>
                ) : (
                  <div className="w-full h-full overflow-hidden">
                    <GameCarousel />
                  </div>
                )}
                
                {/* Lock button with improved styling */}
                <motion.div 
                  className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-2 cursor-pointer border border-white/10"
                  onClick={handleLock}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gray-600 rounded-full"></div>
      </motion.div>
      
      {/* Instruction text */}
      <motion.div 
        className="mt-3 text-center text-black/60 text-xs"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <p>
          {isLocked 
            ? "Enter passcode: 477235" 
            : showIframe 
              ? "Interactive Figma prototype" 
              : "Swipe to preview games"}
        </p>
      </motion.div>
    </div>
  );
};

export default IPhoneFrame;
