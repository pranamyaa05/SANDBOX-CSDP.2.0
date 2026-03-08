"use client";
import { useState } from "react";

// Labels for each hint slot — 5 levels
const HINT_LABELS = [
  "🔴 Level 1 — Ransomware File Hash Trace",
  "🟠 Level 2 — Network C2 Beacon Analysis",
  "🔵 Level 3 — Password Security Hardening",
  "🟡 Level 4 — Phishing Email Triage",
  "🟣 Level 5 — SQL Injection DB Breach",
];

// Slot colours matching each level
const SLOT_COLORS = ["#ff2200", "#ff6600", "#4466ff", "#ffcc00", "#9933ff"];

// Match a hint string to its level slot (0-indexed). Returns -1 for player notes.
function matchHintToSlot(hint) {
  if (hint.includes("[Player Note]"))                                                        return -1;
  if (hint.includes("Ransomware") || hint.includes("SHA-256") || hint.includes("payload"))  return 0;
  if (hint.includes("C2")         || hint.includes("beacon")  || hint.includes("JN_TRIST")) return 1;
  if (hint.includes("MFA")        || hint.includes("hardened")|| hint.includes("Brute-force")) return 2;
  if (hint.includes("Phishing")   || hint.includes("phishing")|| hint.includes("triage"))   return 3;
  if (hint.includes("SQL")        || hint.includes("injection")|| hint.includes("bypass"))   return 4;
  return -1;
}

