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
    <div className="flex flex-col items-center justify-center h-full text-white">
      <h3 className="text-xl font-bold mb-2">Simple Racer</h3>
      <p className="text-sm text-white/80 mb-4">Score: {score}</p>

      {/* Game board */}
      <div className="w-full h-28 bg-gray-900 rounded-md mb-4 relative">
        {/* Lanes */}
        <div className="flex h-full">
          <div className="flex-1 border-r border-white/20"></div>
          <div className="flex-1 border-r border-white/20"></div>
          <div className="flex-1"></div>
        </div>

        {/* Player car */}
        <motion.div
          className="absolute bottom-2 w-8 h-12 bg-red-500 rounded-md"
          animate={{
            x: position === 0 ? "25%" : position === 1 ? "50%" : "75%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ transform: "translateX(-50%)" }}
        ></motion.div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleMoveLeft}
          className="px-3 py-2 bg-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Move Left
        </button>
        <button
          onClick={handleScorePoint}
          className="px-3 py-2 bg-purple-600 rounded-md text-sm font-medium hover:bg-purple-700"
        >
          Score Point
        </button>
        <button
          onClick={handleMoveRight}
          className="px-3 py-2 bg-pink-600 rounded-md text-sm font-medium hover:bg-pink-700"
        >
          Move Right
        </button>
      </div>
    </div>
  );
};

export default SimpleRacer;
