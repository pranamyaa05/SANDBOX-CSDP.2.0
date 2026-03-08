"use client";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════
   HintsDrawer.jsx  — drop-in replacement for the fixed InvestigationBoard

   WHAT THIS DOES:
   • Hides entirely while levels are incomplete (no floating board visible)
   • Once allLevelsComplete=true → a pulsing "🗂 HINTS" button appears
     fixed bottom-right, animated unlock glow on first appearance
   • Clicking it opens a 75vh bottom drawer (slide-up animation)
   • Drawer Section 1: Investigation Board (all hints, collapsed by default)
   • Drawer Section 2: ID Records — Blue Team + Red Team personnel cards
   • Drawer Section 3: Flag Submission — for final answer
═══════════════════════════════════════════════════════════════════ */

// ── Hint slot config (keep in sync with your level count) ──────────
const HINT_LABELS = [
  "🔴 Level 1 — Ransomware File Hash Trace",
  "🟠 Level 2 — Network C2 Beacon Analysis",
  "🔵 Level 3 — Password Security Hardening",
  "🟡 Level 4 — Phishing Email Triage",
  "🟣 Level 5 — SQL Injection DB Breach",
];
const SLOT_COLORS = ["#ff2200", "#ff6600", "#4466ff", "#ffcc00", "#9933ff"];

function matchHintToSlot(hint) {
  if (hint.includes("[Player Note]"))                                                           return -1;
  if (hint.includes("Ransomware") || hint.includes("SHA-256") || hint.includes("payload"))     return 0;
  if (hint.includes("C2")         || hint.includes("beacon")  || hint.includes("JN_TRIST"))    return 1;
  if (hint.includes("MFA")        || hint.includes("hardened")|| hint.includes("Brute-force")) return 2;
  if (hint.includes("Phishing")   || hint.includes("phishing")|| hint.includes("triage"))      return 3;
  if (hint.includes("SQL")        || hint.includes("injection")|| hint.includes("bypass"))     return 4;
  return -1;
}

// ── Deterministic helpers (no re-randomise on re-render) ────────────
function makeDOB(seed, year) {
  const d = String(((seed * 7) % 28) + 1).padStart(2, "0");
  const m = String(((seed * 3) % 12) + 1).padStart(2, "0");
  return `${d}/${m}/${year}`;
}
function makeSer(seed) {
  return String(10000 + (seed * 317) % 90000);
}
function makeBarcodeSegments(col) {
  const ws = [3,1,2,1,3,2,1,2,1,3,1,2,3,1,2,1,1,3,2,1,3,2,1,2,1,3,2,1];
  // heights seeded so they don't change between renders
  return ws.map((w, i) => ({ w, h: 11 + ((i * 37) % 10) }));
}

