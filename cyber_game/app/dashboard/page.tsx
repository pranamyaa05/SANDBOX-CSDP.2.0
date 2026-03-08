"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [currentMeme, setCurrentMeme] = useState(0);
  const router = useRouter();

  // Meme tips array
  const memeTips = [
    { emoji: "🔐", text: "Your password is like your toothbrush - don't share it and change it regularly!" },
    { emoji: "🛡️", text: "Always update your software! It's like getting a new shield for your digital castle." },
    { emoji: "🎣", text: "If it smells phishy, it probably is! Don't click suspicious links." },
    { emoji: "🔑", text: "2FA is like having a secret handshake with your accounts." },
    { emoji: "💾", text: "Backup your data or cry later - the choice is yours!" },
  ];

  // Auto-rotate memes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMeme((prev) => (prev + 1) % memeTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [memeTips.length]);

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) {
      setName(user);
      
      // Set greeting based on time of day
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    }
    
    // Simulate loading state
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Mission progress stats
  const stats = {
    learnProgress: 35,
    gameLevel: 2,
    points: 450,
    badges: 3
  };

  const featureCards = [
    {
      title: "Learn",
      description: "Master cybersecurity concepts through interactive lessons",
      icon: "📚",
      color: "from-blue-500 to-cyan-500",
      href: "/learn",
      stats: `${stats.learnProgress}% complete`
    },
    {
      title: "Start Game",
      description: "Begin your mission to save your friend's compromised system",
      icon: "🎮",
      color: "from-green-500 to-emerald-500",
      href: "/game",
      stats: `Level ${stats.gameLevel}`
    },
    {
      title: "Points",
      description: "Track your achievements, stars, and badges",
      icon: "⭐",
      color: "from-yellow-500 to-orange-500",
      href: "/points",
      stats: `${stats.points} pts · ${stats.badges} badges`
    }
  ];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400">Loading your mission...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            {greeting}, {name || "Player"}! 👋
          </h1>
          <p className="text-gray-300 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Your mission is to help your friend recover their compromised system.
          </p>
        </div>
        
        {/* Quick Action Button */}
        <Link 
          href="/game" 
          className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-green-500/25 transition-all"
        >
          <span className="relative z-10 flex items-center gap-2 text-white font-semibold">
            Continue Mission
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </Link>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featureCards.map((card, index) => (
          <Link href={card.href} key={card.title}>
            <div className="group relative bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-green-600/30 hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/20 cursor-pointer overflow-hidden">
              
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              
              <h2 className="text-xl font-semibold mb-2 group-hover:text-green-400 transition-colors">
                {card.title}
              </h2>
              
              <p className="text-gray-400 text-sm mb-3">
                {card.description}
              </p>
              
              {/* Stats Badge */}
              <div className="inline-block px-3 py-1 bg-green-900/30 rounded-full text-xs text-green-400 border border-green-600/30">
                {card.stats}
              </div>
              
              {/* Hover Arrow */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-green-600/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-green-400 rounded-full"></span>
          Your Progress
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center text-green-400">
              📊
            </div>
            <div>
              <p className="text-sm text-gray-400">Learn Progress</p>
              <p className="text-xl font-bold text-green-400">{stats.learnProgress}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center text-green-400">
              🎯
            </div>
            <div>
              <p className="text-sm text-gray-400">Game Level</p>
              <p className="text-xl font-bold text-green-400">{stats.gameLevel}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center text-green-400">
              🏆
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Points</p>
              <p className="text-xl font-bold text-green-400">{stats.points}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meme Tip Section */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 p-6 rounded-xl border border-green-600/30 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="text-4xl transform group-hover:scale-110 transition-transform">
            {memeTips[currentMeme].emoji}
          </div>
          <div className="flex-1">
            <p className="text-sm text-green-400 mb-1">💡 Pro Tip</p>
            <p className="text-gray-200">
              {memeTips[currentMeme].text}
            </p>
          </div>
          <div className="flex gap-1">
            {memeTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMeme(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentMeme ? "w-4 bg-green-400" : "bg-gray-600"
                }`}
                aria-label={`Go to tip ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}