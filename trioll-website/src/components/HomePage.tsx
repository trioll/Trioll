"use client";

import Image from "next/image";
import { motion } from 'framer-motion';
import InteractiveBackground from "@/components/InteractiveBackground";
import ContactForm from "@/components/ContactForm";
import IPhoneFrame from "@/components/IPhoneFrame";

// Type for the WordWithGlow component props
interface WordWithGlowProps {
  children: React.ReactNode;
  className?: string;
}

const WordWithGlow = ({ children, className = "" }: WordWithGlowProps) => {
  // Define hover animation
  const hoverAnimation = {
    scale: 1.1,
    y: -2
  };

  // Define classes for normal and highlighted states
  const normalClass = `${className} text-shadow-subtle inline-block`;  
  
  return (
    <motion.span
      className={normalClass}
      whileHover={hoverAnimation}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.span>
  );
};

const HomePage = () => {
  return (
    <>
      <InteractiveBackground />
      
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
        {/* Header section with TRIOLL text, tagline, and logo */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-20">
          {/* TRIOLL title aligned to top left */}
          <div className="flex flex-col items-start justify-center">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold tracking-wider cursor-pointer mb-1"
              whileHover={{ scale: 1.05 }}
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
            <div className="text-sm md:text-base text-black/85 font-light tracking-wide flex space-x-1">
              {['Level', 'Up', 'Your', 'Game', 'Discovery'].map((word, index) => (
                <WordWithGlow key={index} className="">
                  {word}{index < 4 ? '' : '.'}
                </WordWithGlow>
              ))}
            </div>
          </div>
          
          {/* Logo aligned to top right */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
          
          {/* Contact Form */}
          <div className="w-full max-w-lg">
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
      `}</style>
    </>
  );
};

export default HomePage;
