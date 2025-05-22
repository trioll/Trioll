"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const SimpleRacer: React.FC = () => {
  const [position, setPosition] = useState(1); // 0: left, 1: center, 2: right
  const [score, setScore] = useState(0);

  const handleMoveLeft = () => {
    if (position > 0) {
      setPosition(position - 1);
    }
  };

  const handleMoveRight = () => {
    if (position < 2) {
      setPosition(position + 1);
    }
  };

  const handleScorePoint = () => {
    setScore(score + 1);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full text-white bg-gradient-to-b from-black to-gray-900 w-full">
      <div className="w-full bg-black/50 pt-4 pb-2 px-2">
        <h3 className="text-xl font-bold text-center">Simple Racer</h3>
        <p className="text-sm text-white/80 text-center">Score: {score}</p>
      </div>

      {/* Game board */}
      <div className="w-full flex-grow bg-gray-900 relative" style={{ objectFit: 'cover' }}>
        {/* Lanes */}
        <div className="flex h-full">
          <div className="flex-1 border-r border-white/20"></div>
          <div className="flex-1 border-r border-white/20"></div>
          <div className="flex-1"></div>
        </div>

        {/* Player car */}
        <motion.div
          className="absolute bottom-8 w-10 h-16 bg-red-500 rounded-md"
          animate={{
            x: position === 0 ? "25%" : position === 1 ? "50%" : "75%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ transform: "translateX(-50%)" }}
        ></motion.div>
      </div>

      {/* Controls */}
      <div className="w-full bg-black/70 py-4 px-2 flex justify-center gap-2">
        <button
          onClick={handleMoveLeft}
          className="px-3 py-2 bg-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-700 flex-1"
        >
          Left
        </button>
        <button
          onClick={handleScorePoint}
          className="px-3 py-2 bg-purple-600 rounded-md text-sm font-medium hover:bg-purple-700 flex-1"
        >
          Score
        </button>
        <button
          onClick={handleMoveRight}
          className="px-3 py-2 bg-pink-600 rounded-md text-sm font-medium hover:bg-pink-700 flex-1"
        >
          Right
        </button>
      </div>
    </div>
  );
};

export default SimpleRacer;
