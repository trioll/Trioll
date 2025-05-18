"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleRacer from "@/components/SimpleRacer";

// Sample game data
const games = [
  {
    id: 1,
    title: "Space Explorer",
    color: "from-blue-600 to-indigo-900",
    description: "Explore the universe in this exciting space adventure game!",
  },
  {
    id: 2,
    title: "Fantasy Quest",
    color: "from-purple-600 to-pink-900",
    description: "Embark on an epic journey through magical realms.",
  },
  {
    id: 3,
    title: "Simple Racer",
    color: "from-red-500 to-amber-600",
    description: "Test your racing skills in this fast-paced game!",
    component: SimpleRacer,
  },
  {
    id: 4,
    title: "Puzzle Master",
    color: "from-emerald-500 to-teal-900",
    description: "Challenge your mind with intricate puzzles and brain teasers.",
  },
];

const GameCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Set a timeout to automatically advance the carousel
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      handleNext();
    } else if (touchEnd - touchStart > 100) {
      // Swipe right
      handlePrev();
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (!touchEnd) return;
    
    if (touchStart - touchEnd > 100) {
      // Drag left
      handleNext();
    } else if (touchEnd - touchStart > 100) {
      // Drag right
      handlePrev();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  const renderGameContent = (game: typeof games[0]) => {
    if (game.id === 3 && game.component) {
      const GameComponent = game.component;
      return <GameComponent />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className={`w-full h-40 mb-4 bg-gradient-to-br ${game.color} rounded-md flex items-center justify-center`}>
          <span className="text-white/90 font-bold text-2xl">{game.title.substring(0, 1)}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{game.title}</h3>
        <p className="text-sm text-white/80 text-center">{game.description}</p>
      </div>
    );
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-black/20 rounded-[36px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 w-full h-full p-4"
        >
          {renderGameContent(games[currentIndex])}
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {games.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex
                ? "bg-white"
                : "bg-white/30"
            }`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GameCarousel;
