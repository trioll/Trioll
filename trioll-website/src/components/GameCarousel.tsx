"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleRacer from "@/components/SimpleRacer";

// Sample game data with better descriptions
const games = [
  {
    id: 1,
    title: "Space Explorer",
    color: "from-blue-600 to-indigo-900",
    description: "Navigate through asteroid fields and discover new worlds in this thrilling space adventure.",
    icon: "🚀",
  },
  {
    id: 2,
    title: "Fantasy Quest",
    color: "from-purple-600 to-pink-900",
    description: "Embark on an epic journey through magical realms filled with mythical creatures.",
    icon: "⚔️",
  },
  {
    id: 3,
    title: "Simple Racer",
    color: "from-red-500 to-amber-600",
    description: "Experience high-speed racing action with intuitive controls and dynamic gameplay.",
    component: SimpleRacer,
    icon: "🏎️",
  },
  {
    id: 4,
    title: "Puzzle Master",
    color: "from-emerald-500 to-teal-900",
    description: "Challenge your mind with increasingly complex puzzles and brain-bending challenges.",
    icon: "🧩",
  },
  {
    id: 5,
    title: "Ocean Depths",
    color: "from-cyan-500 to-blue-800",
    description: "Dive deep into mysterious underwater worlds and uncover hidden treasures.",
    icon: "🌊",
  },
];

const GameCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentIndex, isAutoPlaying]);

  // Pause auto-play when user interacts
  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume after 8 seconds
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    pauseAutoPlay();
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex, pauseAutoPlay]);

  // Improved swipe detection
  const handleDragEnd = useCallback((event: any, info: any) => {
    const threshold = 50;
    pauseAutoPlay();

    if (info.offset.x > threshold) {
      handlePrev();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  }, [handleNext, handlePrev, pauseAutoPlay]);

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const renderGameContent = (game: typeof games[0]) => {
    if (game.id === 3 && game.component) {
      const GameComponent = game.component;
      return (
        <div className="w-full h-full">
          <GameComponent />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        {/* Game preview area */}
        <motion.div 
          className={`w-full h-32 mb-4 bg-gradient-to-br ${game.color} rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full"></div>
            <div className="absolute top-6 right-4 w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-4 left-6 w-3 h-3 bg-white/25 rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/20 rounded-full"></div>
          </div>
          
          {/* Game icon */}
          <motion.div
            className="text-4xl filter drop-shadow-lg"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {game.icon}
          </motion.div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                }}
                animate={{
                  y: [-10, -20, -10],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Game info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold mb-2 text-white">{game.title}</h3>
          <p className="text-sm text-white/80 leading-relaxed px-2">{game.description}</p>
        </motion.div>

        {/* Try Now button */}
        <motion.button
          className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30"
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderColor: 'rgba(255,255,255,0.5)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={pauseAutoPlay}
        >
          Try Now
        </motion.button>
      </div>
    );
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-black rounded-[32px]">
      {/* Main carousel area */}
      <div className="relative w-full h-full">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.5
            }}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'pan-y' }}
          >
            {renderGameContent(games[currentIndex])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => { handlePrev(); pauseAutoPlay(); }}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
        aria-label="Previous game"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>

      <button
        onClick={() => { handleNext(); pauseAutoPlay(); }}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
        aria-label="Next game"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
        {games.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: index === currentIndex ? 1.25 : 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to ${games[index].title}`}
          />
        ))}
      </div>

      {/* Progress indicator */}
      {isAutoPlaying && (
        <div className="absolute top-2 left-2 right-2 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white/60 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
            key={currentIndex}
          />
        </div>
      )}

      {/* Game counter */}
      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs font-medium">
        {currentIndex + 1} / {games.length}
      </div>
    </div>
  );
};

export default GameCarousel;
