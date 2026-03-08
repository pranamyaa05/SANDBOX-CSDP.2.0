"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const PASSWORD_CLUE =
  "System hardened: MFA enabled across all admin accounts. Brute-force vector eliminated — attack surface reduced by 94%.";

// Security options shown after strong password is set
// Only MFA is the correct choice
const SECURITY_OPTIONS = [
  {
    id: "mfa",
    icon: "📱",
    label: "Multi-Factor Authentication",
    desc: "Require a second verification step on every login",
    correct: true,
  },
  {
    id: "hint",
    icon: "💡",
    label: "Password Hint",
    desc: "Store a plaintext hint next to the password field",
    correct: false,
    danger: "Password hints can expose credentials to social engineering attacks.",
  },
  {
    id: "remember",
    icon: "🍪",
    label: "Remember Me (30 days)",
    desc: "Keep all admin sessions logged in for 30 days",
    correct: false,
    danger: "Persistent sessions allow attackers to hijack accounts via stolen cookies.",
  },
  {
    id: "simple",
    icon: "🔑",
    label: "Simplified Password Policy",
    desc: "Allow shorter passwords for ease of access",
    correct: false,
    danger: "Weak password policies are the #1 cause of credential-based breaches.",
  },
  {
    id: "shared",
    icon: "👥",
    label: "Shared Admin Account",
    desc: "Use one shared account for the entire IT team",
    correct: false,
    danger: "Shared credentials make auditing impossible and dramatically increase risk.",
  },
];

function checkPassword(pw) {
  return {
    length:    pw.length >= 12 && pw.length <= 16,
    upper:     /[A-Z]/.test(pw),
    lower:     /[a-z]/.test(pw),
    number:    /[0-9]/.test(pw),
    special:   /[^A-Za-z0-9]/.test(pw),
  };
}

