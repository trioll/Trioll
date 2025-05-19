"use client";

import Image from "next/image";
import { motion, useAnimate } from 'framer-motion';
import { useEffect, useState } from 'react';
import InteractiveBackground from "@/components/InteractiveBackground";
import ContactForm from "@/components/ContactForm";
import IPhoneFrame from "@/components/IPhoneFrame";

// This WordWithGlow component is replaced by direct motion.span usage
// but keeping the code commented for reference
/*
interface WordWithGlowProps {
  children: React.ReactNode;
  className?: string;
}

const WordWithGlow = ({ children, className = "" }: WordWithGlowProps) => {
  // Define hover animation
  const hoverAnimation = {
    scale: 1.1,
    y: -2,
    textShadow: "0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.3)"
  };

  // Define classes for normal and highlighted states
  const normalClass = `${className} text-shadow-subtle inline-block`;  
  
  return (
    <motion.span
      className={normalClass}
      whileHover={hoverAnimation}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 10,
        textShadow: { type: "tween", duration: 0.2 }
      }}
    >
      {children}
    </motion.span>
  );
};
*/

// Function to generate CSS color values for the glow animation
const generateColorWheelValues = () => {
  const colors = [];
  
  // Start with blue
  colors.push('rgba(0, 100, 255, 0.7)');
  
  // Generate colors across the wheel (hue values from 240 to 600 degrees)
  for (let i = 240; i <= 600; i += 20) {
    const h = i % 360;
    colors.push(`hsla(${h}, 100%, 50%, 0.7)`);
  }
  
  // Return to blue to complete the cycle
  colors.push('rgba(0, 100, 255, 0.7)');
  
  return colors;
};

