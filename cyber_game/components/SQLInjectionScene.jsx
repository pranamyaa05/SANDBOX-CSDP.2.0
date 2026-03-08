"use client";
import { useState, useRef, useEffect } from "react";

const FIXED_CLUE =
  "SQL Injection breach confirmed: admin account bypassed via auth-bypass payload `admin'#`. Stolen credentials exfiltrated — attacker identity encoded in audio log.";

export default function SQLInjectionScene({ onHintCollected, onActiveChange }) {
  const [phase, setPhase] = useState("alert"); // alert | login | breach | note
  const [noteText, setNoteText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [termLines, setTermLines] = useState([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef(null);
  const termRef = useRef(null);

  const TERMINAL_SEQUENCE = [
    "> Authenticating user: admin'#",
    "> Password check: [BYPASSED]",
    "> SQL query executed: SELECT * FROM users WHERE name='admin'#' AND pass='GPLWUL'",
    "> Comment operator detected — password clause nullified.",
    "> Auth result: GRANTED",
    "> WARNING: Privileged session opened.",
    "> DB dump initiated... exfiltrating records...",
    "> Audio log attached to session. Retrieving...",
    "> [COMPLETE] Attacker identity encoded in audio file.",
  ];

  useEffect(() => {
    onActiveChange(true);
    return () => onActiveChange(false);
  }, []);

  // Typewriter terminal effect
  useEffect(() => {
    if (phase !== "breach") return;
    if (lineIndex >= TERMINAL_SEQUENCE.length) return;
    const delay = lineIndex === 0 ? 400 : 700;
    const t = setTimeout(() => {
      setTermLines((prev) => [...prev, TERMINAL_SEQUENCE[lineIndex]]);
      setLineIndex((i) => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [phase, lineIndex]);

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [termLines]);

  // After terminal finishes, move to note phase
  useEffect(() => {
    if (lineIndex >= TERMINAL_SEQUENCE.length && phase === "breach") {
      const t = setTimeout(() => setPhase("note"), 900);
      return () => clearTimeout(t);
    }
  }, [lineIndex, phase]);

  function handleLogin() {
    setPhase("breach");
    setTermLines([]);
    setLineIndex(0);
    // Play audio
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }

  function handleSubmitNote() {
    onHintCollected(FIXED_CLUE);
    setSubmitted(true);
  }

  function handleClose() {
    onActiveChange(false);
  }

  return (
    <div style={s.overlay}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/audio/blahblah2.wav"
        onCanPlayThrough={() => setAudioReady(true)}
        style={{ display: "none" }}
      />

      <div style={s.window}>

        {/* ── TITLE BAR ── */}
        <div style={s.titleBar}>
          <span style={s.titleDot} />
          <span style={{ ...s.titleDot, background: "#ffaa00" }} />
          <span style={{ ...s.titleDot, background: "#00cc66" }} />
          <span style={s.titleText}>DB-SRV-01 — Database Terminal &nbsp;|&nbsp; SQL INJECTION INCIDENT</span>
          <button style={s.closeBtn} onClick={handleClose}>✕</button>
        </div>

        {/* ══ PHASE: ALERT ══ */}
        {phase === "alert" && (
          <div style={s.body}>
            <div style={s.alertBanner}>
              <div style={s.alertIcon}>⚠</div>
              <div>
                <div style={s.alertTitle}>CRITICAL — SQL INJECTION DETECTED</div>
                <div style={s.alertSub}>Database authentication system compromised. Unauthorised login attempt in progress.</div>
              </div>
            </div>
            <div style={s.infoRow}>
              <InfoItem label="Target DB" value="corp-auth.sqlite" />
              <InfoItem label="Attack Vector" value="Auth bypass via comment injection" />
              <InfoItem label="Severity" value="CRITICAL" valueColor="#ff2200" />
              <InfoItem label="Status" value="ACTIVE — session open" valueColor="#ff6600" />
            </div>
            <p style={s.desc}>
              An attacker is exploiting a SQL injection vulnerability in the login form.
              Observe the attack unfold — authenticate with the malicious credentials to capture evidence.
            </p>
            <button style={s.primaryBtn} onClick={() => setPhase("login")}>
              ▶ OPEN LOGIN PANEL
            </button>
          </div>
        )}

        {/* ══ PHASE: LOGIN ══ */}
        {phase === "login" && (
          <div style={s.body}>
            <div style={s.loginFrame}>
              <div style={s.loginHeader}>
                <div style={s.loginLogo}>🛡 CORP-AUTH</div>
                <div style={s.loginSubtitle}>Internal Database Access Portal</div>
              </div>

              {/* Username field */}
              <div style={s.fieldWrap}>
                <label style={s.fieldLabel}>USERNAME</label>
                <div style={s.fieldBox}>
                  <span style={s.fieldValue}>admin</span>
                  <span style={s.injectedPart}>'#</span>
                  <span style={s.cursor}>▌</span>
                </div>
                <div style={s.injectionTag}>⚠ SQL INJECTION PAYLOAD DETECTED</div>
              </div>

              {/* Password field */}
              <div style={s.fieldWrap}>
                <label style={s.fieldLabel}>PASSWORD</label>
                <div style={{ ...s.fieldBox, letterSpacing: 4 }}>
                  <span style={{ color: "#556" }}>••••••</span>
                </div>
                <div style={{ ...s.injectionTag, color: "#666", borderColor: "#333" }}>
                  (will be nullified by comment operator)
                </div>
              </div>

              <button style={s.loginBtn} onClick={handleLogin}>
                LOGIN →
              </button>

              <div style={s.loginFooter}>
                Simulated attack environment — for training purposes only
              </div>
            </div>
          </div>
        )}

        {/* ══ PHASE: BREACH ══ */}
        {phase === "breach" && (
          <div style={s.body}>
            <div style={s.breachHeader}>
              <span style={s.breachDot} />
              DATABASE BREACH IN PROGRESS
            </div>
            <div style={s.terminal} ref={termRef}>
              {termLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    ...s.termLine,
                    color: line.startsWith("> WARNING") || line.startsWith("> [COMPLETE]")
                      ? "#ff6600"
                      : line.startsWith("> Auth result")
                      ? "#ff2200"
                      : "#00cc66",
                  }}
                >
                  {line}
                </div>
              ))}
              {lineIndex < TERMINAL_SEQUENCE.length && (
                <div style={{ ...s.termLine, color: "#006633" }}>▌</div>
              )}
            </div>
            {/* Download audio */}
            <div style={s.audioRow}>
              <span style={{ color: "#9933ff", fontSize: "0.75rem" }}>🎵 Audio log intercepted —</span>
              <a
                href="/audio/blahblah2.wav"
                download="db-session-audio-log.wav"
                style={s.downloadLink}
              >
                ⬇ DOWNLOAD AUDIO LOG
              </a>
            </div>
          </div>
        )}

        {/* ══ PHASE: NOTE ══ */}
        {phase === "note" && (
          <div style={s.body}>
            <div style={s.breachHeader}>
              <span style={{ ...s.breachDot, background: "#9933ff" }} />
              EVIDENCE CAPTURED — LOG YOUR FINDINGS
            </div>

            {/* Audio player + download */}
            <div style={s.audioPanel}>
              <div style={s.audioPanelTitle}>🎵 Intercepted Audio Log</div>
              <audio controls src="/audio/audio.wav" style={s.audioPlayer} />
              <a
                href="/audio/audio.wav"
                download="db-session-audio-log.wav"
                style={s.downloadLink}
              >
                ⬇ Download Audio File
              </a>
            </div>

            {!submitted ? (
              <>
                <div style={s.noteLabel}>
                  📝 What did you find? Log your notes below:
                </div>
                <textarea
                  style={s.noteArea}
                  placeholder="Enter your findings from the audio log..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                />
                <div style={s.noteHint}>
                  ⚠ Your observation will be recorded to the investigation board.
                </div>
                <button
                  style={{
                    ...s.primaryBtn,
                    opacity: noteText.trim() ? 1 : 0.4,
                    cursor: noteText.trim() ? "pointer" : "not-allowed",
                  }}
                  onClick={noteText.trim() ? handleSubmitNote : undefined}
                >
                  📋 SUBMIT FINDINGS TO BOARD
                </button>
              </>
            ) : (
              <div style={s.successBox}>
                <div style={s.successTitle}>✓ CLUE LOGGED TO INVESTIGATION BOARD</div>
                <p style={s.successText}>
                  SQL injection attack confirmed. The attacker bypassed authentication using a comment-based payload.
                  Evidence has been forwarded to the case file.
                </p>
                <p style={{ ...s.successText, color: "#9933ff88", fontSize: "0.68rem", marginTop: 4 }}>
                  Your note: "{noteText}"
                </p>
                <button style={{ ...s.primaryBtn, marginTop: 12 }} onClick={handleClose}>
                  ✕ CLOSE TERMINAL
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Small info item ───────────────────────────────────────────────────────────
function InfoItem({ label, value, valueColor = "#99aabb" }) {
  return (
    <div style={s.infoItem}>
      <span style={s.infoLabel}>{label}</span>
      <span style={{ ...s.infoValue, color: valueColor }}>{value}</span>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const PURPLE = "#9933ff";

const s = {
  overlay: {
    position:       "fixed",
    inset:          0,
    background:     "rgba(0,0,0,0.88)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    zIndex:         10000,
    fontFamily:     "'Courier New', monospace",
    backdropFilter: "blur(3px)",
  },
  window: {
    width:        "min(680px, 96vw)",
    maxHeight:    "90vh",
    background:   "#080810",
    border:       `1px solid ${PURPLE}55`,
    borderRadius: 10,
    boxShadow:    `0 0 40px ${PURPLE}33, 0 0 80px #00000088`,
    overflow:     "hidden",
    display:      "flex",
    flexDirection:"column",
  },
  titleBar: {
    display:     "flex",
    alignItems:  "center",
    gap:         8,
    padding:     "10px 16px",
    background:  "#0d0d1a",
    borderBottom:`1px solid ${PURPLE}33`,
    flexShrink:  0,
  },
  titleDot: {
    width:        12,
    height:       12,
    borderRadius: "50%",
    background:   "#ff2200",
    flexShrink:   0,
  },
  titleText: {
    flex:          1,
    fontSize:      "0.68rem",
    color:         "#6644aa",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginLeft:    4,
  },
  closeBtn: {
    background:   "transparent",
    border:       "none",
    color:        "#443366",
    cursor:       "pointer",
    fontSize:     "0.9rem",
    padding:      "2px 6px",
  },
  body: {
    padding:       "20px 22px",
    overflowY:     "auto",
    display:       "flex",
    flexDirection: "column",
    gap:           16,
    flex:          1,
  },

  // Alert phase
  alertBanner: {
    display:      "flex",
    gap:          14,
    alignItems:   "flex-start",
    background:   "#1a0808",
    border:       "1px solid #550000",
    borderLeft:   `4px solid #ff2200`,
    borderRadius: "0 6px 6px 0",
    padding:      "14px 16px",
  },
  alertIcon: { fontSize: "1.6rem", lineHeight: 1, flexShrink: 0, color: "#ff2200" },
  alertTitle: { fontSize: "0.82rem", fontWeight: 700, color: "#ff4422", letterSpacing: 1 },
  alertSub:   { fontSize: "0.72rem", color: "#996655", marginTop: 4 },
  infoRow: {
    display:       "flex",
    flexDirection: "column",
    gap:           6,
    background:    "#0c0c18",
    border:        `1px solid ${PURPLE}22`,
    borderRadius:  6,
    padding:       "12px 14px",
  },
  infoItem: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { fontSize: "0.65rem", color: "#445", letterSpacing: 1, textTransform: "uppercase" },
  infoValue: { fontSize: "0.72rem", fontWeight: 700 },
  desc: {
    margin:     0,
    fontSize:   "0.74rem",
    color:      "#556677",
    lineHeight: 1.65,
  },

  // Login phase
  loginFrame: {
    background:    "#0a0a16",
    border:        `1px solid ${PURPLE}44`,
    borderRadius:  8,
    padding:       "22px 24px",
    display:       "flex",
    flexDirection: "column",
    gap:           14,
    maxWidth:      400,
    margin:        "0 auto",
    width:         "100%",
  },
  loginHeader:   { textAlign: "center" },
  loginLogo:     { fontSize: "1.1rem", color: PURPLE, fontWeight: 700, letterSpacing: 2 },
  loginSubtitle: { fontSize: "0.63rem", color: "#446", marginTop: 4, letterSpacing: 1 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 4 },
  fieldLabel: { fontSize: "0.62rem", color: "#446", letterSpacing: 1.5, textTransform: "uppercase" },
  fieldBox: {
    background:   "#0d0d1f",
    border:       `1px solid ${PURPLE}44`,
    borderRadius: 4,
    padding:      "9px 12px",
    fontSize:     "0.82rem",
    color:        "#aabbcc",
    display:      "flex",
    alignItems:   "center",
    gap:          2,
  },
  injectedPart: { color: "#ff2200", fontWeight: 700 },
  cursor: { color: "#9933ff", animation: "blink 1s step-end infinite" },
  injectionTag: {
    fontSize:   "0.6rem",
    color:      "#ff3300",
    borderLeft: "2px solid #ff330066",
    paddingLeft: 6,
  },
  loginBtn: {
    background:    PURPLE,
    border:        "none",
    color:         "#fff",
    fontFamily:    "'Courier New', monospace",
    fontWeight:    700,
    fontSize:      "0.82rem",
    letterSpacing: 2,
    padding:       "10px",
    borderRadius:  4,
    cursor:        "pointer",
    marginTop:     4,
    textTransform: "uppercase",
  },
  loginFooter: { fontSize: "0.6rem", color: "#2a2a3a", textAlign: "center" },

  // Breach phase
  breachHeader: {
    display:       "flex",
    alignItems:    "center",
    gap:           8,
    fontSize:      "0.7rem",
    fontWeight:    700,
    color:         "#ff4400",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  breachDot: {
    width:        8,
    height:       8,
    borderRadius: "50%",
    background:   "#ff2200",
    boxShadow:    "0 0 6px #ff2200",
    animation:    "breachPulse 0.8s ease-in-out infinite",
    flexShrink:   0,
  },
  terminal: {
    background:  "#020208",
    border:      "1px solid #0a0a1a",
    borderRadius: 6,
    padding:     "14px 16px",
    minHeight:   180,
    maxHeight:   260,
    overflowY:   "auto",
    display:     "flex",
    flexDirection:"column",
    gap:         6,
  },
  termLine: {
    fontSize:   "0.74rem",
    lineHeight: 1.5,
  },
  audioRow: {
    display:    "flex",
    gap:        12,
    alignItems: "center",
    flexWrap:   "wrap",
  },

  // Note phase
  audioPanel: {
    background:    "#0d0814",
    border:        `1px solid ${PURPLE}44`,
    borderRadius:  6,
    padding:       "14px 16px",
    display:       "flex",
    flexDirection: "column",
    gap:           10,
  },
  audioPanelTitle: { fontSize: "0.7rem", color: PURPLE, fontWeight: 700, letterSpacing: 1 },
  audioPlayer: { width: "100%", accentColor: PURPLE },
  downloadLink: {
    fontSize:   "0.7rem",
    color:      PURPLE,
    textDecoration: "underline",
    cursor:     "pointer",
  },
  noteLabel: { fontSize: "0.74rem", color: "#8899aa", letterSpacing: 0.5 },
  noteArea: {
    background:  "#0c0c18",
    border:      `1px solid ${PURPLE}44`,
    borderRadius: 5,
    color:       "#aabbcc",
    fontFamily:  "'Courier New', monospace",
    fontSize:    "0.76rem",
    padding:     "10px 12px",
    resize:      "vertical",
    outline:     "none",
    lineHeight:  1.6,
  },
  noteHint: {
    fontSize:  "0.63rem",
    color:     "#443344",
    fontStyle: "italic",
  },
  primaryBtn: {
    background:    "#1a0830",
    border:        `1px solid ${PURPLE}`,
    color:         PURPLE,
    fontFamily:    "'Courier New', monospace",
    fontWeight:    700,
    fontSize:      "0.78rem",
    letterSpacing: 1.5,
    padding:       "11px 16px",
    borderRadius:  5,
    cursor:        "pointer",
    textTransform: "uppercase",
    transition:    "background 0.2s",
  },
  successBox: {
    background:    "#0a0515",
    border:        `1px solid ${PURPLE}66`,
    borderLeft:    `4px solid ${PURPLE}`,
    borderRadius:  "0 6px 6px 0",
    padding:       "14px 16px",
    display:       "flex",
    flexDirection: "column",
    gap:           8,
  },
  successTitle: {
    fontSize:      "0.75rem",
    fontWeight:    700,
    color:         PURPLE,
    letterSpacing: 1,
  },
  successText: {
    margin:     0,
    fontSize:   "0.74rem",
    color:      "#8866aa",
    lineHeight: 1.6,
  },
};