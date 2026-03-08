"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LevelPage() {
  const params = useParams();
  const levelId = params.id;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Level-specific content
  const levelContent: Record<number, { concept: string; tip: string; audioSrc: string }> = {
    1: {
      concept: "Password Security - Learn how to create strong passwords and protect against brute force attacks.",
      tip: "Use a mix of uppercase, lowercase, numbers, and symbols. Never reuse passwords!",
      audioSrc: "/sounds/password-security.mp3"
    },
    2: {
      concept: "Phishing Detection - Identify fake emails and websites designed to steal your credentials.",
      tip: "Always check the sender's email address and hover over links before clicking.",
      audioSrc: "/sounds/phishing-detection.mp3"
    },
    3: {
      concept: "Secure Login System - Implement multi-factor authentication and secure session management.",
      tip: "Enable 2FA whenever possible. It adds an extra layer of security!",
      audioSrc: "/sounds/secure-login.mp3"
    },
    4: {
      concept: "Network Intrusion - Understand how attackers scan and exploit network vulnerabilities.",
      tip: "Keep your firewall enabled and regularly update your network equipment.",
      audioSrc: "/sounds/network-intrusion.mp3"
    },
    5: {
      concept: "SQL Injection - Learn how attackers manipulate databases through insecure input fields.",
      tip: "Always use parameterized queries and input validation!",
      audioSrc: "/sounds/sql-injection.mp3"
    },
    6: {
      concept: "Malware Infection - Discover how trojans, worms, and viruses compromise systems.",
      tip: "Don't download files from untrusted sources. Keep your antivirus updated.",
      audioSrc: "/sounds/malware.mp3"
    },
    7: {
      concept: "Ransomware Attack - Understand how attackers encrypt files and demand payment.",
      tip: "Regularly backup your data. Never pay the ransom!",
      audioSrc: "/sounds/ransomware.mp3"
    },
    8: {
      concept: "Cloud Security - Learn about shared responsibility models and cloud misconfigurations.",
      tip: "Always review cloud permissions and enable encryption at rest.",
      audioSrc: "/sounds/cloud-security.mp3"
    },
    9: {
      concept: "Social Engineering - Understand psychological manipulation tactics used by attackers.",
      tip: "Verify identities before sharing sensitive information. Trust your instincts!",
      audioSrc: "/sounds/social-engineering.mp3"
    },
    10: {
      concept: "Capture The Flag - Apply all your knowledge in this final challenge!",
      tip: "Think like a hacker to defend like a pro. Good luck!",
      audioSrc: "/sounds/ctf.mp3"
    }
  };

  const content = levelContent[Number(levelId)] || levelContent[1];

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
      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          {/* Status Bar */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900/80 border border-green-500/30 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400/70 text-sm font-mono tracking-wider">
              LEVEL {levelId} • MISSION BRIEFING
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 relative">
            <span className="absolute inset-0 text-green-400/20 animate-pulse">
              LEVEL {levelId}
            </span>
            <span className="relative bg-gradient-to-r from-green-400 via-green-500 to-green-400 bg-clip-text text-transparent neon-text">
              LEVEL {levelId}
            </span>
          </h1>

          <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto">
            Listen to the cybersecurity concept before starting the challenge.
          </p>
        </div>

        {/* Main Card */}
        <div className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-green-500/30 rounded-xl p-8">
            
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-green-500/30">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-green-400/50 text-sm font-mono flex-1 text-center">
                mission_briefing.sh
              </span>
              <span className="text-green-400 text-xs">● ACTIVE</span>
            </div>

            {/* Concept Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-400 text-xl">📡</span>
                <h2 className="text-2xl font-bold text-green-400">
                  CONCEPT EXPLANATION
                </h2>
              </div>
              
              <div className="bg-slate-950/80 border border-green-500/20 rounded-lg p-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {content.concept}
                </p>
                
                {/* Tip Box */}
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">💡</span>
                    <div>
                      <span className="text-green-400 text-sm font-mono block mb-1">
                        PRO TIP:
                      </span>
                      <p className="text-gray-400">
                        {content.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Player Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-400 text-xl">🎧</span>
                <h2 className="text-2xl font-bold text-green-400">
                  AUDIO BRIEFING
                </h2>
              </div>

              <div className="bg-slate-950/80 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-mono text-green-400/70">
                    LESSON #{levelId}.mp3
                  </span>
                  <span className="text-xs text-gray-500">
                    {isPlaying ? 'PLAYING' : 'READY'}
                  </span>
                </div>

                <audio 
                  controls 
                  className="w-full audio-player"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={content.audioSrc} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>

                {/* Audio Visualizer (when playing) */}
                {isPlaying && (
                  <div className="mt-4 flex items-center justify-center gap-1 h-8">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-green-400 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 30 + 10}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={`/game/simulation/${levelId}`}
                className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 hover:scale-105 flex-1"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>🚀</span>
                  START SIMULATION
                  <span>→</span>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </Link>

              <Link
                href="/game/levels"
                className="group relative overflow-hidden bg-slate-800 border-2 border-green-500/50 px-8 py-4 rounded-lg font-bold text-green-400 transition-all duration-300 hover:bg-slate-700 hover:border-green-400 hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>←</span>
                  BACK TO LEVELS
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 text-center text-xs font-mono text-green-400/30">
          <span>✦ CLASSIFIED • MISSION BRIEFING • ENCRYPTED ✦</span>
        </div>
      </div>

      {/* Custom Audio Player Styles */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        
        /* Custom audio player styling */
        .audio-player {
          filter: hue-rotate(100deg) brightness(1.2);
        }
        
        .audio-player::-webkit-media-controls-panel {
          background-color: #0f172a;
          border: 1px solid #22c55e30;
        }
        
        .audio-player::-webkit-media-controls-play-button {
          background-color: #22c55e;
          border-radius: 50%;
        }
        
        .audio-player::-webkit-media-controls-timeline {
          background-color: #1e293b;
          border-radius: 4px;
          height: 4px;
        }
      `}</style>
    </div>
  );
}