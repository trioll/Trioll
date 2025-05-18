"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import GameCarousel from "@/components/GameCarousel";

const IPhoneFrame: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [enteredPin, setEnteredPin] = useState("");
  const [incorrectAttempt, setIncorrectAttempt] = useState(false);
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
  
  const correctPin = "696969";

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
      const phoneElement = phoneRef.current;
      if (!phoneElement) return;
      
      // Get phone element position and dimensions
      const rect = phoneElement.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the phone
      const phoneX = rect.left + rect.width / 2;
      const phoneY = rect.top + rect.height / 2;
      
      // Calculate distance from center
      const distX = e.clientX - phoneX;
      const distY = e.clientY - phoneY;
      
      // Update motion values (with a reasonable range)
      mouseX.set(distX);
      mouseY.set(distY);
    };
    
    // Add mousemove event listener to document
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);  // Add mouseX, mouseY to dependencies

  const handlePinInput = (digit: string) => {
    if (enteredPin.length < 6) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      
      if (newPin.length === 6) {
        if (newPin === correctPin) {
          setTimeout(() => {
            setIsLocked(false);
          }, 300);
        } else {
          setIncorrectAttempt(true);
          setTimeout(() => {
            setEnteredPin("");
            setIncorrectAttempt(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin(enteredPin.slice(0, -1));
  };

  const handleLock = () => {
    setIsLocked(true);
    setEnteredPin("");
  };

  return (
    <div className="relative max-w-[220px] md:max-w-[250px] mx-auto">
      {/* iPhone frame with 3D tilt effect */}
      <motion.div 
        ref={phoneRef}
        className="relative w-full aspect-[9/19] bg-black rounded-[40px] p-2 shadow-2xl border-[6px] border-gray-800"
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d',
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
        
        {/* Screen */}
        <div className="relative w-full h-full overflow-hidden rounded-[32px] bg-black z-0">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div 
                key="lockscreen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col justify-between p-4"
                style={{
                  backgroundImage: "url('/lockscreen-bg.jpg')", 
                  backgroundSize: "cover", 
                  backgroundPosition: "center"
                }}
              >
                {/* Lock screen UI */}
                <div className="flex flex-col items-center">
                  <div className="text-white text-2xl font-light mt-4">{currentTime}</div>
                  <div className="text-white/80 text-xs mb-4">{currentDate}</div>
                  
                  {/* TRIOLL Logo with enhanced diffused glow below date */}
                  <div className="flex flex-col items-center space-y-3 px-3 mt-2">
                  <div className="flex justify-center w-full relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [1, 0.95, 1],
                        y: [0, -1, 0]
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Image
                        src="/Trioll_Logo_White.png"
                        alt="TRIOLL"
                        width={100}
                        height={40}
                        className="object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] brightness-110"
                        style={{
                          filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.9)) drop-shadow(0 0 8px rgba(255,255,255,0.6)) drop-shadow(0 0 12px rgba(255,255,255,0.4))'
                        }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Interactive Level Up Your Game Discovery text */}
                  <div className="text-white text-[9px] w-full text-center overflow-hidden">
                    <div className="flex justify-center space-x-1 overflow-hidden flex-wrap">
                      {['Level', 'Up', 'Your', 'Game', 'Discovery'].map((word, index) => (
                        <motion.span
                          key={index}
                          className="inline-block text-shadow-white"
                          whileHover={{ scale: 1.2, y: -1 }}
                          animate={{ 
                            textShadow: [
                              '0 0 2px rgba(255,255,255,0.5)', 
                              '0 0 4px rgba(255,255,255,0.7)', 
                              '0 0 2px rgba(255,255,255,0.5)'
                            ]
                          }}
                          transition={{ 
                            textShadow: { repeat: Infinity, duration: 2 },
                            staggerChildren: 0.1
                          }}
                        >
                          {word}
                          {index < 4 ? '\u00A0' : ''}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
                
                </div>
                <div className="flex flex-col items-center mb-4">
                  <div className="text-white/90 text-xs mb-2">Enter Passcode</div>
                  
                  {/* Pin dots */}
                  <motion.div 
                    animate={incorrectAttempt ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex gap-2 mb-4"
                  >
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2.5 h-2.5 rounded-full ${i < enteredPin.length ? 'bg-white' : 'bg-white/30'}`}
                      />
                    ))}
                  </motion.div>
                  
                  {/* Keypad */}
                  <div className="grid grid-cols-3 gap-2 w-full max-w-[160px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((digit, i) => (
                      <motion.div 
                        key={i}
                        whileTap={{ scale: 0.9 }}
                        className={`
                          ${digit === '' ? 'invisible' : ''}
                          ${digit === 'del' ? 'text-xs' : 'text-lg'}
                          h-9 w-9 rounded-full bg-white/20 backdrop-blur-md 
                          flex items-center justify-center text-white font-light
                          ${typeof digit === 'number' ? 'cursor-pointer' : ''}
                        `}
                        onClick={() => {
                          if (typeof digit === 'number') handlePinInput(digit.toString());
                          else if (digit === 'del') handleDelete();
                        }}
                      >
                        {digit === 'del' ? '⌫' : digit}
                      </motion.div>
                    ))}
                  </div>
                </div>
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
      <div className="mt-4 text-center text-white/70 text-sm">
        <p>{isLocked ? "Enter passcode: 696969" : "Swipe to preview games"}</p>
      </div>
      
      {/* Styles for text glow effects */}
      <style jsx global>{`
        .text-shadow-white {
          text-shadow: 0 0 3px rgba(255, 255, 255, 0.8),
                      0 0 5px rgba(255, 255, 255, 0.6),
                      0 0 8px rgba(255, 255, 255, 0.4);
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