// ── Inline SVG avatars (male / female) ─────────────────────────────
function AvatarSVG({ gender, acc, name }) {
  const s   = (name.charCodeAt(0) || 65) * 3 + (name.charCodeAt(4) || 40);
  const SKINS = ["#c49a6c","#d4a872","#b5834a","#8c6040","#e0b888","#a0714e"];
  const HAIRS = ["#1a100a","#2a1a0e","#3c2814","#1a1824","#4a3218","#5c4428"];
  const sk  = SKINS[s % SKINS.length];
  const hr  = HAIRS[(s + 1) % HAIRS.length];
  const uid = `hd${s}${acc.replace("#", "")}`;
  const dur = `${2.2 + (s % 3) * 0.4}s`;

  const sharedDefs = (
    <defs>
      <radialGradient id={`${uid}bg`} cx="50%" cy="60%" r="65%">
        <stop offset="0%" stopColor={acc} stopOpacity=".13"/>
        <stop offset="100%" stopColor="#010508"/>
      </radialGradient>
      <linearGradient id={`${uid}u`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0d2236"/>
        <stop offset="100%" stopColor="#05101e"/>
      </linearGradient>
      <radialGradient id={`${uid}sk`} cx="42%" cy="28%" r="72%">
        <stop offset="0%" stopColor={sk}/>
        <stop offset="100%" stopColor={sk} stopOpacity=".78"/>
      </radialGradient>
    </defs>
  );

  const scanline = (
    <rect x="0" y="0" width="92" height="2" fill={acc} opacity=".17">
      <animateTransform attributeName="transform" type="translate"
        values="0,-3;0,95;0,-3" dur={dur} repeatCount="indefinite"/>
    </rect>
  );
  const corners = (
    <g stroke={acc} strokeWidth=".7" opacity=".35">
      <polyline points="2,7 2,2 7,2"/>
      <polyline points="85,2 90,2 90,7"/>
      <polyline points="2,85 2,90 7,90"/>
      <polyline points="90,85 90,90 85,90"/>
    </g>
  );

  if (gender === "M") return (
    <svg viewBox="0 0 92 92" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      {sharedDefs}
      <rect width="92" height="92" fill={`url(#${uid}bg)`}/>
      <g stroke={acc} strokeWidth=".22" opacity=".07">
        <line x1="0" y1="23" x2="92" y2="23"/><line x1="0" y1="69" x2="92" y2="69"/>
        <line x1="23" y1="0" x2="23" y2="92"/><line x1="69" y1="0" x2="69" y2="92"/>
      </g>
      <path d="M0 92 Q0 68 16 64 L28 59 L46 63 L64 59 L76 64 Q92 68 92 92Z" fill={`url(#${uid}u)`}/>
      <path d="M0 92 Q0 68 16 64 L28 59 L46 63 L64 59 L76 64 Q92 68 92 92Z" stroke={acc} strokeWidth=".5" fill="none" opacity=".28"/>
      <path d="M37 59 L46 63 L55 59 L53 71 L46 68 L39 71Z" fill={acc} fillOpacity=".14" stroke={acc} strokeWidth=".5" opacity=".7"/>
      <rect x="22" y="70" width="13" height="9" rx="1" fill={acc} fillOpacity=".1" stroke={acc} strokeWidth=".45" opacity=".6"/>
      <rect x="23.5" y="71.5" width="10" height="1.4" rx=".4" fill={acc} opacity=".45"/>
      <rect x="23.5" y="74" width="7" height="1.4" rx=".4" fill={acc} opacity=".3"/>
      <path d="M38 52 Q38 60 39 61 Q46 63.5 53 61 Q54 60 54 52Z" fill={`url(#${uid}sk)`}/>
      <ellipse cx="46" cy="38" rx="18" ry="20" fill={`url(#${uid}sk)`}/>
      <ellipse cx="28" cy="39" rx="2.8" ry="4.2" fill={`url(#${uid}sk)`}/>
      <ellipse cx="64" cy="39" rx="2.8" ry="4.2" fill={`url(#${uid}sk)`}/>
      <path d="M28 32 Q28 14 46 13.5 Q64 14 64 32 Q60 20 46 19.5 Q32 20 28 32Z" fill={hr}/>
      <path d="M28 32 Q26 40 27 46 L29 34Z" fill={hr} opacity=".85"/>
      <path d="M64 32 Q66 40 65 46 L63 34Z" fill={hr} opacity=".85"/>
      <path d="M33 31 Q38.5 29 44 31" stroke={hr} strokeWidth="1.9" fill="none" strokeLinecap="round"/>
      <path d="M48 31 Q53.5 29 59 31" stroke={hr} strokeWidth="1.9" fill="none" strokeLinecap="round"/>
      <ellipse cx="38.5" cy="37" rx="4.4" ry="3.5" fill="#e8f0ff"/>
      <ellipse cx="53.5" cy="37" rx="4.4" ry="3.5" fill="#e8f0ff"/>
      <circle cx="38.8" cy="37.4" r="2.7" fill="#243855"/>
      <circle cx="53.8" cy="37.4" r="2.7" fill="#243855"/>
      <circle cx="38.8" cy="37.4" r="1.5" fill="#05080e"/>
      <circle cx="53.8" cy="37.4" r="1.5" fill="#05080e"/>
      <circle cx="39.8" cy="36.4" r=".65" fill="white" opacity=".92"/>
      <circle cx="54.8" cy="36.4" r=".65" fill="white" opacity=".92"/>
      <path d="M39 53 Q46 55.5 53 53" stroke={hr} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".5"/>
      <path d="M28 33 Q28 11.5 46 11 Q64 11.5 64 33" stroke={acc} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <rect x="24.2" y="30.5" width="7.5" height="13" rx="3.3" fill={acc} fillOpacity=".18" stroke={acc} strokeWidth=".9"/>
      <rect x="60.3" y="30.5" width="7.5" height="13" rx="3.3" fill={acc} fillOpacity=".18" stroke={acc} strokeWidth=".9"/>
      <rect x="25.8" y="32" width="4.4" height="10" rx="2" fill={acc} fillOpacity=".32"/>
      <rect x="61.9" y="32" width="4.4" height="10" rx="2" fill={acc} fillOpacity=".32"/>
      {scanline}{corners}
    </svg>
  );

  // Female
  return (
    <svg viewBox="0 0 92 92" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      {sharedDefs}
      <rect width="92" height="92" fill={`url(#${uid}bg)`}/>
      <g stroke={acc} strokeWidth=".22" opacity=".07">
        <line x1="0" y1="23" x2="92" y2="23"/><line x1="0" y1="69" x2="92" y2="69"/>
        <line x1="23" y1="0" x2="23" y2="92"/><line x1="69" y1="0" x2="69" y2="92"/>
      </g>
      <path d="M0 92 Q0 68 14 64 L28 58 L46 62 L64 58 L78 64 Q92 68 92 92Z" fill={`url(#${uid}u)`}/>
      <path d="M0 92 Q0 68 14 64 L28 58 L46 62 L64 58 L78 64 Q92 68 92 92Z" stroke={acc} strokeWidth=".5" fill="none" opacity=".28"/>
      <path d="M37 58 L46 62 L55 58 L53 71 L46 68 L39 71Z" fill={acc} fillOpacity=".14" stroke={acc} strokeWidth=".5" opacity=".7"/>
      <rect x="22" y="69" width="13" height="9" rx="1" fill={acc} fillOpacity=".1" stroke={acc} strokeWidth=".45" opacity=".6"/>
      <rect x="23.5" y="70.5" width="10" height="1.4" rx=".4" fill={acc} opacity=".45"/>
      <rect x="23.5" y="73" width="7" height="1.4" rx=".4" fill={acc} opacity=".3"/>
      <path d="M39 51 Q39 59 40 60 Q46 62.5 52 60 Q53 59 53 51Z" fill={`url(#${uid}sk)`}/>
      <ellipse cx="46" cy="37" rx="17" ry="19.5" fill={`url(#${uid}sk)`}/>
      <ellipse cx="29" cy="37.5" rx="2.7" ry="3.9" fill={`url(#${uid}sk)`}/>
      <ellipse cx="63" cy="37.5" rx="2.7" ry="3.9" fill={`url(#${uid}sk)`}/>
      <circle cx="29" cy="37.5" r="1.5" fill={acc} opacity=".78"/>
      <circle cx="63" cy="37.5" r="1.5" fill={acc} opacity=".78"/>
      <circle cx="29" cy="37.5" r=".55" fill="white" opacity=".65"/>
      <circle cx="63" cy="37.5" r=".55" fill="white" opacity=".65"/>
      <path d="M29 30 Q29 13 46 12.5 Q63 13 63 30 Q59 19 46 18.5 Q33 19 29 30Z" fill={hr}/>
      <path d="M29 30 Q27 43 27 58 Q27.5 65 31 67 Q28 54 29.5 41Z" fill={hr}/>
      <path d="M63 30 Q65 43 65 58 Q64.5 65 61 67 Q64 54 62.5 41Z" fill={hr}/>
      <ellipse cx="46" cy="17.5" rx="17" ry="6.5" fill={hr}/>
      <path d="M32 29.5 Q37.5 27 43 29.5" stroke={hr} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M49 29.5 Q54.5 27 60 29.5" stroke={hr} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M33 33 Q38 31 43 33" fill={hr} opacity=".5"/>
      <path d="M49 33 Q54 31 59 33" fill={hr} opacity=".5"/>
      <ellipse cx="38" cy="35.5" rx="4.6" ry="3.8" fill="#e8f0ff"/>
      <ellipse cx="54" cy="35.5" rx="4.6" ry="3.8" fill="#e8f0ff"/>
      <circle cx="38.3" cy="35.8" r="2.9" fill="#3d2514"/>
      <circle cx="54.3" cy="35.8" r="2.9" fill="#3d2514"/>
      <circle cx="38.3" cy="35.8" r="1.6" fill="#05080e"/>
      <circle cx="54.3" cy="35.8" r="1.6" fill="#05080e"/>
      <circle cx="39.4" cy="34.7" r=".7" fill="white" opacity=".92"/>
      <circle cx="55.4" cy="34.7" r=".7" fill="white" opacity=".92"/>
      <path d="M38.5 50.5 Q42 48.8 46 49.8 Q50 48.8 53.5 50.5 Q50 53.5 46 53 Q42 53.5 38.5 50.5Z" fill="#c06070" opacity=".55"/>
      <path d="M29 30 Q29 11 46 10.5 Q63 11 63 30" stroke={acc} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <rect x="25.2" y="28.5" width="7.5" height="13" rx="3.3" fill={acc} fillOpacity=".18" stroke={acc} strokeWidth=".9"/>
      <rect x="59.3" y="28.5" width="7.5" height="13" rx="3.3" fill={acc} fillOpacity=".18" stroke={acc} strokeWidth=".9"/>
      {scanline}{corners}
    </svg>
  );
}

// ── Single personnel ID card ────────────────────────────────────────
function IDCard({ member, index }) {
  const { name, id, year, role, clear, dept, nat, joined, station, gender, col, status, logo } = member;
  const statusColor = status === "ON DUTY" ? "#00ff88" : status === "ACTIVE" ? "#ff3355" : "#ffb700";
  const seed        = name.charCodeAt(0) + name.charCodeAt(2);
  const dob         = makeDOB(seed, year);
  const ser         = makeSer(seed);
  const isRT        = logo === "RT";
  const bars        = makeBarcodeSegments(col);

  return (
    <div style={{
      width:          200,
      border:         isRT ? `1px solid ${col}44` : "1px solid rgba(0,212,255,0.28)",
      position:       "relative",
      overflow:       "hidden",
      background:     isRT ? "rgba(18,4,8,0.82)" : "rgba(4,14,30,0.78)",
      boxShadow:      isRT
        ? `0 0 22px ${col}33, 0 14px 45px rgba(0,0,0,0.6)`
        : `0 0 0 1px rgba(0,140,255,0.12), 0 0 18px rgba(0,140,255,0.22), 0 14px 45px rgba(0,0,0,0.65)`,
      backdropFilter: "blur(14px)",
      flexShrink:     0,
      animation:      `hdCardPop 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s both`,
      transition:     "transform 0.3s, box-shadow 0.3s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "scale(1.045) translateY(-6px)";
      e.currentTarget.style.boxShadow = isRT
        ? `0 0 40px ${col}55, 0 22px 55px rgba(0,0,0,0.7)`
        : `0 0 0 1px rgba(0,170,255,0.18), 0 0 36px rgba(0,170,255,0.35), 0 22px 55px rgba(0,0,0,0.7)`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "";
      e.currentTarget.style.boxShadow = isRT
        ? `0 0 22px ${col}33, 0 14px 45px rgba(0,0,0,0.6)`
        : `0 0 0 1px rgba(0,140,255,0.12), 0 0 18px rgba(0,140,255,0.22), 0 14px 45px rgba(0,0,0,0.65)`;
    }}>
      {/* corner accents */}
      <div style={{position:"absolute",top:0,left:0,width:11,height:11,borderTop:`2px solid ${col}`,borderLeft:`2px solid ${col}`,zIndex:4}}/>
      <div style={{position:"absolute",bottom:0,right:0,width:11,height:11,borderBottom:`2px solid ${col}`,borderRight:`2px solid ${col}`,zIndex:4}}/>
      {/* holo spinner */}
      <div style={{
        position:"absolute",bottom:7,right:8,width:18,height:18,borderRadius:"50%",
        background: isRT
          ? `conic-gradient(from 0deg, ${col}99, #ff6b2b99, #c81e3c99, ${col}99)`
          : `conic-gradient(from 0deg, #00d4ff99, #00ff8899, #b97fff99, #ffb70099, #00d4ff99)`,
        opacity:.38, zIndex:4,
        animation:"hdHoloSpin 5s linear infinite",
      }}/>
      {/* status pip */}
      <div style={{position:"absolute",top:8,right:8,width:7,height:7,borderRadius:"50%",background:statusColor,boxShadow:`0 0 7px ${statusColor}`,zIndex:5,animation:"hdBlink 1.1s infinite"}}/>
      {/* colour strip */}
      <div style={{height:3,background:`linear-gradient(90deg,transparent,${col} 20%,${col} 80%,transparent)`,opacity:.55}}/>
      {/* org row */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 8px 4px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.36rem",letterSpacing:"0.16em",color:"#3a5870"}}>{dept.toUpperCase()}</div>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.38rem",color:"#3a5870"}}>SER#{ser}</div>
        </div>
        <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.68rem",fontWeight:900,color:col,textShadow:`0 0 10px ${col}99`}}>{logo}</div>
      </div>
      {/* avatar */}
      <div style={{display:"flex",justifyContent:"center",padding:"8px 8px 5px"}}>
        <div style={{width:72,height:72,borderRadius:3,border:`2px solid ${col}`,overflow:"hidden",background:"#060e18",boxShadow:`0 4px 20px rgba(0,0,0,0.6), 0 0 14px ${col}28`}}>
          <AvatarSVG gender={gender} acc={col} name={name}/>
        </div>
      </div>
      {/* ID chip */}
      <div style={{margin:"0 8px 5px",padding:"2px 6px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0,0,0,0.45)",border:`1px solid ${col}44`}}>
        <span style={{fontFamily:"'Orbitron',monospace",fontSize:"0.35rem",letterSpacing:"0.14em",color:"#3a5870"}}>ID NUMBER</span>
        <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.56rem",fontWeight:700,color:col,textShadow:`0 0 7px ${col}66`}}>{id}</span>
      </div>
      {/* clearance */}
      <div style={{margin:"0 8px 5px",padding:"2px 6px",textAlign:"center",fontFamily:"'Orbitron',monospace",fontSize:"0.36rem",letterSpacing:"0.16em",fontWeight:700,background:`${col}0d`,border:`1px solid ${col}44`,color:col,textShadow:`0 0 6px ${col}55`}}>{clear}</div>
      {/* body */}
      <div style={{padding:"0 8px 6px"}}>
        <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.58rem",fontWeight:700,color:col,textShadow:`0 0 8px ${col}50`,marginBottom:2}}>{name}</div>
        <div style={{fontSize:"0.5rem",color:`${col}bb`,marginBottom:5}}>{role}</div>
        {[
          ["DOB",         dob],
          ["NATIONALITY", nat],
          ["JOINED",      joined],
          ["STATION",     station, col],
          ["STATUS",      status,  statusColor],
        ].map(([k, v, vc]) => (
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",fontSize:"0.48rem"}}>
            <span style={{color:"#7aaec8",fontWeight:600,letterSpacing:"0.04em"}}>{k}</span>
            <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.48rem",color:vc||"#cce4f8",fontWeight:vc?700:400}}>{v}</span>
          </div>
        ))}
      </div>
      {/* barcode */}
      <div style={{padding:"5px 8px 7px",borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
        <div style={{display:"flex",gap:1,height:20,alignItems:"flex-end"}}>
          {bars.map((b, i) => (
            <span key={i} style={{display:"block",width:b.w,height:b.h,background:col}}/>
          ))}
        </div>
        <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.37rem",color:"#3a5870",letterSpacing:"0.12em"}}>{id}-{year}-SOC</div>
      </div>
    </div>
  );
}

// ── Team row with divider ───────────────────────────────────────────
function TeamSection({ label, color, members }) {
  return (
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${color}55,transparent)`}}/>
        <div style={{
          fontFamily:"'Orbitron',monospace",fontSize:"0.52rem",fontWeight:700,
          letterSpacing:"0.26em",padding:"4px 12px",
          border:`1px solid ${color}44`,color,background:`${color}0a`,
          textShadow:`0 0 10px ${color}88`,whiteSpace:"nowrap",
        }}>{label}</div>
        <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${color}55,transparent)`}}/>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:14,justifyContent:"center"}}>
        {members.map((m, i) => <IDCard key={i} member={m} index={i}/>)}
      </div>
    </div>
  );
}

