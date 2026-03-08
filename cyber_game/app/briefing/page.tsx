"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────
   STORY SCRIPT
   Each entry is one "line" typed sequentially.
   type: "header" | "body" | "alert" | "gap" | "system"
───────────────────────────────────────────── */
const SCRIPT = [
  { type: "system",  text: "// SECURE BRIEFING CHANNEL ESTABLISHED" },
  { type: "system",  text: "// ENCRYPTION: AES-256 · CLEARANCE VERIFIED" },
  { type: "gap" },
  { type: "header",  text: "SOC DEFENDER: CONTROL ROOM BREACH" },
  { type: "gap" },
  { type: "body",    text: "Welcome to the Security Operations Control Room." },
  { type: "gap" },
  { type: "body",    text: "The Blue Team — John, Sarah, Victoria, and you — was supposed to return from vacation tomorrow. However, something felt off, so you arrived early." },
  { type: "gap" },
  { type: "alert",   text: "⚠  ANOMALY DETECTED  —  MULTIPLE SECURITY ALERTS TRIGGERED" },
  { type: "gap" },
  { type: "body",    text: "As you enter the control room, multiple security alerts flash across the dashboard. Authentication logs look suspicious, network activity seems abnormal, and several systems appear to have been tampered with." },
  { type: "gap" },
  { type: "body",    text: "Someone has interacted with the internal infrastructure." },
  { type: "gap" },
  { type: "system",  text: "// MISSION BRIEFING" },
  { type: "body",    text: "Your task is to investigate the alerts shown on the dashboard. Each alert represents a cybersecurity incident and may contain hidden clues, logs, or encoded evidence left behind by the intruder." },
  { type: "gap" },
  { type: "body",    text: "Some traces may mislead you, while others will reveal important digital footprints. As you solve each alert, the discovered evidence will be stored in your Investigation Board for later analysis." },
  { type: "gap" },
  { type: "alert",   text: "▸  OBJECTIVE: Investigate carefully, connect the clues, and determine who is responsible for the breach." },
  { type: "gap" },
  { type: "system",  text: "// SYSTEM IS WAITING..." },
  { type: "gap" },
];

/* ─────────────────────────────────────────────
   WEB AUDIO — typewriter click & alert beep
───────────────────────────────────────────── */
function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctxRef.current;
  };

  const click = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }, []);

  const beep = useCallback((freq = 880, duration = 0.18, vol = 0.12) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, []);

  const alertSound = useCallback(() => {
    try {
      const ctx = getCtx();
      [0, 0.12, 0.24].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime + offset);
        osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + offset + 0.1);
        gain.gain.setValueAtTime(0.07, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.15);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.15);
      });
    } catch {}
  }, []);

  return { click, beep, alertSound };
}

/* ─────────────────────────────────────────────
   MATRIX RAIN CANVAS
───────────────────────────────────────────── */
function MatrixRain({ opacity = 0.07 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CHARS = "01アイウエオカキクケコタチツテトナニヌネノ";
    let W: number, H: number, drops: number[];
    const resize = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
      drops = Array(Math.floor(W / 20)).fill(1);
    };
    const draw = () => {
      ctx.fillStyle = "rgba(1,8,3,.065)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = "13px monospace";
      drops.forEach((y, i) => {
        ctx.globalAlpha = Math.random() * 0.5 + 0.1;
        ctx.fillStyle = `hsl(${140 + Math.random() * 20},80%,${30 + Math.random() * 25}%)`;
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * 20, y * 20);
        if (y * 20 > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      ctx.globalAlpha = 1;
    };
    resize();
    window.addEventListener("resize", resize);
    const id = setInterval(draw, 60);
    return () => { clearInterval(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, opacity, pointerEvents: "none" }} />;
}

/* ─────────────────────────────────────────────
   SCANLINE OVERLAY
───────────────────────────────────────────── */
function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.15) 2px, rgba(0,0,0,.15) 4px)",
    }} />
  );
}

/* ─────────────────────────────────────────────
   VIGNETTE
───────────────────────────────────────────── */
function Vignette() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
      background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,.75) 100%)",
    }} />
  );
}