const HomePage = () => {
  
  // State to track if animation should start
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  // Refs for animations
  const [scope, animate] = useAnimate();
  const [headerRef] = useAnimate();
  const [glow1Ref, animateGlow1] = useAnimate();
  const [glow2Ref, animateGlow2] = useAnimate();
  const [glow3Ref, animateGlow3] = useAnimate();
  
  // Colors for the glow animation
  const colorWheelValues = generateColorWheelValues();
  
  // Start animations immediately 
  useEffect(() => {
    // Set up initial state
    setTimeout(() => {
      setShouldAnimate(true);
    }, 800);
    
    return () => {};
  }, []);
  
  // Start the floating glow animation when shouldAnimate is true
  useEffect(() => {
    if (shouldAnimate && glow1Ref.current && glow2Ref.current && glow3Ref.current) {
      // Make the text a bit more visible by giving it a subtle shadow
      animate(scope.current, {
        textShadow: "0 0 1px rgba(0, 0, 0, 0.7), 0 0 2px rgba(0, 0, 0, 0.3)"
      }, { duration: 0.5 });
      
      // Animate glow 1 - from logo to TRIOLL text
      animateGlow1(glow1Ref.current, {
        x: ['calc(100% - 100px)', '50%', '10%', '0%', '20%', '50%', 'calc(100% - 100px)'],
        y: ['30%', '10%', '40%', '50%', '20%', '10%', '30%'],
        scale: [1, 1.2, 0.9, 1.3, 0.8, 1.1, 1],
        filter: [
          'blur(15px) grayscale(1)',
          'blur(20px) grayscale(1) brightness(1.2)',
          'blur(25px) grayscale(1) brightness(0.9)',
          'blur(15px) grayscale(1) brightness(1.1)',
          'blur(20px) grayscale(1)',
        ],
        opacity: [0.7, 0.5, 0.8, 0.6, 0.7, 0.5, 0.7]
      }, {
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
      });
      
      // Animate glow 2 - from TRIOLL text to logo
      animateGlow2(glow2Ref.current, {
        x: ['10%', '30%', '70%', '90%', '60%', '40%', '10%'],
        y: ['20%', '50%', '10%', '30%', '60%', '20%', '20%'],
        scale: [0.9, 1.1, 0.8, 1.3, 0.9, 1.2, 0.9],
        filter: [
          'blur(20px) grayscale(1) brightness(0.8)',
          'blur(15px) grayscale(1) brightness(1.3)',
          'blur(25px) grayscale(1)',
          'blur(20px) grayscale(1) brightness(1.2)',
          'blur(15px) grayscale(1) brightness(0.9)',
        ],
        opacity: [0.6, 0.8, 0.5, 0.7, 0.6, 0.8, 0.6]
      }, {
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut",
      });
      
      // Animate glow 3 - behind the tagline text
      animateGlow3(glow3Ref.current, {
        scale: [1, 1.15, 0.95, 1.1, 1],
        filter: [
          'blur(25px) grayscale(1) opacity(0.6)',
          'blur(20px) grayscale(1) opacity(0.8)',
          'blur(30px) grayscale(1) opacity(0.5)',
          'blur(15px) grayscale(1) opacity(0.7)',
          'blur(25px) grayscale(1) opacity(0.6)',
        ],
      }, {
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
      });
    }
  }, [shouldAnimate, animate, animateGlow1, animateGlow2, animateGlow3, colorWheelValues, scope, glow1Ref, glow2Ref, glow3Ref]);
  
  return (
    <>
      <InteractiveBackground />
      
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
        {/* Floating glow effects that aren't cut off by container */}
        <div className="fixed top-0 left-0 right-0 h-32 overflow-visible z-30 pointer-events-none">
          {/* Glow 1 - floating from logo to TRIOLL text */}
          <div 
            ref={glow1Ref}
            className="absolute w-[300px] h-[80px] rounded-full mix-blend-screen pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(180, 180, 180, 0.7) 0%, rgba(180, 180, 180, 0.1) 70%)',
              filter: 'blur(15px)',
              top: '20px',
              right: '80px',
            }}
          />
          
          {/* Glow 2 - floating from TRIOLL text to logo */}
          <div 
            ref={glow2Ref}
            className="absolute w-[250px] h-[70px] rounded-full mix-blend-screen pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(220, 220, 220, 0.6) 0%, rgba(220, 220, 220, 0.1) 70%)',
              filter: 'blur(20px)',
              top: '25px',
              left: '50px',
            }}
          />
          
          {/* Glow 3 - hovering behind the tagline text */}
          <div 
            ref={glow3Ref}
            className="absolute w-[400px] h-[90px] rounded-full mix-blend-screen pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(200, 200, 200, 0.5) 0%, rgba(200, 200, 200, 0.1) 70%)',
              filter: 'blur(25px)',
              top: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: -1
            }}
          />
        </div>
        
        {/* Header section with TRIOLL text, tagline, and logo */}
        <div ref={headerRef} className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-20">
          {/* TRIOLL title aligned to top left */}
          <div className="flex flex-col items-start justify-center">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold tracking-wider cursor-pointer mb-1"
              whileHover={{ 
                scale: 1.05, 
                textShadow: "0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6), 0 0 15px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                textShadow: [
                  "0 0 1px rgba(0, 0, 0, 0.4), 0 0 2px rgba(0, 0, 0, 0.3), 0 0 3px rgba(0, 0, 0, 0.2)", 
                  "0 0 2px rgba(0, 0, 0, 0.5), 0 0 3px rgba(0, 0, 0, 0.4), 0 0 4px rgba(0, 0, 0, 0.3)",
                  "0 0 1px rgba(0, 0, 0, 0.4), 0 0 2px rgba(0, 0, 0, 0.3), 0 0 3px rgba(0, 0, 0, 0.2)"
                ]
              }}
              transition={{ 
                textShadow: { repeat: Infinity, duration: 2 },
                scale: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              <span className="relative z-10 text-black">
                TRIOLL
              </span>
            </motion.h1>
          </div>
          
          {/* Tagline centered in the middle */}
          <div className="flex-1 flex items-center justify-center">
            <div 
              ref={scope}
              className="text-base md:text-lg text-black/90 font-medium tracking-wide flex space-x-1 blur-[0.3px]"
            >
              {['Level', 'Up', 'Your', 'Game', 'Discovery'].map((word, index) => (
                <motion.span 
                  key={index} 
                  className="inline-block"
                  whileHover={{
                    scale: 1.1,
                    y: -2,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 10,
                  }}
                >
                  {word}{index < 4 ? '' : '.'}
                </motion.span>
              ))}
            </div>
          </div>
          
          {/* Logo aligned to top right */}
          <motion.div
            whileHover={{ 
              scale: 1.05,
              filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              filter: { type: "tween", duration: 0.2 },
              scale: { type: "spring", stiffness: 400, damping: 10 }
            }}
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
        </div>
        
        <div className="container mx-auto flex flex-col items-center max-w-6xl mt-20 pt-10">
          
          {/* iPhone Game Preview */}
          <div className="w-full my-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <IPhoneFrame />
            </motion.div>
          </div>
          
          {/* Contact Form - Added spacer to ensure scroll triggers */}
          <div className="w-full max-w-lg mb-60">
            <div className="h-96"></div>
            <ContactForm />
          </div>
        </div>
        
        <footer className="mt-16 text-black/60 text-sm text-center">
          © {new Date().getFullYear()} TRIOLL. All rights reserved.
        </footer>
      </div>
      
      {/* Global styles for text shadows on light background */}
      <style jsx global>{`
        .text-shadow-glow-dark {
          font-weight: 700;
          text-shadow: 0 0 1px rgba(0, 0, 0, 0.4),
                      0 0 2px rgba(0, 0, 0, 0.3),
                      0 0 3px rgba(0, 0, 0, 0.2);
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

        .white-glow-hover:hover {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.7),
                      0 0 10px rgba(255, 255, 255, 0.5),
                      0 0 15px rgba(255, 255, 255, 0.3);
          transition: text-shadow 0.2s ease;
        }
      `}</style>
    </>
  );
};

export default HomePage;