// ── Investigation Board panel (inside the drawer) ───────────────────
function InvestigationBoardPanel({ hints }) {
  const [expanded, setExpanded] = useState(false); // collapsed by default

  const slottedHints = [null, null, null, null, null];
  const playerNotes  = [];
  hints.forEach(h => {
    const slot = matchHintToSlot(h);
    if (slot === -1) playerNotes.push(h.replace("[Player Note] ", ""));
    else if (!slottedHints[slot]) slottedHints[slot] = h;
  });
  const collectedCount = slottedHints.filter(Boolean).length;
  const allComplete    = collectedCount >= HINT_LABELS.length;

  return (
    <div style={{
      background:"#0b0b14",
      border:"1px solid rgba(255,183,0,0.2)",
      borderRadius:8,
      overflow:"hidden",
      marginBottom:20,
      fontFamily:"'Courier New',monospace",
      boxShadow:"0 0 30px rgba(255,183,0,0.06)",
    }}>
      {/* header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"10px 14px",
          background:"rgba(255,183,0,0.04)",
          borderBottom: expanded ? "1px solid rgba(255,183,0,0.12)" : "none",
          cursor:"pointer",userSelect:"none",
        }}
      >
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:"0.9rem"}}>🔍</span>
          <span style={{fontFamily:"'Orbitron',monospace",fontSize:"0.56rem",letterSpacing:"0.2em",color:"#ffb700",fontWeight:700}}>
            INVESTIGATION BOARD — COLLECTED EVIDENCE
          </span>
          <span style={{
            fontFamily:"'Share Tech Mono',monospace",fontSize:"0.52rem",color:"#3a5870",
            background:"rgba(255,183,0,0.08)",border:"1px solid rgba(255,183,0,0.18)",
            borderRadius:10,padding:"1px 8px",
          }}>{collectedCount} / {HINT_LABELS.length}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {/* mini progress bar */}
          <div style={{width:80,height:4,background:"rgba(255,183,0,0.1)",borderRadius:2,overflow:"hidden"}}>
            <div style={{
              height:"100%",
              width:`${(collectedCount / HINT_LABELS.length) * 100}%`,
              background:"linear-gradient(90deg,#ffb700,#ffe066)",
              borderRadius:2,transition:"width 0.6s ease",
            }}/>
          </div>
          <span style={{color:"#3a5870",fontSize:"0.75rem"}}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
          {HINT_LABELS.map((label, i) => {
            const hint  = slottedHints[i];
            const color = SLOT_COLORS[i];
            return (
              <div key={i} style={{
                padding:"9px 12px",
                background: hint ? "#0d0d1f" : "transparent",
                border:     hint ? `1px solid ${color}44` : "1px dashed rgba(255,183,0,0.08)",
                borderLeft: hint ? `3px solid ${color}`   : "1px dashed rgba(255,183,0,0.08)",
                borderRadius:4,transition:"all 0.4s",
              }}>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.54rem",fontWeight:700,letterSpacing:"0.1em",color:hint?color:"#2a2a3a",marginBottom:4}}>
                  {label}
                </div>
                {hint
                  ? <p style={{margin:0,fontSize:"0.65rem",color:"#99aabb",lineHeight:1.6}}>{hint}</p>
                  : <p style={{margin:0,fontSize:"0.6rem",color:"rgba(255,183,0,0.15)",fontStyle:"italic"}}>
                      — Complete the investigation to unlock this clue —
                    </p>
                }
              </div>
            );
          })}

          {/* analyst notes */}
          {playerNotes.length > 0 && (
            <div style={{background:"rgba(0,255,136,0.03)",border:"1px solid rgba(0,255,136,0.12)",borderRadius:5,padding:"10px 12px"}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.54rem",fontWeight:700,color:"#00cc66",letterSpacing:"0.12em",marginBottom:6}}>
                📝 ANALYST NOTES ({playerNotes.length})
              </div>
              {playerNotes.map((note, i) => (
                <div key={i} style={{fontSize:"0.62rem",color:"#557755",lineHeight:1.5,padding:"3px 0",borderBottom:"1px solid rgba(0,255,136,0.06)"}}>{note}</div>
              ))}
            </div>
          )}

          {/* footer hint */}
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,paddingTop:4,borderTop:"1px solid rgba(255,183,0,0.07)"}}>
            <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.54rem",color:"#3a5870"}}>
              Compare clues with ID cards below. The culprit left digital footprints behind.
            </span>
            {collectedCount >= 3 && (
              <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.54rem",color:"#00d4ff"}}>
                💡 Cross-reference initials, nationalities and station assignments ↓
              </span>
            )}
          </div>

          {/* final case summary */}
          {allComplete && (
            <div style={{
              background:"#0e1808",border:"1px solid #2a4a1a",
              borderLeft:"4px solid #88cc44",borderRadius:"0 6px 6px 0",
              padding:"12px 14px",display:"flex",flexDirection:"column",gap:8,marginTop:4,
            }}>
              <p style={{margin:0,fontFamily:"'Orbitron',monospace",fontSize:"0.63rem",fontWeight:700,color:"#88cc44",letterSpacing:"0.1em"}}>
                🕵️ CASE SUMMARY — INVESTIGATION COMPLETE
              </p>
              <p style={{margin:0,fontSize:"0.68rem",color:"#99bb88",lineHeight:1.65,fontFamily:"'Courier New',monospace"}}>
                The encrypted payload was submitted by <strong style={{color:"#ffaa44"}}>Williams Dev</strong>.
                The C2 beacon hostname <strong style={{color:"#ffaa44"}}>JN_TRIST</strong> maps to{" "}
                <strong style={{color:"#ffaa44"}}>J. Tristan, IT Dept</strong>. All systems hardened with MFA.
                A coordinated phishing campaign of 3 malicious emails was intercepted and quarantined.
                A SQL injection attack bypassed database authentication — attacker identity confirmed via audio log.
              </p>
              <div style={{fontSize:"0.7rem",fontWeight:700,color:"#cc8844",background:"#1a1000",border:"1px solid #443300",padding:"7px 12px",borderRadius:4,letterSpacing:"0.08em",fontFamily:"'Orbitron',monospace"}}>
                ⚠ PERPETRATOR: <span style={{color:"#ff6644"}}>J. TRISTAN (Williams Dev)</span>
              </div>
              <div style={{fontSize:"0.66rem",fontWeight:700,color:"#00cc66",background:"#0a1a0a",border:"1px solid #1a4a1a",padding:"7px 12px",borderRadius:4,letterSpacing:"0.08em",fontFamily:"'Orbitron',monospace"}}>
                ✓ SYSTEMS SECURED — ALL THREATS NEUTRALISED
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  FLAG SECTION COMPONENT
// ══════════════════════════════════════════════════════════════════
function FlagSection() {
  const [flagInput, setFlagInput] = useState("");
  const [flagResult, setFlagResult] = useState({ message: "", isCorrect: false });

  const checkFlag = () => {
    const value = flagInput.trim().toUpperCase();
    
    if (value === "FLAG{JOHN_IS_THE_ONE}") {
      setFlagResult({
        message: "✓ CORRECT — FLAG{JOHN_IS_THE_ONE} — John Williams identified. Case closed.",
        isCorrect: true
      });
    } else if (value.startsWith("FLAG{") && value.endsWith("}")) {
      setFlagResult({
        message: "✗ Wrong. Re-examine the clues and cross-reference the ID records.",
        isCorrect: false
      });
    } else {
      setFlagResult({
        message: "✗ Invalid format — use FLAG{FIRSTNAME_IS_THE_ONE}",
        isCorrect: false
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkFlag();
    }
  };

  return (
    <div style={{
      border: "1px solid rgba(0,212,255,0.15)",
      background: "rgba(4,14,26,0.9)",
      backdropFilter: "blur(12px)",
      padding: "1.3rem 1.5rem",
      textAlign: "center",
      marginTop: "1rem",
      marginBottom: "1rem",
      boxShadow: "0 0 30px rgba(0,212,255,0.1)",
    }}>
      <div style={{
        fontSize: "0.68rem",
        color: "#8ab0ca",
        lineHeight: 1.85,
        marginBottom: "1rem",
        fontFamily: "'Share Tech Mono', monospace",
      }}>
        Study every clue on the investigation board. Cross-reference nationalities, ID numbers,<br />
        station assignments, and usernames against both team records.<br />
        When you've identified the culprit — submit the flag: <strong style={{color:"#00d4ff"}}>FLAG&#123;FIRSTNAME_IS_THE_ONE&#125;</strong>
      </div>
      
      <div style={{
        display: "flex",
        gap: "0.65rem",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: "0.65rem",
      }}>
        <input
          type="text"
          value={flagInput}
          onChange={(e) => setFlagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="FLAG{...}"
          maxLength={40}
          style={{
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(0,212,255,0.22)",
            color: "#00ff88",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.92rem",
            padding: "0.62rem 1rem",
            outline: "none",
            width: "min(320px, 90vw)",
            textAlign: "center",
            letterSpacing: "0.1em",
            caretColor: "#00ff88",
            transition: "0.25s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(0,212,255,0.5)";
            e.target.style.boxShadow = "0 0 18px rgba(0,212,255,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(0,212,255,0.22)";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          onClick={checkFlag}
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            padding: "0.62rem 1.4rem",
            background: "#00d4ff",
            color: "#000",
            border: "none",
            cursor: "pointer",
            transition: "all 0.25s",
            clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#33ddff";
            e.target.style.boxShadow = "0 0 20px rgba(0,212,255,0.38)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#00d4ff";
            e.target.style.boxShadow = "none";
            e.target.style.transform = "none";
          }}
        >
          SUBMIT FLAG
        </button>
      </div>
      
      <div
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "0.7rem",
          minHeight: "1.4rem",
          letterSpacing: "0.1em",
          color: flagResult.isCorrect ? "#00ff88" : flagResult.message ? "#ff3355" : "",
          textShadow: flagResult.isCorrect ? "0 0 18px rgba(0,255,136,0.55)" : "none",
          animation: flagResult.isCorrect ? "popIn 0.5s ease" : "none",
        }}
      >
        {flagResult.message}
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ══════════════════════════════════════════════════════════════════
export default function HintsDrawer({ hints = [], allLevelsComplete = false }) {
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const prevCompleteRef                 = useRef(false);

  // Flash unlock glow exactly once when levels first complete
  useEffect(() => {
    if (allLevelsComplete && !prevCompleteRef.current) {
      setJustUnlocked(true);
      const t = setTimeout(() => setJustUnlocked(false), 2800);
      prevCompleteRef.current = true;
      return () => clearTimeout(t);
    }
  }, [allLevelsComplete]);

  // Read player data from localStorage (same key as login.html)
  const [player, setPlayer] = useState({
    name:"ANALYST", id:"BT-0000", year:1998,
    role:"Blue Team Analyst", clear:"LEVEL 4 — SECRET", gender:"M",
  });
  useEffect(() => {
    try {
      const saved = localStorage.getItem("soc_player");
      if (saved) setPlayer(p => ({ ...p, ...JSON.parse(saved) }));
    } catch (_) {}
  }, []);

  // Team data (mirrors ID Records HTML exactly)
  const blueTeam = [
    { name:"Sarah Al-Rashid", id:"BT-0039", year:1998, role:"Malware Analyst",          clear:"LEVEL 3 — CONFIDENTIAL", dept:"SOC / Blue Team",          nat:"🇬🇧 UK",     joined:"03 Sep 2019", station:"WORKST-02",      gender:"F", col:"#00ff88", status:"VACATION", logo:"BT" },
    { name:"Victoria Moreau",  id:"BT-0051", year:2000, role:"Network Forensics Lead",   clear:"LEVEL 4 — SECRET",       dept:"SOC / Blue Team",          nat:"🇫🇷 France", joined:"20 Jan 2021", station:"WORKST-03",      gender:"F", col:"#b97fff", status:"VACATION", logo:"BT" },
    { name:player.name,        id:player.id, year:player.year, role:player.role,         clear:player.clear,             dept:"SOC / Blue Team",          nat:"🇺🇸 US",     joined:"—",           station:"CONTROL ROOM C3", gender:player.gender, col:"#ffb700", status:"ON DUTY", logo:"BT" },
    { name:"John Williams",    id:"BT-0042", year:2000, role:"Senior Threat Analyst",    clear:"LEVEL 4 — SECRET",       dept:"SOC / Blue Team",          nat:"🇺🇸 US",     joined:"15 Jun 2020", station:"WORKST-04",      gender:"M", col:"#00d4ff", status:"VACATION", logo:"BT" },
  ];
  const redTeam = [
    { name:"Dmitri Volkov",    id:"RT-0011", year:1991, role:"Lead Penetration Tester",  clear:"LEVEL 4 — SECRET",       dept:"Offensive Ops / Red Team", nat:"🇷🇺 Russia", joined:"07 Mar 2018", station:"OFFSITE-01",     gender:"M", col:"#ff3355", status:"ACTIVE",  logo:"RT" },
    { name:"Yuna Nakashima",   id:"RT-0017", year:1995, role:"Social Engineering Spec.", clear:"LEVEL 3 — CONFIDENTIAL", dept:"Offensive Ops / Red Team", nat:"🇯🇵 Japan",  joined:"12 Nov 2019", station:"OFFSITE-02",     gender:"F", col:"#ff6b2b", status:"ACTIVE",  logo:"RT" },
    { name:"Marcus Reed",      id:"RT-0024", year:1988, role:"Exploit Developer",         clear:"LEVEL 5 — TOP SECRET",   dept:"Offensive Ops / Red Team", nat:"🇺🇸 US",     joined:"01 Aug 2016", station:"OFFSITE-03",     gender:"M", col:"#c81e3c", status:"ACTIVE",  logo:"RT" },
    { name:"Ayla Şahin",       id:"RT-0031", year:1997, role:"Malware Craft & Obfusc.",  clear:"LEVEL 4 — SECRET",       dept:"Offensive Ops / Red Team", nat:"🇹🇷 Turkey", joined:"22 Apr 2021", station:"OFFSITE-04",     gender:"F", col:"#ff5082", status:"ACTIVE",  logo:"RT" },
  ];

  const collectedCount = hints.filter(h => matchHintToSlot(h) >= 0).length;

  // Don't render anything until all levels are done
  if (!allLevelsComplete) return null;

  return (
    <>
      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes hdCardPop {
          from { opacity:0; transform:translateY(18px) scale(0.95); }
          to   { opacity:1; transform:none; }
        }
        @keyframes hdBlink {
          0%,100% { opacity:1; }
          50%      { opacity:0.12; }
        }
        @keyframes hdHoloSpin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes hdUnlockPulse {
          0%   { box-shadow:0 0 0 0 rgba(0,255,136,0),   0 4px 20px rgba(0,0,0,0.5); }
          25%  { box-shadow:0 0 0 14px rgba(0,255,136,0.35), 0 0 50px rgba(0,255,136,0.28); }
          100% { box-shadow:0 0 0 0 rgba(0,255,136,0),   0 4px 20px rgba(0,0,0,0.5); }
        }
        @keyframes hdDrawerIn {
          from { transform:translateY(100%); }
          to   { transform:translateY(0); }
        }
        @keyframes hdBtnAppear {
          from { opacity:0; transform:translateY(20px) scale(0.9); }
          to   { opacity:1; transform:none; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: none; }
        }
      `}</style>

      {/* ══ HINTS BUTTON — fixed bottom-right ══ */}
      <div
        onClick={() => setDrawerOpen(o => !o)}
        style={{
          position:     "fixed",
          bottom:       drawerOpen ? "calc(75vh + 16px)" : 20,
          right:        20,
          zIndex:       199998,
          cursor:       "pointer",
          display:      "flex",
          alignItems:   "center",
          gap:          8,
          padding:      "10px 20px",
          background:   drawerOpen
            ? "rgba(8,8,18,0.95)"
            : "linear-gradient(135deg,rgba(0,20,10,0.95),rgba(0,35,18,0.95))",
          border:       `1px solid ${drawerOpen ? "#1a2a1a" : "#00ff88"}`,
          borderRadius: 6,
          fontFamily:   "'Orbitron',monospace",
          fontSize:     "0.62rem",
          fontWeight:   700,
          letterSpacing:"0.24em",
          color:        drawerOpen ? "#2a3a2a" : "#00ff88",
          textShadow:   drawerOpen ? "none" : "0 0 14px rgba(0,255,136,0.65)",
          boxShadow:    justUnlocked
            ? undefined
            : drawerOpen
              ? "0 4px 16px rgba(0,0,0,0.5)"
              : "0 0 24px rgba(0,255,136,0.22), 0 4px 20px rgba(0,0,0,0.5)",
          animation:    justUnlocked
            ? "hdUnlockPulse 1.4s ease-out, hdBtnAppear 0.6s cubic-bezier(0.16,1,0.3,1)"
            : "hdBtnAppear 0.6s cubic-bezier(0.16,1,0.3,1)",
          transition:   "bottom 0.5s cubic-bezier(0.16,1,0.3,1), background 0.25s, border-color 0.25s, color 0.25s",
          userSelect:   "none",
        }}
      >
        <span style={{fontSize:"1rem"}}>{drawerOpen ? "✕" : "🗂"}</span>
        {drawerOpen ? "CLOSE" : "HINTS"}
        {/* clue counter badge */}
        {!drawerOpen && collectedCount > 0 && (
          <span style={{
            background:"rgba(0,255,136,0.15)",
            border:"1px solid rgba(0,255,136,0.35)",
            borderRadius:10,padding:"1px 7px",
            fontSize:"0.5rem",color:"#00ff88",
          }}>{collectedCount}</span>
        )}
      </div>

      {/* ══ BOTTOM DRAWER ══ */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position:"fixed",inset:0,zIndex:199999,
              background:"rgba(0,0,0,0.6)",
              backdropFilter:"blur(3px)",
            }}
          />

          {/* Drawer panel */}
          <div style={{
            position:     "fixed",
            bottom:       0,
            left:         0,
            right:        0,
            height:       "75vh",
            zIndex:       200000,
            background:   "#020810",
            borderTop:    "1px solid rgba(0,212,255,0.22)",
            boxShadow:    "0 -8px 60px rgba(0,0,0,0.85), 0 -2px 0 rgba(0,212,255,0.14)",
            display:      "flex",
            flexDirection:"column",
            animation:    "hdDrawerIn 0.42s cubic-bezier(0.16,1,0.3,1)",
            overflow:     "hidden",
          }}>

            {/* ── Handle bar ── */}
            <div style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"10px 22px",
              background:"rgba(0,212,255,0.03)",
              borderBottom:"1px solid rgba(0,212,255,0.1)",
              flexShrink:0,
            }}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:30,height:2,background:"linear-gradient(90deg,transparent,#00d4ff)"}}/>
                <span style={{fontFamily:"'Orbitron',monospace",fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.28em",color:"#00d4ff",textShadow:"0 0 14px rgba(0,212,255,0.5)"}}>
                  ANALYST INTEL CENTRE
                </span>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.5rem",color:"#3a5870",letterSpacing:"0.1em"}}>
                  // CLASSIFIED ACCESS
                </span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.52rem",color:"#00ff88"}}>
                  ✓ ALL LEVELS COMPLETE
                </span>
                <div
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    cursor:"pointer",padding:"3px 10px",
                    fontFamily:"'Orbitron',monospace",fontSize:"0.52rem",
                    color:"#3a5870",border:"1px solid #1a2a3a",borderRadius:4,
                    letterSpacing:"0.1em",transition:"all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color="#00d4ff"; e.currentTarget.style.borderColor="rgba(0,212,255,0.35)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color="#3a5870"; e.currentTarget.style.borderColor="#1a2a3a"; }}
                >✕ CLOSE</div>
              </div>
            </div>

            {/* ── Scrollable content ── */}
            <div style={{
              flex:1,overflowY:"auto",overflowX:"hidden",
              padding:"18px 22px 32px",
              scrollbarWidth:"thin",
              scrollbarColor:"rgba(0,212,255,0.18) transparent",
            }}>

              {/* Section 1 — Evidence Log */}
              <SectionDivider label="SECTION 01 — EVIDENCE LOG"/>
              <InvestigationBoardPanel hints={hints}/>

              {/* Section 2 — ID Records */}
              <SectionDivider label="SECTION 02 — PERSONNEL IDENTIFICATION RECORDS"/>

              {/* ID Records page header */}
              <div style={{textAlign:"center",marginBottom:20}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 14px",fontFamily:"'Orbitron',monospace",fontSize:"0.48rem",letterSpacing:"0.2em",color:"#00ff88",border:"1px solid rgba(0,255,136,0.25)",background:"rgba(0,255,136,0.04)",marginBottom:10}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"#00ff88",animation:"hdBlink 0.9s infinite"}}/>
                  ALL ALERTS CLEARED — OPERATION BLACKOUT RESOLVED
                </div>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(0.8rem,2vw,1.5rem)",fontWeight:900,color:"#00d4ff",letterSpacing:"0.22em",textShadow:"0 0 26px rgba(0,212,255,0.4)",marginBottom:6}}>
                  PERSONNEL IDENTIFICATION RECORDS
                </div>
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.56rem",color:"#3a5870",letterSpacing:"0.12em"}}>
                  // BLUE TEAM &amp; RED TEAM — CROSS-REFERENCE WITH INVESTIGATION BOARD //
                </div>
              </div>

              <TeamSection label="🔵 BLUE TEAM — DEFENDERS"  color="#00d4ff" members={blueTeam}/>
              <TeamSection label="🔴 RED TEAM — ADVERSARIES" color="#ff3355" members={redTeam}/>

              {/* Section 3 — Flag Submission */}
              <SectionDivider label="SECTION 03 — CASE CLOSURE & FLAG SUBMISSION"/>
              <FlagSection />
            </div>

            {/* Bottom accent */}
            <div style={{height:2,background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.3) 30%,rgba(0,212,255,0.3) 70%,transparent)",flexShrink:0}}/>
          </div>
        </>
      )}
    </>
  );
}

// ── Tiny helper ─────────────────────────────────────────────────────
function SectionDivider({ label }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
      <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(0,212,255,0.2),transparent)"}}/>
      <span style={{fontFamily:"'Orbitron',monospace",fontSize:"0.44rem",letterSpacing:"0.28em",color:"#3a5870",whiteSpace:"nowrap"}}>{label}</span>
      <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.2))"}}/>
    </div>
  );
}