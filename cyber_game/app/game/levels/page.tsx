"use client";

import { levels } from "@/data/levels";
import LevelCard from "@/components/LevelCard";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LevelsPage() {
  const [isGlitching, setIsGlitching] = useState(false);
  const unlockedCount = levels.filter(l => l.unlocked).length;
  const totalCount = levels.length;
  const progress = (unlockedCount / totalCount) * 100;

  // Glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden px-4 py-12">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#22c55e15_0%,transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(#22c55e08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Glitch Overlay */}
      <div className={`absolute inset-0 bg-green-500/5 mix-blend-overlay transition-opacity duration-150 pointer-events-none ${isGlitching ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#22c55e05_50%,transparent_100%)] bg-[length:100%_8px] animate-scan pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header with Status */}
        <div className="text-center mb-12">
          {/* Status Bar */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900/80 border border-green-500/30 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400/70 text-sm font-mono tracking-wider">MISSION SELECTION</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Title with Glitch Effect */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 relative">
            <span className="absolute inset-0 text-green-400/20 animate-pulse">MISSION LEVELS</span>
            <span className="relative bg-gradient-to-r from-green-400 via-green-500 to-green-400 bg-clip-text text-transparent neon-text">
              MISSION LEVELS
            </span>
          </h1>

          <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto mb-6">
            Complete cybersecurity challenges to secure the system and earn rewards.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-xs font-mono text-green-400/70 mb-2">
              <span>SYSTEM SECURITY</span>
              <span>{unlockedCount}/{totalCount} COMPLETED</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-green-500/30">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,#ffffff20_50%,transparent_100%)] animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {levels.map((level) => (
            <LevelCard key={level.id} level={level} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{unlockedCount}</div>
            <div className="text-xs text-gray-500 font-mono">UNLOCKED</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{totalCount - unlockedCount}</div>
            <div className="text-xs text-gray-500 font-mono">LOCKED</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">500</div>
            <div className="text-xs text-gray-500 font-mono">MAX POINTS</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">3</div>
            <div className="text-xs text-gray-500 font-mono">BADGES</div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
          <Link
            href="/game"
            className="group relative overflow-hidden bg-slate-800 border-2 border-green-500/50 px-8 py-3 rounded-lg font-bold text-green-400 transition-all duration-300 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              BACK TO MISSION CONTROL
            </span>
          </Link>

          <Link
            href="/points"
            className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              VIEW REWARDS
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs font-mono text-green-400/30">
          <span>✦ CLASSIFIED • SECURE • ENCRYPTED ✦</span>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
}