export default function InvestigationBoard({ hints }) {
  const [expanded, setExpanded] = useState(true);

  // Build slotted clues (one per level slot)
  const slottedHints = [null, null, null, null, null];
  const playerNotes  = [];

  hints.forEach((h) => {
    const slot = matchHintToSlot(h);
    if (slot === -1) {
      playerNotes.push(h.replace("[Player Note] ", ""));
    } else if (!slottedHints[slot]) {
      slottedHints[slot] = h;
    }
  });

  const collectedCount = slottedHints.filter(Boolean).length;
  const allComplete    = collectedCount >= HINT_LABELS.length;

  return (
    <div style={s.board}>

      {/* ── HEADER ── */}
      <div style={s.header} onClick={() => setExpanded((e) => !e)}>
        <div style={s.headerLeft}>
          <span style={s.icon}>🗂</span>
          <span style={s.title}>INVESTIGATION BOARD</span>
          <span style={s.badge}>{collectedCount} / {HINT_LABELS.length}</span>
        </div>
        <span style={{ color: "#445", fontSize: "0.8rem", cursor: "pointer" }}>
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {expanded && (
        <div style={s.body}>

          {/* ── PROGRESS BAR ── */}
          <div style={s.progressWrap}>
            <div style={s.progressBg}>
              <div
                style={{
                  ...s.progressFill,
                  width: `${(collectedCount / HINT_LABELS.length) * 100}%`,
                }}
              />
            </div>
            <span style={s.progressLabel}>
              {collectedCount === 0
                ? "No clues yet"
                : allComplete
                ? "All clues collected"
                : `${collectedCount} of ${HINT_LABELS.length} collected`}
            </span>
          </div>

          {/* ── HINT SLOTS ── */}
          <div style={s.slotList}>
            {HINT_LABELS.map((label, i) => {
              const hint  = slottedHints[i];
              const color = SLOT_COLORS[i];
              return (
                <div
                  key={i}
                  style={{
                    ...s.slot,
                    background:  hint ? "#0d0d1f" : "#0a0a0a",
                    border:      hint ? `1px solid ${color}44` : "1px dashed #1a1a2a",
                    borderLeft:  hint ? `3px solid ${color}`   : "1px dashed #1a1a2a",
                  }}
                >
                  <div style={{ ...s.slotLabel, color: hint ? color : "#2a2a3a" }}>
                    {label}
                  </div>
                  {hint ? (
                    <p style={s.slotText}>{hint}</p>
                  ) : (
                    <p style={s.slotPlaceholder}>
                      — Complete the investigation to unlock this clue —
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── PLAYER NOTES (from Level 4 hint notepad) ── */}
          {playerNotes.length > 0 && (
            <div style={s.notesSection}>
              <div style={s.notesTitle}>📝 ANALYST NOTES ({playerNotes.length})</div>
              {playerNotes.map((note, i) => (
                <div key={i} style={s.noteItem}>{note}</div>
              ))}
            </div>
          )}

          {/* ── FINAL CASE SUMMARY — shows when all 4 clues collected ── */}
          {allComplete && (
            <div style={s.summaryBox}>
              <p style={s.summaryTitle}>🕵️ CASE SUMMARY — INVESTIGATION COMPLETE</p>
              <p style={s.summaryText}>
                The encrypted payload was submitted by{" "}
                <strong style={{ color: "#ffaa44" }}>Williams Dev</strong>. The C2
                beacon hostname <strong style={{ color: "#ffaa44" }}>JN_TRIST</strong>{" "}
                maps to <strong style={{ color: "#ffaa44" }}>J. Tristan, IT Dept</strong>.
                All systems hardened with MFA. A coordinated phishing campaign of 3
                malicious emails was intercepted and quarantined. A SQL injection attack
                bypassed database authentication — attacker identity confirmed via audio log.
                The insider threat actor has been identified and the attack surface eliminated.
              </p>
              <div style={s.summaryVerdict}>
                ⚠ PERPETRATOR:{" "}
                <span style={{ color: "#ff6644" }}>J. TRISTAN (Williams Dev)</span>
              </div>
              <div style={{ ...s.summaryVerdict, background: "#0a1a0a", border: "1px solid #1a4a1a", color: "#00cc66", marginTop: 6 }}>
                ✓ SYSTEMS SECURED — ALL THREATS NEUTRALISED
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────────
const s = {
  board: {
    background:   "#0b0b14",
    border:       "1px solid #1a1a2e",
    borderRadius: 8,
    fontFamily:   "'Courier New', monospace",
    width:        "min(480px, 95vw)",
    boxShadow:    "0 0 24px rgba(68,100,255,0.07)",
    overflow:     "hidden",
  },
  header: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    padding:        "11px 14px",
    background:     "#0e0e1a",
    borderBottom:   "1px solid #1a1a2e",
    cursor:         "pointer",
    userSelect:     "none",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  icon:  { fontSize: "1rem" },
  title: {
    fontSize:      "0.68rem",
    fontWeight:    700,
    color:         "#4466cc",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  badge: {
    fontSize:     "0.6rem",
    background:   "#1a1a3a",
    color:        "#4466cc",
    border:       "1px solid #2233aa44",
    borderRadius: 10,
    padding:      "1px 7px",
    fontWeight:   700,
  },
  body: {
    padding:       "12px 14px",
    display:       "flex",
    flexDirection: "column",
    gap:           12,
  },
  progressWrap: { display: "flex", flexDirection: "column", gap: 5 },
  progressBg: {
    height:       6,
    background:   "#1a1a2a",
    borderRadius: 3,
    overflow:     "hidden",
    border:       "1px solid #222",
  },
  progressFill: {
    height:       "100%",
    background:   "linear-gradient(90deg, #2244aa, #4488ff)",
    borderRadius: 3,
    transition:   "width 0.6s ease",
    boxShadow:    "0 0 8px #4488ff88",
  },
  progressLabel: {
    fontSize:  "0.65rem",
    color:     "#446",
    textAlign: "right",
  },
  slotList: { display: "flex", flexDirection: "column", gap: 8 },
  slot: {
    borderRadius:  5,
    padding:       "10px 12px",
    display:       "flex",
    flexDirection: "column",
    gap:           5,
    transition:    "border 0.4s, background 0.4s",
  },
  slotLabel: {
    fontSize:      "0.65rem",
    fontWeight:    700,
    letterSpacing: 1,
  },
  slotText: {
    margin:     0,
    fontSize:   "0.72rem",
    color:      "#99aabb",
    lineHeight: 1.6,
  },
  slotPlaceholder: {
    margin:     0,
    fontSize:   "0.68rem",
    color:      "#2a2a3a",
    fontStyle:  "italic",
  },
  notesSection: {
    background:   "#0a100a",
    border:       "1px solid #1a3a1a",
    borderRadius: 5,
    padding:      "10px 12px",
  },
  notesTitle: {
    fontSize:      "0.65rem",
    fontWeight:    700,
    color:         "#446644",
    letterSpacing: 1,
    marginBottom:  6,
  },
  noteItem: {
    fontSize:     "0.68rem",
    color:        "#557755",
    lineHeight:   1.5,
    padding:      "4px 0",
    borderBottom: "1px solid #1a2a1a",
  },
  summaryBox: {
    background:    "#0e1808",
    border:        "1px solid #2a4a1a",
    borderLeft:    "4px solid #88cc44",
    borderRadius:  "0 6px 6px 0",
    padding:       "12px 14px",
    display:       "flex",
    flexDirection: "column",
    gap:           8,
    marginTop:     4,
  },
  summaryTitle: {
    margin:        0,
    fontSize:      "0.72rem",
    fontWeight:    700,
    color:         "#88cc44",
    letterSpacing: 1,
  },
  summaryText: {
    margin:     0,
    fontSize:   "0.74rem",
    color:      "#99bb88",
    lineHeight: 1.65,
  },
  summaryVerdict: {
    fontSize:      "0.78rem",
    fontWeight:    700,
    color:         "#cc8844",
    background:    "#1a1000",
    border:        "1px solid #443300",
    padding:       "8px 12px",
    borderRadius:  4,
    letterSpacing: 1,
  },
};