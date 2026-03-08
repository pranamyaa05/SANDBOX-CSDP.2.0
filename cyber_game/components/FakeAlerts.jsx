"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// Pool of distraction messages
const ALERT_MESSAGES = [
  { icon: "⚠", label: "ANOMALY DETECTED",      sub: "Sector 7-G",         color: "#ff4400" },
  { icon: "🔴", label: "INTRUSION ATTEMPT",     sub: "Port 8443",          color: "#cc0000" },
  { icon: "📡", label: "SIGNAL INTERCEPT",      sub: "Frequency 2.4GHz",   color: "#ff6600" },
  { icon: "💀", label: "VIRUS SIGNATURE FOUND", sub: "File: sys32.tmp",    color: "#ff2200" },
  { icon: "⚡", label: "POWER SURGE",           sub: "Node B-12",          color: "#ffaa00" },
  { icon: "🔓", label: "AUTH FAILURE",          sub: "Admin Portal",       color: "#cc4400" },
  { icon: "📶", label: "ROGUE AP DETECTED",     sub: "SSID: Corp_Guest",   color: "#ff5500" },
  { icon: "🧬", label: "PAYLOAD SIGNATURE",     sub: "Hash mismatch",      color: "#dd3300" },
  { icon: "🛰", label: "BEACON PING",           sub: "External IP",        color: "#ff8800" },
  { icon: "🔥", label: "FIREWALL BREACH",       sub: "Rule 0x3F bypassed", color: "#ff3300" },
  { icon: "👁", label: "SURVEILLANCE ACTIVE",   sub: "CAM-09 offline",     color: "#cc2200" },
  { icon: "💾", label: "DATA EXFILTRATION",     sub: "2.3 GB outbound",    color: "#ff4422" },
];

let idCounter = 0;

export default function FakeAlerts({ active }) {
  const [alerts, setAlerts]   = useState([]);
  const spawnRef              = useRef(null);
  const audioCtxRef           = useRef(null);

  // Lazy-init AudioContext on first interaction or spawn
  function getAudioCtx() {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  // Short 8-bit style beep
  const playBeep = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type            = "square";
      osc.frequency.value = 880 + Math.random() * 440;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.18);
    } catch (_) {}
  }, []);

  // Spawn one fake alert at a random screen position
  const spawnAlert = useCallback(() => {
    const msg = ALERT_MESSAGES[Math.floor(Math.random() * ALERT_MESSAGES.length)];
    const id  = ++idCounter;

    // Keep away from edges and top-right corner (where Investigation Board lives)
    const x = 4 + Math.random() * 58;   // 4% – 62% from left  (avoids right side)
    const y = 10 + Math.random() * 65;  // 10% – 75% from top

    // Random slight rotation for chaos feel
    const rotate = (Math.random() - 0.5) * 6;

    setAlerts((prev) => [...prev, { id, msg, x, y, rotate, dying: false }]);
    playBeep();

    // Auto-dismiss after 4–7 seconds if player ignores it
    setTimeout(() => dismissAlert(id), 4000 + Math.random() * 3000);
  }, [playBeep]);

  function dismissAlert(id) {
    // Mark as dying (triggers fade-out CSS)
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dying: true } : a))
    );
    // Remove from DOM after animation
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 300);
  }

  // Spawn loop — only runs when active (player is on game map)
  useEffect(() => {
    if (!active) {
      // Clear all alerts when player enters a scene
      setAlerts([]);
      return;
    }

    // Initial spawn after short delay
    const initial = setTimeout(() => spawnAlert(), 1200);

    // Recurring spawns every 2.5–5 seconds, max 4 on screen at once
    spawnRef.current = setInterval(() => {
      setAlerts((prev) => {
        if (prev.length < 4) spawnAlert();
        return prev;
      });
    }, 2500 + Math.random() * 2500);

    return () => {
      clearTimeout(initial);
      clearInterval(spawnRef.current);
    };
  }, [active, spawnAlert]);

  // Randomise interval duration on each cycle
  useEffect(() => {
    if (!active) return;
    const reschedule = () => {
      clearInterval(spawnRef.current);
      spawnRef.current = setInterval(() => {
        setAlerts((prev) => {
          if (prev.length < 4) spawnAlert();
          return prev;
        });
        reschedule();
      }, 2000 + Math.random() * 3500);
    };
    reschedule();
    return () => clearInterval(spawnRef.current);
  }, [active, spawnAlert]);

  if (!active || alerts.length === 0) return null;

  return (
    <>
      <style>{css}</style>
      {alerts.map((a) => (
        <button
          key={a.id}
          onClick={() => dismissAlert(a.id)}
          style={{
            position:      "fixed",
            left:          `${a.x}%`,
            top:           `${a.y}%`,
            transform:     `rotate(${a.rotate}deg)`,
            zIndex:        9000,           // below scene overlays (9999) and board (99999)
            cursor:        "pointer",
            background:    "#0a0a0a",
            border:        `1.5px solid ${a.msg.color}`,
            borderRadius:  6,
            padding:       "7px 12px",
            display:       "flex",
            alignItems:    "center",
            gap:           8,
            fontFamily:    "'Courier New', monospace",
            boxShadow:     `0 0 14px ${a.msg.color}55`,
            animation:     a.dying
              ? "fakeAlertOut 0.3s ease forwards"
              : "fakeAlertIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
            pointerEvents: "all",
            userSelect:    "none",
            minWidth:      160,
            maxWidth:      220,
            whiteSpace:    "nowrap",
          }}
          title="Click to dismiss"
        >
          {/* Pulsing dot */}
          <span
            style={{
              width:        8,
              height:       8,
              borderRadius: "50%",
              background:   a.msg.color,
              flexShrink:   0,
              animation:    "fakeAlertPulse 0.7s step-end infinite",
              display:      "inline-block",
            }}
          />

          {/* Icon + text */}
          <span style={{ fontSize: "0.85rem" }}>{a.msg.icon}</span>
          <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span
              style={{
                fontSize:      "0.65rem",
                fontWeight:    700,
                color:         a.msg.color,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              {a.msg.label}
            </span>
            <span style={{ fontSize: "0.58rem", color: "#445", letterSpacing: 0.5 }}>
              {a.msg.sub}
            </span>
          </span>

          {/* × dismiss hint */}
          <span
            style={{
              marginLeft:  "auto",
              fontSize:    "0.65rem",
              color:       "#333",
              paddingLeft: 6,
              flexShrink:  0,
            }}
          >
            ✕
          </span>
        </button>
      ))}
    </>
  );
}

const css = `
  @keyframes fakeAlertIn {
    from { opacity: 0; transform: scale(0.7) translateY(-8px); }
    to   { opacity: 1; transform: scale(1)   translateY(0);    }
  }
  @keyframes fakeAlertOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.6) translateY(-6px); }
  }
  @keyframes fakeAlertPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
`;