export default function PasswordSecurityScene({ onHintCollected, onActiveChange }) {
  // step: "password" → "options" → "done"
  const [step, setStep]                 = useState("password");
  const [password, setPassword]         = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [toggledOptions, setToggledOptions] = useState({});
  const [dangerMsg, setDangerMsg]       = useState("");
  const [dangerOption, setDangerOption] = useState("");
  const [mfaEnabled, setMfaEnabled]     = useState(false);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const checks   = checkPassword(password);
  const allPass  = Object.values(checks).every(Boolean);

  function handleToggle(opt) {
    if (opt.correct) {
      setMfaEnabled(true);
      setDangerMsg("");
      setDangerOption("");
      setToggledOptions((prev) => ({ ...prev, [opt.id]: true }));
      // Fire hint
      setTimeout(() => {
        if (onHintCollected) onHintCollected(PASSWORD_CLUE);
        setStep("done");
      }, 900);
      return;
    }
    // Wrong option — show danger and toggle off after 2.5s
    setDangerOption(opt.id);
    setDangerMsg(opt.danger);
    setToggledOptions((prev) => ({ ...prev, [opt.id]: true }));
    setTimeout(() => {
      setToggledOptions((prev) => ({ ...prev, [opt.id]: false }));
      setDangerMsg("");
      setDangerOption("");
    }, 2500);
  }

  function resetScene() {
    setStep("password");
    setPassword("");
    setShowPw(false);
    setToggledOptions({});
    setDangerMsg("");
    setDangerOption("");
    setMfaEnabled(false);
    if (onActiveChange) onActiveChange(false);
  }

  if (!mounted) return null;

  return createPortal(
    <>
      <style>{keyframes}</style>

      {/* Full-screen dark backdrop */}
      <div style={s.backdrop}>

        {/* Centred modal card */}
        <div style={{ ...s.card, animation: "popIn 0.45s cubic-bezier(0.16,1,0.3,1) forwards" }}>

          {/* ── Header ── */}
          <div style={s.header}>
            <div style={s.headerLeft}>
              <span style={s.headerIcon}>🔐</span>
              <div>
                <div style={s.headerTitle}>PASSWORD SECURITY ALERT</div>
                <div style={s.headerSub}>CORP-SYS — All Workstations</div>
              </div>
            </div>
            <div style={s.stepPill}>
              Step {step === "password" ? "1" : step === "options" ? "2" : "3"} / 3
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={s.divider} />

          {/* ════════════════════════════════════
              STEP 1 — CREATE STRONG PASSWORD
          ════════════════════════════════════ */}
          {step === "password" && (
            <div style={s.body}>
              <p style={s.intro}>
                A credential breach has been detected on the corporate network.<br />
                <strong style={{ color: "#ffaa44" }}>You must create a strong password</strong> to
                re-secure all company systems immediately.
              </p>

              {/* Password input */}
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>🔑</span>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password…"
                  style={s.input}
                  maxLength={20}
                  autoComplete="new-password"
                  spellCheck={false}
                />
                <button style={s.eyeBtn} onClick={() => setShowPw((v) => !v)}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>

              {/* Strength bar */}
              <StrengthBar checks={checks} password={password} />

              {/* Rules checklist */}
              <div style={s.rules}>
                {[
                  { key: "length",  label: "12 – 16 characters" },
                  { key: "upper",   label: "At least 1 uppercase letter (A–Z)" },
                  { key: "lower",   label: "At least 1 lowercase letter (a–z)" },
                  { key: "number",  label: "At least 1 number (0–9)" },
                  { key: "special", label: "At least 1 special character (!@#$…)" },
                ].map(({ key, label }) => (
                  <div key={key} style={s.ruleRow}>
                    <span style={{ color: checks[key] ? "#00cc66" : "#444", fontSize: "0.8rem" }}>
                      {checks[key] ? "✓" : "○"}
                    </span>
                    <span style={{ color: checks[key] ? "#88ccaa" : "#556", fontSize: "0.75rem" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Submit button — disabled until all rules pass */}
              <button
                style={{
                  ...s.submitBtn,
                  opacity:  allPass ? 1 : 0.35,
                  cursor:   allPass ? "pointer" : "not-allowed",
                  background: allPass ? "#0a2a0a" : "#111",
                  border:   `1.5px solid ${allPass ? "#00cc66" : "#333"}`,
                  color:    allPass ? "#00cc66" : "#444",
                  boxShadow: allPass ? "0 0 16px rgba(0,200,100,0.2)" : "none",
                }}
                disabled={!allPass}
                onClick={() => setStep("options")}
              >
                {allPass ? "✓ Password accepted — Continue →" : "Set a strong password to continue"}
              </button>
            </div>
          )}

          {/* ════════════════════════════════════
              STEP 2 — CHOOSE SECURITY OPTIONS
          ════════════════════════════════════ */}
          {step === "options" && (
            <div style={s.body}>
              <p style={s.intro}>
                Password set successfully. Now choose additional security measures<br />
                to <strong style={{ color: "#ffaa44" }}>safeguard all company accounts</strong>.
                Enable the correct option to proceed.
              </p>

              <div style={s.optionList}>
                {SECURITY_OPTIONS.map((opt) => {
                  const isOn     = toggledOptions[opt.id];
                  const isDanger = dangerOption === opt.id;
                  return (
                    <div
                      key={opt.id}
                      style={{
                        ...s.optionRow,
                        background:  isDanger ? "#1a0000" : isOn && opt.correct ? "#001a0a" : "#0f0f0f",
                        border:      isDanger ? "1px solid #cc2222"
                                   : isOn && opt.correct ? "1px solid #00cc66"
                                   : "1px solid #1a1a1a",
                        animation:   isDanger ? "shakeRow 0.4s ease" : "none",
                      }}
                    >
                      <div style={s.optionLeft}>
                        <span style={{ fontSize: "1.3rem" }}>{opt.icon}</span>
                        <div>
                          <div style={{
                            ...s.optionLabel,
                            color: isDanger ? "#ff4444" : isOn && opt.correct ? "#00cc66" : "#ccc",
                          }}>
                            {opt.label}
                            {isDanger && <span style={s.dangerBadge}>⚠ RISKY</span>}
                            {isOn && opt.correct && <span style={s.safeBadge}>✓ ENABLED</span>}
                          </div>
                          <div style={s.optionDesc}>{opt.desc}</div>
                        </div>
                      </div>
                      {/* Toggle switch */}
                      <div
                        style={{
                          ...s.toggle,
                          background: isOn && opt.correct ? "#00cc66"
                                    : isDanger ? "#cc2222"
                                    : "#1a1a1a",
                        }}
                        onClick={() => !mfaEnabled && handleToggle(opt)}
                      >
                        <div style={{
                          ...s.toggleKnob,
                          transform: isOn ? "translateX(20px)" : "translateX(2px)",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Danger message */}
              {dangerMsg && (
                <div style={s.dangerBox}>
                  <span style={{ fontSize: "1.1rem" }}>🚨</span>
                  <p style={s.dangerText}>{dangerMsg}</p>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════
              STEP 3 — SUCCESS
          ════════════════════════════════════ */}
          {step === "done" && (
            <div style={{ ...s.body, alignItems: "center", textAlign: "center", gap: 20 }}>
              <div style={s.successIcon}>🛡</div>
              <div>
                <p style={s.successTitle}>System Secured</p>
                <p style={s.successSub}>
                  Multi-Factor Authentication has been enabled across all admin accounts.<br />
                  The credential attack vector has been eliminated.
                </p>
              </div>

              <div style={s.clueReveal}>
                <p style={s.clueRevealTitle}>🕵️ CLUE ADDED TO INVESTIGATION BOARD</p>
                <p style={s.clueRevealText}>{PASSWORD_CLUE}</p>
              </div>

              <button
                style={s.backBtn}
                onClick={resetScene}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#00cc66";
                  e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0a1a0a";
                  e.currentTarget.style.color = "#00cc66";
                }}
              >
                ↩ Back to Game
              </button>
            </div>
          )}

          {/* ── Footer with step indicators ── */}
          {step !== "done" && (
            <div style={s.footer}>
              <button style={s.cancelBtn} onClick={resetScene}>✕ Exit</button>
              <div style={s.dots}>
                {["password", "options"].map((st, i) => (
                  <div
                    key={st}
                    style={{
                      ...s.dot,
                      background: step === st ? "#00cc66"
                                : (step === "options" && i === 0) ? "#226622"
                                : "#1a1a1a",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>,
    document.body
  );
}

// ── Strength bar ──────────────────────────────────────────────────
function StrengthBar({ checks, password }) {
  if (!password) return null;
  const score   = Object.values(checks).filter(Boolean).length;
  const labels  = ["", "Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors  = ["", "#cc2222", "#cc4400", "#cc8800", "#88cc00", "#00cc66"];
  const widths  = ["0%", "20%", "40%", "60%", "80%", "100%"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: widths[score],
          background: colors[score],
          borderRadius: 2,
          transition: "width 0.3s ease, background 0.3s ease",
        }} />
      </div>
      <span style={{ fontSize: "0.68rem", color: colors[score], fontFamily: "'Courier New', monospace", textAlign: "right" }}>
        {labels[score]}
      </span>
    </div>
  );
}

// ── Keyframes ─────────────────────────────────────────────────────
const keyframes = `
  @keyframes popIn {
    from { transform: scale(0.85); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }
  @keyframes shakeRow {
    0%   { transform: translateX(0); }
    20%  { transform: translateX(-6px); }
    40%  { transform: translateX(6px); }
    60%  { transform: translateX(-4px); }
    80%  { transform: translateX(4px); }
    100% { transform: translateX(0); }
  }
  @keyframes blinkIcon {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
`;

// ── Styles ─────────────────────────────────────────────────────────
const s = {
  backdrop: {
    position:       "fixed",
    inset:          0,
    zIndex:         99990,
    background:     "rgba(0,0,0,0.88)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    padding:        20,
    backdropFilter: "blur(4px)",
  },
  card: {
    background:   "#0b0b0b",
    border:       "1px solid #1e2e1e",
    borderRadius: 12,
    width:        "min(600px, 96vw)",
    maxHeight:    "92vh",
    overflowY:    "auto",
    boxShadow:    "0 0 80px rgba(0,200,100,0.1), 0 0 0 1px #111",
    display:      "flex",
    flexDirection: "column",
  },
  header: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    padding:        "16px 20px",
    background:     "#0e0e0e",
    borderRadius:   "12px 12px 0 0",
    flexShrink:     0,
  },
  headerLeft: {
    display:     "flex",
    alignItems:  "center",
    gap:         12,
  },
  headerIcon: { fontSize: "1.6rem" },
  headerTitle: {
    fontSize:     "0.78rem",
    fontWeight:   700,
    color:        "#00cc66",
    letterSpacing: 2,
    fontFamily:   "'Courier New', monospace",
    textTransform: "uppercase",
  },
  headerSub: {
    fontSize:   "0.65rem",
    color:      "#445",
    fontFamily: "'Courier New', monospace",
    marginTop:  2,
  },
  stepPill: {
    fontSize:    "0.65rem",
    color:       "#4466cc",
    background:  "#0a0a1a",
    border:      "1px solid #1a1a3a",
    borderRadius: 20,
    padding:     "3px 10px",
    fontFamily:  "'Courier New', monospace",
    fontWeight:  700,
  },
  divider: {
    height:     1,
    background: "#1a1a1a",
    flexShrink: 0,
  },
  body: {
    padding:       "20px 24px",
    display:       "flex",
    flexDirection: "column",
    gap:           16,
    flex:          1,
  },
  intro: {
    fontSize:   "0.8rem",
    color:      "#889988",
    lineHeight: 1.7,
    margin:     0,
    fontFamily: "'Courier New', monospace",
  },
  inputWrap: {
    display:     "flex",
    alignItems:  "center",
    gap:         8,
    background:  "#0a0a0a",
    border:      "1px solid #222",
    borderRadius: 6,
    padding:     "2px 8px",
  },
  inputIcon: { fontSize: "1rem", flexShrink: 0 },
  input: {
    flex:        1,
    background:  "transparent",
    border:      "none",
    outline:     "none",
    color:       "#ccddcc",
    fontFamily:  "'Courier New', monospace",
    fontSize:    "0.9rem",
    padding:     "10px 4px",
    letterSpacing: 1,
  },
  eyeBtn: {
    background:  "transparent",
    border:      "none",
    cursor:      "pointer",
    fontSize:    "1rem",
    padding:     "4px",
    flexShrink:  0,
  },
  rules: {
    display:       "flex",
    flexDirection: "column",
    gap:           7,
    background:    "#0a0a0a",
    border:        "1px solid #1a1a1a",
    borderRadius:  6,
    padding:       "12px 14px",
  },
  ruleRow: {
    display:     "flex",
    alignItems:  "center",
    gap:         10,
    fontFamily:  "'Courier New', monospace",
  },
  submitBtn: {
    padding:      "13px 16px",
    borderRadius: 7,
    fontFamily:   "'Courier New', monospace",
    fontSize:     "0.85rem",
    fontWeight:   700,
    letterSpacing: 1,
    transition:   "all 0.25s",
    textAlign:    "center",
  },
  // Options step
  optionList: {
    display:       "flex",
    flexDirection: "column",
    gap:           8,
  },
  optionRow: {
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "space-between",
    padding:         "12px 14px",
    borderRadius:    7,
    transition:      "all 0.2s",
    gap:             12,
  },
  optionLeft: {
    display:    "flex",
    alignItems: "center",
    gap:        12,
    flex:       1,
    minWidth:   0,
  },
  optionLabel: {
    fontSize:   "0.82rem",
    fontWeight: 600,
    fontFamily: "'Courier New', monospace",
    display:    "flex",
    alignItems: "center",
    gap:        8,
    flexWrap:   "wrap",
  },
  optionDesc: {
    fontSize:   "0.68rem",
    color:      "#445",
    fontFamily: "'Courier New', monospace",
    marginTop:  3,
    lineHeight: 1.4,
  },
  dangerBadge: {
    fontSize:    "0.6rem",
    background:  "#330000",
    color:       "#ff4444",
    border:      "1px solid #662222",
    borderRadius: 4,
    padding:     "1px 6px",
    fontWeight:  700,
    letterSpacing: 1,
  },
  safeBadge: {
    fontSize:    "0.6rem",
    background:  "#003300",
    color:       "#00cc66",
    border:      "1px solid #116611",
    borderRadius: 4,
    padding:     "1px 6px",
    fontWeight:  700,
    letterSpacing: 1,
  },
  toggle: {
    width:        44,
    height:       24,
    borderRadius: 12,
    cursor:       "pointer",
    flexShrink:   0,
    position:     "relative",
    transition:   "background 0.25s",
    display:      "flex",
    alignItems:   "center",
  },
  toggleKnob: {
    width:        20,
    height:       20,
    borderRadius: "50%",
    background:   "#fff",
    position:     "absolute",
    transition:   "transform 0.25s",
    boxShadow:    "0 1px 4px rgba(0,0,0,0.4)",
  },
  dangerBox: {
    display:      "flex",
    alignItems:   "flex-start",
    gap:          10,
    background:   "#1a0000",
    border:       "1px solid #441111",
    borderLeft:   "4px solid #cc2222",
    borderRadius: "0 6px 6px 0",
    padding:      "10px 14px",
    animation:    "popIn 0.3s ease",
  },
  dangerText: {
    margin:     0,
    fontSize:   "0.75rem",
    color:      "#ff8888",
    fontFamily: "'Courier New', monospace",
    lineHeight: 1.6,
  },
  // Success step
  successIcon: {
    fontSize:   "3.5rem",
    lineHeight: 1,
    filter:     "drop-shadow(0 0 16px rgba(0,200,100,0.5))",
  },
  successTitle: {
    margin:     "0 0 6px",
    fontSize:   "1.2rem",
    fontWeight: 700,
    color:      "#00cc66",
    fontFamily: "'Courier New', monospace",
    letterSpacing: 2,
  },
  successSub: {
    margin:     0,
    fontSize:   "0.78rem",
    color:      "#889988",
    lineHeight: 1.7,
    fontFamily: "'Courier New', monospace",
  },
  clueReveal: {
    background:   "#0a1a0a",
    border:       "1px solid #1a4a1a",
    borderLeft:   "4px solid #00cc66",
    borderRadius: "0 6px 6px 0",
    padding:      "12px 16px",
    width:        "100%",
    textAlign:    "left",
  },
  clueRevealTitle: {
    margin:      "0 0 6px",
    fontSize:    "0.68rem",
    color:       "#00cc66",
    fontWeight:  700,
    letterSpacing: 1,
    fontFamily:  "'Courier New', monospace",
  },
  clueRevealText: {
    margin:     0,
    fontSize:   "0.75rem",
    color:      "#88ccaa",
    lineHeight: 1.65,
    fontFamily: "'Courier New', monospace",
  },
  backBtn: {
    padding:      "12px 32px",
    background:   "#0a1a0a",
    border:       "1.5px solid #00cc66",
    color:        "#00cc66",
    fontFamily:   "'Courier New', monospace",
    fontSize:     "0.9rem",
    fontWeight:   700,
    cursor:       "pointer",
    borderRadius: 7,
    letterSpacing: 1,
    transition:   "all 0.2s",
  },
  // Footer
  footer: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    padding:        "12px 20px",
    borderTop:      "1px solid #1a1a1a",
    flexShrink:     0,
  },
  cancelBtn: {
    background:  "transparent",
    border:      "1px solid #333",
    color:       "#555",
    fontFamily:  "'Courier New', monospace",
    fontSize:    "0.72rem",
    cursor:      "pointer",
    padding:     "6px 14px",
    borderRadius: 4,
  },
  dots: {
    display: "flex",
    gap:     8,
  },
  dot: {
    width:        8,
    height:       8,
    borderRadius: "50%",
    transition:   "background 0.3s",
  },
};