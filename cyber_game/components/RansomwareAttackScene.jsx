"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ============================================================
// CHANGE THIS: The clean file hash shown to the player
// ============================================================
const FILE_HASH = "3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b";

// ============================================================
// CHANGE THIS: The hint stored in the Clue Vault after VirusTotal
// ============================================================
const HINT_FOR_VAULT = "File hash traced to uploader: Williams Dev — registered origin IP matches suspect workstation.";

// ============================================================
// The owner name shown in the VirusTotal report
// ============================================================
const OWNER_NAME = "Williams Dev";
// ============================================================

export default function RansomwareAttackScene({ onHintCollected, onActiveChange }) {
  // Starts directly in "zooming" — the alert button lives in page.tsx
  const [stage, setStage] = useState("zooming");

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [virusTotalOpen, setVirusTotalOpen] = useState(false);
  const [vtReportOpen, setVtReportOpen] = useState(false);
  const [secured, setSecured] = useState(false);
  const [hashRevealed, setHashRevealed] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanRunning, setScanRunning] = useState(false);
  const [victimId, setVictimId] = useState("");
  const scanRef = useRef(null);

  // Generate victim ID once on mount — avoids hydration mismatch
  useEffect(() => {
    setVictimId(
      Math.random().toString(36).substring(2, 10).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase()
    );
  }, []);

  // FIX: timer-based stage advance instead of onAnimationEnd
  useEffect(() => {
    if (stage === "zooming") {
      const t = setTimeout(() => setStage("desktop"), 700);
      return () => clearTimeout(t);
    }
  }, [stage]);

  // Show sidebar after encrypted screen appears
  useEffect(() => {
    if (stage === "encrypted") {
      const t = setTimeout(() => setSidebarVisible(true), 900);
      return () => clearTimeout(t);
    } else {
      setSidebarVisible(false);
    }
  }, [stage]);

  // Glitch flicker on encrypted screen
  useEffect(() => {
    if (stage !== "encrypted") return;
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 140);
    }, 3200);
    return () => clearInterval(interval);
  }, [stage]);

  function startScan() {
    setScanRunning(true);
    setScanProgress(0);
    let p = 0;
    scanRef.current = setInterval(() => {
      p += Math.random() * 7 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(scanRef.current);
        setScanRunning(false);
        setSecured(true);
      }
      setScanProgress(Math.min(p, 100));
    }, 110);
  }

  function revealHash() {
    setHashRevealed(true);
    if (onHintCollected) onHintCollected(HINT_FOR_VAULT);
  }

  function copyHash() {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(FILE_HASH).then(() => {
        setHashCopied(true);
        setTimeout(() => setHashCopied(false), 2000);
      });
    }
  }

  function resetScene() {
    setStage("idle");
    setSidebarVisible(false);
    setVirusTotalOpen(false);
    setVtReportOpen(false);
    setSecured(false);
    setHashRevealed(false);
    setHashCopied(false);
    setGlitchActive(false);
    setScanProgress(0);
    setScanRunning(false);
    if (scanRef.current) clearInterval(scanRef.current);
    if (onActiveChange) onActiveChange(false);
  }

  const folders = ["Documents", "Photos", "Projects", "Finance", "Personal", "Archives"];

  // ── FULLSCREEN SCENE ───────────────────────────────────────────────
  return (
    <>
      <style>{keyframes}</style>

      <div style={s.overlay}>
        {/* Monitor takes full width, sidebar floats over the right edge */}
        <div
          style={{
            ...s.zoomWrapper,
            animation:
              stage === "zooming"
                ? "sceneZoomIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards"
                : "none",
          }}
        >
          {/* ── MONITOR ── */}
          <div style={s.monitor}>

            {/* Top bar */}
            <div style={s.topBar}>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ ...s.dot, background: "#ff5f57" }} />
                <span style={{ ...s.dot, background: "#febc2e" }} />
                <span style={{ ...s.dot, background: "#28c840" }} />
              </div>
              <span style={s.topBarTitle}>SYSTEM — Terminal v4.2</span>
              <span style={{ width: 52 }} />
            </div>

            {/* ── DESKTOP ── */}
            {(stage === "zooming" || stage === "desktop") && (
              <div style={s.desktopScreen}>
                <div style={s.desktopIcons}>
                  {folders.map((f) => (
                    <div key={f} style={s.desktopIcon}>
                      <span style={{ fontSize: "2rem" }}>📁</span>
                      <span style={s.iconLabel}>{f}</span>
                    </div>
                  ))}
                </div>

                {stage === "desktop" && (
                  <div style={s.runBtnWrapper}>
                    <RunProgramBtn onClick={() => setStage("encrypted")} />
                  </div>
                )}

                <div style={s.taskbar}>
                  <span style={s.taskbarText}>
                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span style={s.taskbarText}>SysOS 11.4</span>
                </div>
              </div>
            )}

            {/* ── ENCRYPTED RED SCREEN ── */}
            {stage === "encrypted" && (
              <div
                style={{
                  ...s.encScreen,
                  animation: glitchActive
                    ? "glitchAnim 0.14s steps(2) forwards"
                    : "fadeInEnc 0.4s ease forwards",
                }}
              >
                <div style={{ fontSize: "3.5rem", filter: "drop-shadow(0 0 12px #ff0000)" }}>
                  💀
                </div>
                <h1 style={s.encHeadline}>ALL YOUR FILES HAVE BEEN ENCRYPTED</h1>
                <div style={s.encDivider} />
                <p style={s.encBody}>
                  Every document, photo, and file on this system has been locked with
                  military-grade encryption. You <strong>cannot</strong> access them
                  without the private decryption key.
                </p>
                <div style={s.encDemand}>
                  <span style={s.encAmount}>₿ 100</span>
                  <span style={s.encLabel}>BITCOIN REQUIRED TO DECRYPT</span>
                </div>
                <p style={s.encTimer}>
                  ⏳ Time remaining before permanent deletion:&nbsp;
                  <CountdownTimer />
                </p>
                <div style={s.encId}>
                  Victim ID:{" "}
                  <code style={{ color: "#ff6666", background: "#1a0000", padding: "2px 6px" }}>
                    {victimId}
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SIDEBAR — fixed to right edge, always visible over monitor ── */}
      {sidebarVisible && (
            <div
              style={{
                ...s.sidebar,
                animation: "slideInSidebar 0.4s ease forwards",
              }}
            >
              <div style={s.sidebarHeader}>⚡ RESPONSE OPTIONS</div>

              <SidebarBtn
                color="#cc8800"
                hoverBg="#1a1000"
                onClick={() =>
                  alert(
                    "💸 Payment portal would open here.\n\nWarning: Paying does NOT guarantee file recovery."
                  )
                }
              >
                <span style={{ fontSize: "1.4rem" }}>₿</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: "0.85rem" }}>Pay Ransom</strong>
                  <small style={{ fontSize: "0.65rem", color: "#777", marginTop: 2 }}>
                    100 BTC via anonymous wallet
                  </small>
                </span>
              </SidebarBtn>

              <SidebarBtn
                color="#00cc66"
                hoverBg="#001a0d"
                onClick={() => setVirusTotalOpen(true)}
              >
                <span style={{ fontSize: "1.4rem" }}>🛡</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: "0.85rem" }}>Analyse Threat</strong>
                  <small style={{ fontSize: "0.65rem", color: "#777", marginTop: 2 }}>
                    Scan &amp; secure your files
                  </small>
                </span>
              </SidebarBtn>

              {/* Back to Game only appears after hint is collected (hashRevealed) */}
              {hashRevealed ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                  <div style={{
                    padding: "7px 10px",
                    background: "#001a0a",
                    border: "1px solid #1a4a1a",
                    borderRadius: 5,
                    fontSize: "0.68rem",
                    color: "#00cc66",
                    fontFamily: "'Courier New', monospace",
                    lineHeight: 1.5,
                  }}>
                    ✅ Clue saved to<br />Investigation Board
                  </div>
                  <button
                    style={{
                      padding: "11px 10px",
                      background: "#0a1a0a",
                      border: "1.5px solid #00cc66",
                      color: "#00cc66",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      borderRadius: 6,
                      letterSpacing: 1,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#00cc66";
                      e.currentTarget.style.color = "#000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#0a1a0a";
                      e.currentTarget.style.color = "#00cc66";
                    }}
                    onClick={resetScene}
                  >
                    ↩ Back to Game
                  </button>
                </div>
              ) : (
                <button style={s.backBtn} onClick={resetScene}>
                  ↩ Back to Game
                </button>
              )}
            </div>
          )}

      {/* ── VIRUSTOTAL MODAL — rendered via portal directly into body ── */}
      {virusTotalOpen && typeof document !== "undefined" && createPortal(
        <div
          style={s.modalBackdrop}
          onClick={() => !scanRunning && setVirusTotalOpen(false)}
        >
          <div style={s.vtModal} onClick={(e) => e.stopPropagation()}>

            <div style={s.vtHeader}>
              <span style={s.vtLogo}>🔬 ThreatScan Pro</span>
              <button
                style={s.vtClose}
                onClick={() => !scanRunning && setVirusTotalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={s.vtBody}>
              <p style={s.vtDesc}>
                Secure and quarantine all affected directories before further damage occurs.
              </p>

              {/* Folder list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {folders.map((f) => (
                  <div key={f} style={s.folderRow}>
                    <span style={{ fontSize: "1rem", width: 20, textAlign: "center" }}>
                      {secured ? "🔒" : "🔓"}
                    </span>
                    <span style={{ flex: 1, color: "#ccc" }}>📁 {f}</span>
                    <span style={{ ...s.folderBadge, ...(secured ? s.badgeSafe : s.badgeDanger) }}>
                      {secured ? "SECURED" : "AT RISK"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Scan progress */}
              {(scanRunning || secured) && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={s.scanBg}>
                    <div style={{ ...s.scanFill, width: `${scanProgress}%` }} />
                  </div>
                  <span style={s.scanPct}>{Math.round(scanProgress)}%</span>
                </div>
              )}

              {/* Secure button */}
              {!secured && !scanRunning && (
                <button style={s.secureBtn} onClick={startScan}>
                  🔐 Secure All Folders
                </button>
              )}

              {/* Post-secure: reveal hash */}
              {secured && !hashRevealed && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ color: "#00cc66", fontSize: "0.9rem", fontWeight: 700, margin: 0, fontFamily: "'Courier New', monospace" }}>
                    ✅ All folders secured successfully.
                  </p>
                  <button style={s.hashBtn} onClick={revealHash}>
                    🔍 Retrieve File Hash
                  </button>
                </div>
              )}

              {/* Hash revealed */}
              {hashRevealed && (
                <div style={s.hashReveal}>
                  <p style={s.hashLabel}>🧬 File Hash Signature Detected:</p>

                  {/* Hash value row with copy button */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <code style={s.hashValue}>{FILE_HASH}</code>
                    <button
                      onClick={copyHash}
                      style={{
                        flexShrink: 0,
                        padding: "6px 10px",
                        background: hashCopied ? "#003318" : "#0a0a1a",
                        border: `1px solid ${hashCopied ? "#00cc66" : "#334"}`,
                        color: hashCopied ? "#00cc66" : "#667",
                        fontFamily: "'Courier New', monospace",
                        fontSize: "0.7rem",
                        cursor: "pointer",
                        borderRadius: 4,
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {hashCopied ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>

                  <p style={{ fontSize: "0.72rem", color: "#445566", margin: 0, fontFamily: "'Courier New', monospace" }}>
                    Copy the hash and search it on VirusTotal to trace the origin.
                  </p>

                  {/* VirusTotal search button */}
                  <button
                    style={s.vtSearchBtn}
                    onClick={() => setVtReportOpen(true)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ff6600";
                      e.currentTarget.style.color = "#000";
                      e.currentTarget.style.boxShadow = "0 0 20px #ff6600";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#1a0a00";
                      e.currentTarget.style.color = "#ff6600";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    🔎 Search on VirusTotal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* ── VIRUSTOTAL REPORT PORTAL ── */}
      {vtReportOpen && typeof document !== "undefined" && createPortal(
        <div style={{ ...s.modalBackdrop, zIndex: 999999 }} onClick={() => setVtReportOpen(false)}>
          <div style={s.vtReport} onClick={(e) => e.stopPropagation()}>

            {/* VT Header bar */}
            <div style={s.vtRHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={s.vtRLogo}>●</span>
                <span style={s.vtRLogoText}>VirusTotal</span>
                <span style={s.vtRBadge}>COMMUNITY</span>
              </div>
              <button style={s.vtClose} onClick={() => setVtReportOpen(false)}>✕ Close</button>
            </div>

            {/* Hash title */}
            <div style={s.vtRHero}>
              <div style={s.vtRHashLabel}>SHA-256</div>
              <div style={s.vtRHashFull}>{FILE_HASH}</div>
              <div style={s.vtRDetectionBadge}>
                <span style={s.vtRDetBig}>58</span>
                <span style={s.vtRDetSub}> / 72 security vendors flagged this file as malicious</span>
              </div>
            </div>

            {/* Detection bar */}
            <div style={s.vtRSection}>
              <div style={s.vtRSectionTitle}>DETECTION OVERVIEW</div>
              <div style={s.vtRBarWrap}>
                <div style={{ ...s.vtRBarFill, width: "80%" }} />
                <div style={{ ...s.vtRBarSafe, width: "20%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginTop: 4 }}>
                <span style={{ color: "#ff4444" }}>58 Malicious</span>
                <span style={{ color: "#888" }}>8 Undetected</span>
                <span style={{ color: "#44ff88" }}>6 Clean</span>
              </div>
            </div>

            {/* File details */}
            <div style={s.vtRSection}>
              <div style={s.vtRSectionTitle}>FILE DETAILS</div>
              <div style={s.vtRTable}>
                {[
                  ["File Type", "Win32 EXE — Portable Executable"],
                  ["File Size", "1.24 MB (1,302,528 bytes)"],
                  ["Magic", "PE32 executable (GUI) Intel 80386"],
                  ["TrID", "Win32 Executable (52.8%)"],
                  ["MD5", "a3f5b92cd88e4f1a9c2b7d083e6f4a12"],
                  ["SHA-1", "d4e8f2a1b9c7630e5f2a8d4b1c9e7f3a2b5d6c8"],
                  ["SHA-256", FILE_HASH],
                  ["Submission Date", "2024-11-14 03:22:17 UTC"],
                  ["First Seen", "2024-11-12 18:44:03 UTC"],
                ].map(([k, v]) => (
                  <div key={k} style={s.vtRRow}>
                    <span style={s.vtRKey}>{k}</span>
                    <span style={s.vtRVal}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── OWNER — the key hint ── */}
            <div style={{ ...s.vtRSection, border: "1px solid #ff660044", background: "#1a0e00", borderRadius: 6, padding: 14 }}>
              <div style={{ ...s.vtRSectionTitle, color: "#ff8800" }}>SUBMITTER / OWNER ATTRIBUTION</div>
              <div style={s.vtRTable}>
                {[
                  ["Registered Owner", OWNER_NAME],
                  ["Account Type", "Free Community Member"],
                  ["First Submission", "2024-11-12 18:44:03 UTC"],
                  ["Total Submissions", "3 (same hash)"],
                  ["Origin Region", "US-EAST / AS14061"],
                  ["Reputation Score", "−42 (Flagged)"],
                ].map(([k, v]) => (
                  <div key={k} style={s.vtRRow}>
                    <span style={s.vtRKey}>{k}</span>
                    <span style={{ ...s.vtRVal, color: k === "Registered Owner" ? "#ffaa44" : "#ccc", fontWeight: k === "Registered Owner" ? 700 : 400 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AV vendor detections */}
            <div style={s.vtRSection}>
              <div style={s.vtRSectionTitle}>SECURITY VENDOR ANALYSIS (sample)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  ["Kaspersky", "Trojan.Win32.Encoder.gen", true],
                  ["Malwarebytes", "Ransom.FileCryptor", true],
                  ["Bitdefender", "Trojan.GenericKD.71238456", true],
                  ["ESET-NOD32", "Win32/Filecoder.NXK", true],
                  ["Avast", "Win32:RansomX-gen [Ransom]", true],
                  ["CrowdStrike", "win/malicious_confidence_100", true],
                  ["Microsoft", "Ransom:Win32/CryptoLocker", true],
                  ["Sophos", "Troj/Ransom-GHK", true],
                  ["TrendMicro", "RANSOM_CRYPT.SM", true],
                  ["McAfee", "RDN/Generic.grp", true],
                  ["Symantec", "Trojan.Cryptolocker", true],
                  ["Webroot", "Undetected", false],
                ].map(([vendor, result, isMal]) => (
                  <div key={vendor} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#0d0d0d", borderRadius: 4, border: "1px solid #1a1a1a" }}>
                    <span style={{ fontSize: "0.72rem", color: "#aaa", fontFamily: "'Courier New', monospace" }}>{vendor}</span>
                    <span style={{ fontSize: "0.65rem", color: isMal ? "#ff5555" : "#44aa66", fontWeight: 700, fontFamily: "'Courier New', monospace" }}>{result}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint callout */}
            <div style={s.vtRHintBox}>
              <p style={s.vtRHintTitle}>🕵️ INVESTIGATOR NOTE</p>
              <p style={s.vtRHintText}>{HINT_FOR_VAULT}</p>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// ── Run Program button ────────────────────────────────────────────
function RunProgramBtn({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "12px 28px",
        background: hovered ? "#44aaff" : "transparent",
        border: "1.5px solid #44aaff",
        color: hovered ? "#000" : "#44aaff",
        fontFamily: "'Courier New', monospace",
        fontSize: "1rem",
        cursor: "pointer",
        letterSpacing: 2,
        transition: "all 0.2s",
        boxShadow: hovered ? "0 0 20px #44aaff" : "none",
      }}
    >
      ▶ Run Program
    </button>
  );
}

// ── Sidebar button ────────────────────────────────────────────────
function SidebarBtn({ children, onClick, color, hoverBg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 12,
        border: `1px solid ${hovered ? color : "#333"}`,
        background: hovered ? hoverBg : "#141414",
        color: "#eee",
        fontFamily: "'Courier New', monospace",
        cursor: "pointer",
        borderRadius: 6,
        textAlign: "left",
        transition: "all 0.2s",
        width: "100%",
      }}
    >
      {children}
    </button>
  );
}

// ── Countdown Timer ───────────────────────────────────────────────
function CountdownTimer() {
  const [secs, setSecs] = useState(47 * 60 + 33);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const sc = String(secs % 60).padStart(2, "0");
  return <strong style={{ color: "#ff2200" }}>{m}:{sc}</strong>;
}

// ── Keyframe animations ───────────────────────────────────────────
const keyframes = `
  @keyframes sceneZoomIn {
    from { transform: scale(0.1); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  @keyframes fadeInEnc {
    from { opacity: 0; transform: scale(1.04); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes glitchAnim {
    0%   { transform: skewX(0deg)  translateX(0);    filter: none; }
    25%  { transform: skewX(-4deg) translateX(4px);  filter: hue-rotate(90deg); }
    50%  { transform: skewX(4deg)  translateX(-4px); filter: hue-rotate(180deg); }
    75%  { transform: skewX(-2deg) translateX(2px);  filter: brightness(1.5); }
    100% { transform: skewX(0deg)  translateX(0);    filter: none; }
  }
  @keyframes slideInSidebar {
    from { transform: translateY(-50%) translateX(100%); opacity: 0; }
    to   { transform: translateY(-50%) translateX(0);    opacity: 1; }
  }
  @keyframes blinkIcon {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes alertPulse {
    0%, 100% { box-shadow: 0 0 8px #ff2200; }
    50%       { box-shadow: 0 0 28px #ff4400, 0 0 48px #ff220055; }
  }
`;

// ── All styles as plain JS objects (no TypeScript) ────────────────
const s = {
  idleWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    minHeight: 120,
  },
  alertBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 28px",
    background: "#1a0000",
    border: "2px solid #ff2200",
    color: "#ff2200",
    fontFamily: "'Courier New', monospace",
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: 2,
    cursor: "pointer",
    textTransform: "uppercase",
    animation: "alertPulse 1.5s infinite",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: 24,
  },
  zoomWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 900,
  },
  monitor: {
    width: "min(760px, calc(100vw - 260px))",
    border: "3px solid #333",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 0 8px #1a1a1a",
    background: "#111",
    flexShrink: 0,
  },
  topBar: {
    background: "#1e1e1e",
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderBottom: "1px solid #333",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    display: "inline-block",
  },
  topBarTitle: {
    fontSize: "0.75rem",
    color: "#888",
    letterSpacing: 1,
    flex: 1,
    textAlign: "center",
    fontFamily: "'Courier New', monospace",
  },
  desktopScreen: {
    background: "radial-gradient(ellipse at 30% 40%, #1a2a4a 0%, #0d1220 100%)",
    minHeight: 460,
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  desktopIcons: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 80px)",
    gap: 16,
    padding: 24,
  },
  desktopIcon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    cursor: "default",
  },
  iconLabel: {
    fontSize: "0.65rem",
    color: "#ccc",
    textAlign: "center",
    fontFamily: "'Courier New', monospace",
  },
  runBtnWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  taskbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(0,0,0,0.7)",
    padding: "6px 16px",
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #333",
  },
  taskbarText: {
    fontSize: "0.7rem",
    color: "#aaa",
    fontFamily: "'Courier New', monospace",
  },
  encScreen: {
    background: "#0d0000",
    minHeight: 460,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 24px",
    gap: 16,
    textAlign: "center",
    borderTop: "4px solid #cc0000",
  },
  encHeadline: {
    fontFamily: "'Courier New', monospace",
    fontSize: "1.4rem",
    fontWeight: 900,
    color: "#ff1a1a",
    letterSpacing: 3,
    textShadow: "0 0 20px #ff0000",
    margin: 0,
    lineHeight: 1.3,
  },
  encDivider: {
    width: "80%",
    height: 2,
    background: "linear-gradient(90deg, transparent, #cc0000, transparent)",
  },
  encBody: {
    color: "#ff6666",
    fontSize: "0.9rem",
    maxWidth: 500,
    lineHeight: 1.6,
    margin: 0,
    fontFamily: "'Courier New', monospace",
  },
  encDemand: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#1a0000",
    border: "2px solid #cc0000",
    padding: "16px 32px",
    margin: "8px 0",
  },
  encAmount: {
    fontSize: "2.4rem",
    fontWeight: 900,
    color: "#ff3300",
    textShadow: "0 0 20px #ff3300",
    fontFamily: "'Courier New', monospace",
  },
  encLabel: {
    fontSize: "0.7rem",
    letterSpacing: 2,
    color: "#cc6666",
    marginTop: 4,
    fontFamily: "'Courier New', monospace",
  },
  encTimer: {
    color: "#ff8888",
    fontSize: "0.8rem",
    margin: 0,
    fontFamily: "'Courier New', monospace",
  },
  encId: {
    color: "#884444",
    fontSize: "0.7rem",
    fontFamily: "'Courier New', monospace",
  },
  sidebar: {
    position: "fixed",
    top: "50%",
    right: 0,
    transform: "translateY(-50%)",
    zIndex: 10000,
    width: 220,
    background: "#0e0e0e",
    border: "1px solid #333",
    borderRight: "none",
    borderRadius: "8px 0 0 8px",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    flexShrink: 0,
    opacity: 0,
    boxShadow: "-4px 0 24px rgba(0,0,0,0.6)",
  },
  sidebarHeader: {
    fontSize: "0.7rem",
    letterSpacing: 2,
    color: "#666",
    textTransform: "uppercase",
    paddingBottom: 8,
    borderBottom: "1px solid #222",
    fontFamily: "'Courier New', monospace",
  },
  backBtn: {
    marginTop: "auto",
    padding: 10,
    background: "transparent",
    border: "1px solid #333",
    color: "#666",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.75rem",
    cursor: "pointer",
    borderRadius: 4,
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.88)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  vtModal: {
    background: "#0f1117",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    width: "min(540px, 95vw)",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: "0 0 60px rgba(0,200,100,0.1)",
  },
  vtHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    background: "#141820",
    borderBottom: "1px solid #222",
    borderRadius: "10px 10px 0 0",
  },
  vtLogo: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#00cc66",
    letterSpacing: 1,
    fontFamily: "'Courier New', monospace",
  },
  vtClose: {
    background: "none",
    border: "none",
    color: "#666",
    fontSize: "1.1rem",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: 4,
  },
  vtBody: {
    padding: "20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  vtDesc: {
    color: "#888",
    fontSize: "0.85rem",
    margin: 0,
    lineHeight: 1.5,
    fontFamily: "'Courier New', monospace",
  },
  folderRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    background: "#141414",
    border: "1px solid #222",
    borderRadius: 6,
    fontSize: "0.82rem",
    fontFamily: "'Courier New', monospace",
  },
  folderBadge: {
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: 1,
    padding: "3px 8px",
    borderRadius: 3,
    fontFamily: "'Courier New', monospace",
  },
  badgeDanger: {
    background: "#2a0000",
    color: "#ff4444",
    border: "1px solid #550000",
  },
  badgeSafe: {
    background: "#002a10",
    color: "#44ff88",
    border: "1px solid #005522",
  },
  scanBg: {
    flex: 1,
    height: 8,
    background: "#1a1a1a",
    borderRadius: 4,
    overflow: "hidden",
    border: "1px solid #333",
  },
  scanFill: {
    height: "100%",
    background: "linear-gradient(90deg, #00aa44, #00ff88)",
    borderRadius: 4,
    transition: "width 0.1s linear",
    boxShadow: "0 0 8px #00ff88",
  },
  scanPct: {
    fontSize: "0.75rem",
    color: "#00cc66",
    width: 36,
    textAlign: "right",
    fontFamily: "'Courier New', monospace",
  },
  secureBtn: {
    padding: "12px 20px",
    background: "#002a10",
    border: "1.5px solid #00cc66",
    color: "#00cc66",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.9rem",
    cursor: "pointer",
    borderRadius: 6,
    letterSpacing: 1,
    fontWeight: 700,
  },
  hashBtn: {
    padding: "11px 18px",
    background: "#0a0a1a",
    border: "1.5px solid #4488ff",
    color: "#4488ff",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.85rem",
    cursor: "pointer",
    borderRadius: 6,
    letterSpacing: 1,
    fontWeight: 700,
  },
  hashReveal: {
    background: "#080810",
    border: "1px solid #334",
    borderRadius: 6,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  hashLabel: {
    color: "#8899ff",
    fontSize: "0.8rem",
    fontWeight: 700,
    margin: 0,
    letterSpacing: 1,
    fontFamily: "'Courier New', monospace",
  },
  hashValue: {
    fontFamily: "'Courier New', monospace",
    fontSize: "0.72rem",
    color: "#aabbff",
    background: "#0d0d1f",
    padding: "8px 10px",
    borderRadius: 4,
    border: "1px solid #2233aa",
    wordBreak: "break-all",
    display: "block",
    lineHeight: 1.6,
    flex: 1,
  },

  // VirusTotal search button
  vtSearchBtn: {
    padding: "11px 16px",
    background: "#1a0a00",
    border: "1.5px solid #ff6600",
    color: "#ff6600",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.88rem",
    cursor: "pointer",
    borderRadius: 6,
    letterSpacing: 1,
    fontWeight: 700,
    transition: "all 0.2s",
  },

  // VirusTotal report modal
  vtReport: {
    background: "#0d0d0d",
    border: "1px solid #222",
    borderRadius: 10,
    width: "min(700px, 96vw)",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 0 80px rgba(255,100,0,0.12)",
    fontFamily: "'Courier New', monospace",
  },
  vtRHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px",
    background: "#111",
    borderBottom: "1px solid #222",
    borderRadius: "10px 10px 0 0",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  vtRLogo: {
    fontSize: "1.2rem",
    color: "#ff6600",
  },
  vtRLogoText: {
    fontSize: "1rem",
    fontWeight: 900,
    color: "#fff",
    letterSpacing: 1,
    fontFamily: "Arial, sans-serif",
  },
  vtRBadge: {
    fontSize: "0.55rem",
    background: "#ff6600",
    color: "#000",
    padding: "2px 6px",
    borderRadius: 3,
    fontWeight: 700,
    letterSpacing: 1,
  },
  vtRHero: {
    padding: "20px 18px 16px",
    background: "linear-gradient(180deg, #150a00 0%, #0d0d0d 100%)",
    borderBottom: "1px solid #222",
  },
  vtRHashLabel: {
    fontSize: "0.65rem",
    color: "#888",
    letterSpacing: 2,
    marginBottom: 6,
  },
  vtRHashFull: {
    fontSize: "0.72rem",
    color: "#ffaa44",
    wordBreak: "break-all",
    lineHeight: 1.6,
    background: "#1a0e00",
    padding: "8px 12px",
    borderRadius: 4,
    border: "1px solid #442200",
    marginBottom: 14,
  },
  vtRDetectionBadge: {
    display: "flex",
    alignItems: "baseline",
    gap: 6,
  },
  vtRDetBig: {
    fontSize: "2.4rem",
    fontWeight: 900,
    color: "#ff3333",
    lineHeight: 1,
    fontFamily: "Arial, sans-serif",
  },
  vtRDetSub: {
    fontSize: "0.82rem",
    color: "#cc5555",
  },
  vtRSection: {
    padding: "14px 18px",
    borderBottom: "1px solid #1a1a1a",
  },
  vtRSectionTitle: {
    fontSize: "0.62rem",
    letterSpacing: 2,
    color: "#555",
    marginBottom: 10,
    fontWeight: 700,
  },
  vtRBarWrap: {
    display: "flex",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    background: "#1a1a1a",
  },
  vtRBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #cc0000, #ff4444)",
  },
  vtRBarSafe: {
    height: "100%",
    background: "#1a3a1a",
  },
  vtRTable: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  vtRRow: {
    display: "flex",
    gap: 12,
    padding: "5px 0",
    borderBottom: "1px solid #111",
  },
  vtRKey: {
    width: 160,
    flexShrink: 0,
    fontSize: "0.72rem",
    color: "#666",
  },
  vtRVal: {
    fontSize: "0.72rem",
    color: "#ccc",
    wordBreak: "break-all",
    lineHeight: 1.5,
  },
  vtRHintBox: {
    margin: "0 18px 18px",
    background: "#0a1a0a",
    border: "1px solid #1a4a1a",
    borderLeft: "4px solid #00cc66",
    borderRadius: "0 6px 6px 0",
    padding: "12px 14px",
  },
  vtRHintTitle: {
    margin: "0 0 6px",
    fontSize: "0.75rem",
    color: "#00cc66",
    fontWeight: 700,
    letterSpacing: 1,
  },
  vtRHintText: {
    margin: 0,
    fontSize: "0.78rem",
    color: "#88ccaa",
    lineHeight: 1.6,
  },
};