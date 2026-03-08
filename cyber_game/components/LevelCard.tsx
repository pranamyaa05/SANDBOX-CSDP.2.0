"use client";

import Link from "next/link";
import { useState } from "react";

type Level = {
  id: number;
  title: string;
  unlocked: boolean;
};

export default function LevelCard({ level }: { level: Level }) {
  const [isHovered, setIsHovered] = useState(false);

  // Difficulty based on level id
  const getDifficulty = (id: number) => {
    if (id <= 3) return { label: "BEGINNER", color: "text-green-400" };
    if (id <= 6) return { label: "INTERMEDIATE", color: "text-yellow-400" };
    return { label: "ADVANCED", color: "text-red-400" };
  };

  const difficulty = getDifficulty(level.id);

  if (!level.unlocked) {
    return (
      <div className="group relative bg-slate-900/90 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 text-center overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#22c55e05,transparent_70%)]"></div>
        
        {/* Lock Icon Animation */}
        <div className="relative mb-4">
          <div className="text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
            🔒
          </div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>

        {/* Level Number */}
        <div className="text-sm font-mono text-gray-600 mb-2">
          LEVEL #{level.id.toString().padStart(2, '0')}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-3 text-gray-500">
          {level.title}
        </h2>

        {/* Difficulty Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs text-gray-600">DIFFICULTY:</span>
          <span className={`text-xs font-mono ${difficulty.color} opacity-50`}>
            {difficulty.label}
          </span>
        </div>

        {/* Locked Badge */}
        <div className="inline-block px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
          <span className="text-gray-500 text-sm font-mono">🔒 CLASSIFIED</span>
        </div>

        {/* Overlay Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(#22c55e05_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    );
  }

  return (
    <Link href={`/game/level/${level.id}`}>
      <div 
        className="group relative bg-slate-900/90 backdrop-blur-sm p-6 rounded-xl border-2 border-green-500/30 hover:border-green-400 transition-all duration-300 text-center cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-green-500/20 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Background Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(#22c55e10_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>

        {/* Top Right Status */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-mono text-green-500/70">ACTIVE</span>
        </div>

        {/* Level Icon */}
        <div className="relative mb-4">
          <div className="text-5xl mb-2 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            {level.id === 1 && "🔐"}
            {level.id === 2 && "🎣"}
            {level.id === 3 && "🔑"}
            {level.id === 4 && "🌐"}
            {level.id === 5 && "💉"}
            {level.id === 6 && "🦠"}
            {level.id === 7 && "💰"}
            {level.id === 8 && "☁️"}
            {level.id === 9 && "🎭"}
            {level.id === 10 && "🏴"}
          </div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
        </div>

        {/* Level Number */}
        <div className="text-sm font-mono text-green-500/70 mb-2">
          LEVEL #{level.id.toString().padStart(2, '0')}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-3 text-white group-hover:text-green-400 transition-colors">
          {level.title}
        </h2>

        {/* Difficulty Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs text-gray-500">DIFFICULTY:</span>
          <span className={`text-xs font-mono px-2 py-1 rounded-full ${
            difficulty.label === 'BEGINNER' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            difficulty.label === 'INTERMEDIATE' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {difficulty.label}
          </span>
        </div>

        {/* Points */}
        <div className="flex items-center justify-center gap-1 text-sm text-green-400/70 mb-4">
          <span className="text-yellow-400">⭐</span>
          <span>{level.id * 100} POINTS</span>
        </div>

        {/* Start Button */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
          <button className="relative w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-mono text-sm font-bold transform group-hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
            <span>INITIATE MISSION</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Hover Effect Arrow */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}