/* ─────────────────────────────────────────────
   CORNER BRACKET
───────────────────────────────────────────── */
function Bracket({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const s: React.CSSProperties = { position: "absolute", width: 18, height: 18, borderColor: "rgba(0,255,100,.35)" };
  if (pos === "tl") { s.top = 0; s.left = 0; s.borderTop = "1.5px solid"; s.borderLeft = "1.5px solid"; }
  if (pos === "tr") { s.top = 0; s.right = 0; s.borderTop = "1.5px solid"; s.borderRight = "1.5px solid"; }
  if (pos === "bl") { s.bottom = 0; s.left = 0; s.borderBottom = "1.5px solid"; s.borderLeft = "1.5px solid"; }
  if (pos === "br") { s.bottom = 0; s.right = 0; s.borderBottom = "1.5px solid"; s.borderRight = "1.5px solid"; }
  return <span style={s} />;
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function BriefingPage() {
  const router = useRouter();
  const { click, beep, alertSound } = useAudio();

  const [playerName, setPlayerName] = useState("ANALYST");
  const [lines, setLines] = useState<{ type: string; text: string; done: boolean }[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [allDone, setAllDone] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [scanY, setScanY] = useState(0);
  const [started, setStarted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const lineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read player name from session
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("soc_player");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.name) setPlayerName(p.name.toUpperCase());
      }
    } catch {}
  }, []);

  // Scanline sweep
  useEffect(() => {
    const id = setInterval(() => setScanY(p => (p + 0.25) % 100), 16);
    return () => clearInterval(id);
  }, []);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setShowCursor(p => !p), 530);
    return () => clearInterval(id);
  }, []);

  // Typewriter engine
  const typeNextLine = useCallback((lineIdx: number, lines: typeof SCRIPT) => {
    if (lineIdx >= lines.length) {
      setAllDone(true);
      beep(660, 0.3, 0.1);
      setTimeout(() => setShowBtn(true), 400);
      return;
    }

    const line = lines[lineIdx];

    if (line.type === "gap") {
      setLines(prev => [...prev, { type: "gap", text: "", done: true }]);
      lineTimerRef.current = setTimeout(() => typeNextLine(lineIdx + 1, lines), 120);
      return;
    }

    if (line.type === "alert") alertSound();
    if (line.type === "header") beep(440, 0.2, 0.08);
    if (line.type === "system") beep(330, 0.1, 0.05);

    // Start typing this line
    const lineText = line.text || "";
    setLines(prev => [...prev, { type: line.type, text: "", done: false }]);
    let charIdx = 0;

    const typeChar = () => {
      if (charIdx >= lineText.length) {
        // Line complete
        setLines(prev => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], done: true };
          return next;
        });
        const pause = line.type === "alert" ? 400 : line.type === "header" ? 350 : 180;
        lineTimerRef.current = setTimeout(() => typeNextLine(lineIdx + 1, lines), pause);
        return;
      }

      const ch = lineText[charIdx];
      if (ch !== " " && Math.random() > 0.3) click();

      setLines(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], text: lineText.slice(0, charIdx + 1) };
        return next;
      });

      charIdx++;

      // Speed: header slower, alert dramatic, body normal
      const base = line.type === "header" ? 55 : line.type === "alert" ? 38 : line.type === "system" ? 28 : 22;
      const jitter = Math.random() * 18;
      charTimerRef.current = setTimeout(typeChar, base + jitter);
    };

    typeChar();
  }, [click, beep, alertSound]);

  // Start on user gesture (to allow AudioContext)
  const handleStart = () => {
    setStarted(true);
    beep(220, 0.15, 0.08);
    setTimeout(() => typeNextLine(0, SCRIPT), 300);
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Cleanup
  useEffect(() => () => {
    if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
    if (charTimerRef.current) clearTimeout(charTimerRef.current);
  }, []);

  // Random glitch flicker on bg
  useEffect(() => {
    const run = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 80 + Math.random() * 120);
      setTimeout(run, 3000 + Math.random() * 7000);
    };
    const h = setTimeout(run, 4000);
    return () => clearTimeout(h);
  }, []);

  const handleEnter = () => {
    beep(550, 0.25, 0.12);
    setTimeout(() => router.push("/game"), 350);
  };

  // Skip all (click anywhere on text area)
  const handleSkip = () => {
    if (allDone) return;
    if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
    if (charTimerRef.current) clearTimeout(charTimerRef.current);
    setLines(SCRIPT.map(l => ({ type: l.type, text: l.text || "", done: true })));
    setCurrentLine(SCRIPT.length);
    setAllDone(true);
    setTimeout(() => setShowBtn(true), 200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&family=VT323&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { min-height:100vh; background:#000a02; overflow:hidden; }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes pulseGlow {
          0%,100%{box-shadow:0 0 20px rgba(0,255,100,.15),0 0 60px rgba(0,255,100,.05)}
          50%{box-shadow:0 0 35px rgba(0,255,100,.3),0 0 80px rgba(0,255,100,.1)}
        }
        @keyframes alertFlash {
          0%,100%{background:rgba(255,50,0,.06)}
          50%{background:rgba(255,50,0,.14)}
        }
        @keyframes scanPulse {
          0%{left:-40%} 100%{left:120%}
        }
        @keyframes btnGlow {
          0%,100%{box-shadow:0 0 20px rgba(0,255,100,.3),inset 0 0 20px rgba(0,255,100,.05)}
          50%{box-shadow:0 0 40px rgba(0,255,100,.6),inset 0 0 30px rgba(0,255,100,.1)}
        }
        @keyframes glitchFlash {
          0%{opacity:1} 25%{opacity:0} 50%{opacity:1} 75%{opacity:0} 100%{opacity:1}
        }
        @keyframes float {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)}
        }
        @keyframes headerGlitch {
          0%,90%,100%{text-shadow:0 0 20px rgba(0,255,100,.6)}
          91%{text-shadow:-3px 0 #ff3355,3px 0 #00d4ff,0 0 20px rgba(0,255,100,.6)}
          93%{text-shadow:3px 0 #ff3355,-3px 0 #00d4ff,0 0 20px rgba(0,255,100,.6)}
          95%{text-shadow:0 0 20px rgba(0,255,100,.6)}
        }

        .brief-scroll::-webkit-scrollbar { width:4px; }
        .brief-scroll::-webkit-scrollbar-track { background:transparent; }
        .brief-scroll::-webkit-scrollbar-thumb { background:rgba(0,255,100,.2); border-radius:2px; }

        .enter-btn {
          font-family:'Orbitron',monospace; font-weight:700; font-size:.85rem;
          letter-spacing:.3em; padding:1rem 3rem;
          background:transparent;
          color:#00ff88;
          border:1px solid rgba(0,255,100,.5);
          cursor:pointer;
          clip-path:polygon(16px 0%,100% 0%,calc(100% - 16px) 100%,0% 100%);
          transition:all .3s;
          animation:btnGlow 2s ease infinite, fadeUp .6s ease forwards;
          position:relative; overflow:hidden;
        }
        .enter-btn::before {
          content:'';position:absolute;top:0;width:25%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(0,255,100,.15),transparent);
          animation:scanPulse 2.5s linear infinite;
        }
        .enter-btn:hover {
          background:rgba(0,255,100,.08);
          border-color:#00ff88;
          box-shadow:0 0 50px rgba(0,255,100,.5),inset 0 0 30px rgba(0,255,100,.08);
          transform:scale(1.03);
          letter-spacing:.35em;
        }
        .enter-btn:active { transform:scale(.98); }

        .start-btn {
          font-family:'Share Tech Mono',monospace; font-size:.75rem;
          letter-spacing:.2em; padding:.75rem 2rem;
          background:rgba(0,255,100,.06);
          color:rgba(0,255,100,.7);
          border:1px solid rgba(0,255,100,.25);
          cursor:pointer; transition:all .25s;
        }
        .start-btn:hover { background:rgba(0,255,100,.12); color:#00ff88; border-color:rgba(0,255,100,.5); }
      `}</style>

      {/* Layers */}
      <MatrixRain opacity={0.09} />
      <Scanlines />
      <Vignette />

      {/* Horizontal grid lines */}
      <div style={{
        position:"fixed",inset:0,zIndex:1,pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(0,255,100,.015) 1px, transparent 1px)",
        backgroundSize:"100% 40px",
      }} />

      {/* Glitch flash overlay */}
      <div style={{
        position:"fixed",inset:0,zIndex:2,pointerEvents:"none",
        background:"rgba(0,255,100,.03)",
        animation: glitch ? "glitchFlash .15s ease" : "none",
      }} />

      {/* Moving scan sweep */}
      <div style={{
        position:"fixed",left:0,right:0,height:"1px",zIndex:2,pointerEvents:"none",
        background:"linear-gradient(90deg,transparent,rgba(0,255,100,.18),transparent)",
        top:`${scanY}vh`,transition:"top .05s linear",
      }} />

      {/* ── MAIN LAYOUT ── */}
      <div style={{
        position:"relative",zIndex:10,
        minHeight:"100vh",
        display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",
        padding:"2rem 1.5rem",
        fontFamily:"'Share Tech Mono',monospace",
      }}>

        {/* Top status bar */}
        <div style={{
          position:"fixed",top:0,left:0,right:0,zIndex:20,
          background:"rgba(0,5,2,.85)",backdropFilter:"blur(8px)",
          borderBottom:"1px solid rgba(0,255,100,.08)",
          padding:".4rem 1.5rem",
          display:"flex",alignItems:"center",justifyContent:"space-between",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:".6rem",fontSize:".55rem",color:"rgba(0,255,100,.4)",letterSpacing:".15em"}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#00ff88",display:"inline-block",animation:"blink .8s infinite",boxShadow:"0 0 6px #00ff88"}} />
            SECURE CHANNEL ACTIVE
          </div>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:".6rem",color:"rgba(0,255,100,.3)",letterSpacing:".2em"}}>
            CYBER DEFENDER
          </div>
          <div style={{fontSize:".55rem",color:"rgba(0,255,100,.35)",letterSpacing:".12em"}}>
            ANALYST: {playerName}
          </div>
        </div>

        {/* Terminal window */}
        <div style={{
          width:"min(820px,96vw)",
          position:"relative",
          background:"rgba(0,8,3,.88)",
          backdropFilter:"blur(16px)",
          border:"1px solid rgba(0,255,100,.18)",
          boxShadow:"0 0 0 1px rgba(0,255,100,.04) inset, 0 0 80px rgba(0,255,100,.06), 0 30px 80px rgba(0,0,0,.7)",
          animation:"pulseGlow 4s ease infinite",
        }}>
          <Bracket pos="tl" /><Bracket pos="tr" /><Bracket pos="bl" /><Bracket pos="br" />

          {/* Terminal titlebar */}
          <div style={{
            display:"flex",alignItems:"center",gap:".6rem",
            padding:".55rem 1rem",
            borderBottom:"1px solid rgba(0,255,100,.1)",
            background:"rgba(0,255,100,.025)",
          }}>
            <div style={{display:"flex",gap:".4rem"}}>
              {["rgba(255,80,80,.5)","rgba(255,200,80,.5)","rgba(0,255,100,.45)"].map((c,i)=>(
                <div key={i} style={{width:12,height:12,borderRadius:"50%",background:c}} />
              ))}
            </div>
            <div style={{flex:1,textAlign:"center",fontSize:".65rem",color:"rgba(0,255,100,.3)",letterSpacing:".15em"}}>
              mission_briefing.sh — CLASSIFIED
            </div>
            <div style={{fontSize:".58rem",color:"#00ff88",letterSpacing:".1em",display:"flex",alignItems:"center",gap:".3rem"}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"#ff4444",display:"inline-block",animation:"blink .6s infinite"}} />
              RECORDING
            </div>
          </div>

          {/* Scrollable content */}
          <div
            ref={scrollRef}
            className="brief-scroll"
            onClick={!allDone ? handleSkip : undefined}
            style={{
              padding:"1.8rem 2.2rem 1.4rem",
              maxHeight:"62vh",
              overflowY:"auto",
              cursor: allDone ? "default" : "pointer",
              minHeight: 200,
            }}
          >
            {!started ? (
              /* Boot screen */
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:260,gap:"1.4rem"}}>
                <div style={{fontSize:".6rem",color:"rgba(0,255,100,.3)",letterSpacing:".2em",textAlign:"center",lineHeight:2}}>
                  <div>// SECURE BRIEFING CHANNEL</div>
                  <div>// CLEARANCE LEVEL: {playerName}</div>
                  <div>// ENCRYPTION: ACTIVE</div>
                </div>
                <div style={{fontSize:".55rem",color:"rgba(0,255,100,.2)",letterSpacing:".12em"}}>
                  — CLICK TO INITIALIZE TRANSMISSION —
                </div>
                <button className="start-btn" onClick={handleStart}>
                  ▶ BEGIN TRANSMISSION
                </button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {lines.map((line, i) => {
                  if (line.type === "gap") return <div key={i} style={{height:"0.9rem"}} />;

                  if (line.type === "header") return (
                    <div key={i} style={{
                      fontFamily:"'Orbitron',monospace",fontWeight:900,
                      fontSize:"clamp(.95rem,2.5vw,1.35rem)",
                      color:"#00ff88",letterSpacing:".12em",lineHeight:1.3,
                      textShadow:"0 0 20px rgba(0,255,100,.6)",
                      animation:"slideIn .3s ease, headerGlitch 6s infinite",
                      marginBottom:".1rem",
                    }}>
                      {line.text}
                      {!line.done && <span style={{animation:"blink .5s infinite",color:"#00ff88"}}>█</span>}
                    </div>
                  );

                  if (line.type === "alert") return (
                    <div key={i} style={{
                      fontFamily:"'VT323',monospace",fontSize:"1.05rem",
                      color:"#ff6600",letterSpacing:".08em",lineHeight:1.5,
                      padding:".45rem .75rem",
                      border:"1px solid rgba(255,80,0,.25)",
                      background:"rgba(255,50,0,.06)",
                      animation:`slideIn .3s ease, alertFlash 1.8s ease infinite`,
                      textShadow:"0 0 10px rgba(255,100,0,.5)",
                      marginBottom:".1rem",
                    }}>
                      {line.text}
                      {!line.done && <span style={{animation:"blink .4s infinite",color:"#ff6600"}}>█</span>}
                    </div>
                  );

                  if (line.type === "system") return (
                    <div key={i} style={{
                      fontSize:".62rem",color:"rgba(0,255,100,.35)",
                      letterSpacing:".15em",lineHeight:1.6,
                      animation:"slideIn .2s ease",fontStyle:"italic",
                    }}>
                      {line.text}
                      {!line.done && <span style={{animation:"blink .5s infinite",color:"rgba(0,255,100,.4)"}}>_</span>}
                    </div>
                  );

                  // body
                  return (
                    <div key={i} style={{
                      fontSize:".85rem",color:"rgba(0,255,100,.82)",
                      lineHeight:1.75,letterSpacing:".03em",
                      animation:"slideIn .25s ease",
                    }}>
                      {line.text}
                      {!line.done && <span style={{animation:"blink .45s infinite",color:"#00ff88"}}>█</span>}
                    </div>
                  );
                })}

                {/* Blinking cursor at end while typing */}
                {!allDone && lines.length === 0 && (
                  <span style={{color:"#00ff88",animation:"blink .5s infinite"}}>█</span>
                )}
              </div>
            )}
          </div>

          {/* Skip hint */}
          {started && !allDone && (
            <div style={{
              padding:".3rem 1rem",borderTop:"1px solid rgba(0,255,100,.06)",
              fontSize:".5rem",color:"rgba(0,255,100,.2)",letterSpacing:".12em",textAlign:"center",
            }}>
              CLICK ANYWHERE TO SKIP TRANSMISSION
            </div>
          )}

          {/* Bottom bar with Enter button */}
          <div style={{
            padding:"1.2rem 2.2rem 1.6rem",
            display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",
            borderTop: showBtn ? "1px solid rgba(0,255,100,.1)" : "none",
          }}>
            {showBtn && (
              <>
                <div style={{
                  fontSize:".58rem",color:"rgba(0,255,100,.35)",
                  letterSpacing:".2em",textAlign:"center",
                  animation:"fadeUp .5s ease",
                }}>
                  — TRANSMISSION COMPLETE · SYSTEM AWAITING RESPONSE —
                </div>
                <button className="enter-btn" onClick={handleEnter}>
                  BEGIN INVESTIGATION
                </button>
                <div style={{
                  fontSize:".5rem",color:"rgba(0,255,100,.2)",
                  letterSpacing:".15em",animation:"fadeUp .8s ease",
                }}>
                  GOOD LUCK, {playerName}
                </div>
              </>
            )}

            {/* Decorative bottom line */}
            <div style={{
              width:"100%",height:"1px",
              background:"linear-gradient(90deg,transparent,rgba(0,255,100,.12),transparent)",
              marginTop: showBtn ? ".2rem" : 0,
            }} />
          </div>
        </div>

        {/* Side decorations */}
        <div style={{
          position:"fixed",left:"1.5rem",top:"50%",transform:"translateY(-50%)",
          display:"flex",flexDirection:"column",gap:"8px",zIndex:5,
        }}>
          {Array.from({length:8}).map((_,i)=>(
            <div key={i} style={{
              width: i % 3 === 0 ? 20 : 12,
              height:2,
              background:`rgba(0,255,100,${0.08 + i*0.02})`,
              boxShadow:`0 0 4px rgba(0,255,100,.15)`,
            }} />
          ))}
        </div>
        <div style={{
          position:"fixed",right:"1.5rem",top:"50%",transform:"translateY(-50%)",
          display:"flex",flexDirection:"column",gap:"8px",zIndex:5,
        }}>
          {Array.from({length:8}).map((_,i)=>(
            <div key={i} style={{
              width: i % 3 === 0 ? 20 : 12,
              height:2,
              marginLeft:"auto",
              background:`rgba(0,255,100,${0.08 + i*0.02})`,
              boxShadow:`0 0 4px rgba(0,255,100,.15)`,
            }} />
          ))}
        </div>
      </div>
    </>
  );
}