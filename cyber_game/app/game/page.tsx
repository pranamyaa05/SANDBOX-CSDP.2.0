"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RansomwareAttackScene from "@/components/RansomwareAttackScene";
import NetworkIntrusionScene from "@/components/NetworkIntrusionScene";
import PasswordSecurityScene from "@/components/PasswordSecurityScene";
import PhishingEmailScene from "@/components/PhishingEmailScene";
import SQLInjectionScene from "@/components/SQLInjectionScene";
import FakeAlerts from "@/components/FakeAlerts";
import Hintsdrawer from "@/components/Hintsdrawer";

export default function GameHome() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [scene1Active, setScene1Active] = useState(false);
  const [scene2Active, setScene2Active] = useState(false);
  const [scene3Active, setScene3Active] = useState(false);
  const [scene4Active, setScene4Active] = useState(false);
  const [scene5Active, setScene5Active] = useState(false);

  const anySceneActive =
    scene1Active || scene2Active || scene3Active || scene4Active || scene5Active;

  function collectHint(h: string) {
    setHints((prev) => (prev.includes(h) ? prev : [...prev, h]));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const allLevelsComplete =
    hints.filter((h) => !h.includes("[Player Note]")).length >= 5;

  return (
    <div className="relative min-h-screen w-full bg-[#070c07] overflow-hidden">

      {/* GAME MAP */}
      <div
        style={{
          opacity: anySceneActive ? 0 : 1,
          pointerEvents: anySceneActive ? "none" : "all",
          transition: "opacity 0.3s ease",
          position: "relative",
          minHeight: "100vh",
          width: "100%",
        }}
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#22c55e10_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_#3b82f608_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#22c55e08_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

        {isGlitching && (
          <div className="absolute inset-0 z-10 pointer-events-none opacity-10
            bg-[repeating-linear-gradient(0deg,_transparent,_transparent_2px,_#22c55e_2px,_#22c55e_4px)]"
          />
        )}

        {/* LEVEL 1 */}
        <div className="absolute bottom-24 right-12 w-80 h-52 rounded-lg overflow-hidden"
          style={{
            border: "1px solid rgba(0,200,255,0.15)",
            background: "rgba(0,0,0,0.75)",
            boxShadow: "0 0 28px rgba(0,200,255,0.06)",
          }}>
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 py-1"
            style={{ background: "rgba(0,0,0,0.9)", borderBottom: "1px solid rgba(0,200,255,0.1)" }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-900 uppercase">
              WS-03 — Endpoint Terminal
            </span>
          </div>

          <div className="w-full h-full pt-6 flex items-center justify-center">
            <button
              onClick={() => setScene1Active(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                background: "#1a0000",
                border: "2px solid #ff2200",
                color: "#ff2200",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                textTransform: "uppercase",
                animation: "alertPulse1 1.5s infinite",
              }}
            >
              <span style={{ animation: "blinkIcon 0.8s step-end infinite" }}>⚠</span>
              SECURITY ALERT
            </button>
          </div>
        </div>

        {/* LEVEL 2 */}
        <div className="absolute bottom-24 left-12 w-80 h-52 rounded-lg overflow-hidden"
          style={{
            border: "1px solid rgba(255,120,0,0.15)",
            background: "rgba(0,0,0,0.75)",
            boxShadow: "0 0 28px rgba(255,120,0,0.06)",
          }}>
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 py-1"
            style={{ background: "rgba(0,0,0,0.9)", borderBottom: "1px solid rgba(255,120,0,0.1)" }}>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-orange-900 uppercase">
              NET-MON — Traffic Analyzer
            </span>
          </div>

          <div className="w-full h-full pt-6 flex items-center justify-center">
            <button
              onClick={() => setScene2Active(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                background: "#1a0800",
                border: "2px solid #ff6600",
                color: "#ff6600",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                textTransform: "uppercase",
                animation: "alertPulse2 1.5s infinite",
              }}
            >
              <span style={{ animation: "blinkIcon 0.8s step-end infinite" }}>⚠</span>
              NETWORK ALERT
            </button>
          </div>
        </div>

        {/* LEVEL 3 */}
        <div className="absolute bottom-24 rounded-lg overflow-hidden"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            width: 320,
            height: 208,
            border: "1px solid rgba(68,102,255,0.2)",
            background: "rgba(0,0,0,0.75)",
            boxShadow: "0 0 28px rgba(68,102,255,0.08)",
          }}>
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 py-1"
            style={{ background: "rgba(0,0,0,0.9)", borderBottom: "1px solid rgba(68,102,255,0.15)" }}>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "#334" }}>
              CORP-SYS — Access Control
            </span>
          </div>

          <div className="w-full h-full pt-6 flex items-center justify-center">
            <button
              onClick={() => setScene3Active(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                background: "#080814",
                border: "2px solid #4466ff",
                color: "#4466ff",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                textTransform: "uppercase",
                animation: "alertPulse3 1.5s infinite",
              }}
            >
              <span style={{ animation: "blinkIcon 0.8s step-end infinite" }}>🔐</span>
              PASSWORD ALERT
            </button>
          </div>
        </div>

        {/* LEVEL 4 */}
        <div className="absolute top-24 rounded-lg overflow-hidden"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            width: 320,
            height: 208,
            border: "1px solid rgba(255,204,0,0.2)",
            background: "rgba(0,0,0,0.75)",
            boxShadow: "0 0 28px rgba(255,204,0,0.08)",
          }}>
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 py-1"
            style={{ background: "rgba(0,0,0,0.9)", borderBottom: "1px solid rgba(255,204,0,0.15)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ffcc00" }} />
            <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "#554400" }}>
              MAIL-SRV-01 — Corporate Inbox
            </span>
          </div>

          <div className="w-full h-full pt-6 flex items-center justify-center">
            <button
              onClick={() => setScene4Active(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                background: "#141000",
                border: "2px solid #ffcc00",
                color: "#ffcc00",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                textTransform: "uppercase",
                animation: "alertPulse4 1.5s infinite",
              }}
            >
              <span style={{ animation: "blinkIcon 0.8s step-end infinite" }}>📧</span>
              EMAIL ALERT
            </button>
          </div>
        </div>

        {/* LEVEL 5 */}
        <div className="absolute top-24 right-12 w-80 h-52 rounded-lg overflow-hidden"
          style={{
            border: "1px solid rgba(153,51,255,0.2)",
            background: "rgba(0,0,0,0.75)",
            boxShadow: "0 0 28px rgba(153,51,255,0.08)",
          }}>
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 py-1"
            style={{ background: "rgba(0,0,0,0.9)", borderBottom: "1px solid rgba(153,51,255,0.15)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#9933ff" }} />
            <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "#441166" }}>
              DB-SRV-01 — Database Terminal
            </span>
          </div>

          <div className="w-full h-full pt-6 flex items-center justify-center">
            <button
              onClick={() => setScene5Active(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                background: "#0d0018",
                border: "2px solid #9933ff",
                color: "#9933ff",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                textTransform: "uppercase",
                animation: "alertPulse5 1.5s infinite",
              }}
            >
              <span style={{ animation: "blinkIcon 0.8s step-end infinite" }}>💉</span>
              DB BREACH
            </button>
          </div>
        </div>

      </div>

      <FakeAlerts active={!anySceneActive} />

      <Hintsdrawer hints={hints} allLevelsComplete={allLevelsComplete} />

      {scene1Active && (
        <RansomwareAttackScene onHintCollected={collectHint} onActiveChange={(active:boolean)=>setScene1Active(active)} />
      )}

      {scene2Active && (
        <NetworkIntrusionScene onHintCollected={collectHint} onActiveChange={(active:boolean)=>setScene2Active(active)} />
      )}

      {scene3Active && (
        <PasswordSecurityScene onHintCollected={collectHint} onActiveChange={(active:boolean)=>setScene3Active(active)} />
      )}

      {scene4Active && (
        <PhishingEmailScene onHintCollected={collectHint} onActiveChange={(active:boolean)=>setScene4Active(active)} />
      )}

      {scene5Active && (
        <SQLInjectionScene onHintCollected={collectHint} onActiveChange={(active:boolean)=>setScene5Active(active)} />
      )}

      <style>{`
        @keyframes alertPulse1 {0%,100%{box-shadow:0 0 8px #ff2200;}50%{box-shadow:0 0 24px #ff4400,0 0 48px #ff220033;}}
        @keyframes alertPulse2 {0%,100%{box-shadow:0 0 8px #ff6600;}50%{box-shadow:0 0 24px #ff8800,0 0 48px #ff660033;}}
        @keyframes alertPulse3 {0%,100%{box-shadow:0 0 8px #4466ff;}50%{box-shadow:0 0 24px #6688ff,0 0 48px #4466ff33;}}
        @keyframes alertPulse4 {0%,100%{box-shadow:0 0 8px #ffcc00;}50%{box-shadow:0 0 24px #ffdd44,0 0 48px #ffcc0033;}}
        @keyframes alertPulse5 {0%,100%{box-shadow:0 0 8px #9933ff;}50%{box-shadow:0 0 24px #bb55ff,0 0 48px #9933ff33;}}
        @keyframes blinkIcon {0%,100%{opacity:1;}50%{opacity:0;}}
      `}</style>
    
    </div>
  );
}