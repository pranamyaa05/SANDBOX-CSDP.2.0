"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// ============================================================
// CLUE — stored in Investigation Board after player completes level
// ============================================================
const NETWORK_CLUE =
  "C2 beacon identified: User-Agent '2000#@!' linked to custom implant. Device hostname JN_TRIST matches internal asset register — registered to J. Tristan, IT Dept.";
// ============================================================

// Packet table rows
const PACKETS = [
  {
    no: 1,
    src: "192.168.1.14",
    dst: "104.21.8.55",
    proto: "TCP",
    info: "SYN",
    safe: true,
    details: {
      timestamp: "2024-11-14 03:12:01.443",
      length: "60 bytes",
      ttl: "64",
      flags: "SYN",
      seq: "0",
      ack: "0",
      window: "65535",
      summary:
        "Standard TCP handshake initiation. Source port 54821 → Destination port 80. Nothing anomalous at this stage.",
    },
  },
  {
    no: 2,
    src: "104.21.8.55",
    dst: "192.168.1.14",
    proto: "TCP",
    info: "SYN-ACK",
    safe: true,
    details: {
      timestamp: "2024-11-14 03:12:01.521",
      length: "60 bytes",
      ttl: "55",
      flags: "SYN, ACK",
      seq: "0",
      ack: "1",
      window: "14600",
      summary:
        "Remote host acknowledged connection. Standard three-way handshake response. Normal network behavior.",
    },
  },
  {
    no: 3,
    src: "192.168.1.14",
    dst: "104.21.8.55",
    proto: "HTTP",
    info: "GET /update",
    safe: true,
    details: {
      timestamp: "2024-11-14 03:12:01.634",
      length: "312 bytes",
      ttl: "64",
      flags: "PSH, ACK",
      method: "GET",
      uri: "/update",
      host: "update-control.net",
      userAgent: "Mozilla/5.0 (compatible)",
      summary:
        "HTTP GET to /update. User-Agent appears standard. Could be legitimate software update check — monitor for follow-up traffic.",
    },
  },
  {
    no: 4,
    src: "192.168.1.14",
    dst: "104.21.8.55",
    proto: "HTTP",
    info: "GET /command?id=JN",
    safe: true,
    details: {
      timestamp: "2024-11-14 03:12:04.011",
      length: "418 bytes",
      ttl: "64",
      flags: "PSH, ACK",
      method: "GET",
      uri: "/command?id=JN_TRIST",
      host: "update-control.net",
      userAgent: "MjAwMA==",
      deviceHostname: "JN_TRIST",
      summary:
        "HTTP GET request to /command endpoint. Contains query parameter. Inspect User-Agent and URI carefully.",
    },
  },
];

export default function NetworkIntrusionScene({ onHintCollected, onActiveChange }) {
  // Starts directly in "zooming" — the alert button lives in page.tsx
  const [stage, setStage] = useState("zooming");
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [actionsApplied, setActionsApplied] = useState([]);
  const [clueUnlocked, setClueUnlocked] = useState(false);
  const [showCluePopup, setShowCluePopup] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [packetCount, setPacketCount] = useState(4);
  const [wrongAction, setWrongAction] = useState(false);
  const [filterText, setFilterText] = useState("");

  // Zoom-in timer — same pattern as Level 1
  useEffect(() => {
    if (stage === "zooming") {
      const t = setTimeout(() => {
        setCapturing(true);
        setStage("wireshark");
      }, 700);
      return () => clearTimeout(t);
    }
  }, [stage]);

  // Simulate live packet counter
  useEffect(() => {
    if (stage !== "wireshark") return;
    const t = setInterval(() => {
      setPacketCount((p) => p + Math.floor(Math.random() * 3 + 1));
    }, 1800);
    return () => clearInterval(t);
  }, [stage]);

  function applyAction(action) {
    if (action === "Ignore") {
      setWrongAction(true);
      setTimeout(() => setWrongAction(false), 2000);
      return;
    }
    setActionsApplied((prev) => {
      const next = prev.includes(action) ? prev : [...prev, action];
      if (next.includes("Block IP") && next.includes("Isolate Host") && !clueUnlocked) {
        setTimeout(() => {
          setClueUnlocked(true);
          setShowCluePopup(true);
          if (onHintCollected) onHintCollected(NETWORK_CLUE);
        }, 500);
      }
      return next;
    });
  }

  function resetScene() {
    setStage("idle");
    setSelectedPacket(null);
    setActionsApplied([]);
    setClueUnlocked(false);
    setShowCluePopup(false);
    setCapturing(false);
    setPacketCount(4);
    setWrongAction(false);
    setFilterText("");
    if (onActiveChange) onActiveChange(false);
  }

  // ── FULLSCREEN WIRESHARK WINDOW ───────────────────────────────────
  return (
    <>
      <style>{keyframes}</style>

      <div style={s.overlay}>
        <div
          style={{
            ...s.zoomWrapper,
            animation:
              stage === "zooming"
                ? "sceneZoomIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards"
                : "none",
          }}
        >
          <div style={s.wsWindow}>

            {/* ── Title bar ── */}
            <div style={s.wsTopBar}>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ ...s.dot, background: "#ff5f57" }} />
                <span style={{ ...s.dot, background: "#febc2e" }} />
                <span style={{ ...s.dot, background: "#28c840" }} />
              </div>
              <span style={s.wsTitle}>
                🦈 PacketScope — WS-03 Live Capture
                &nbsp;
                <span
                  style={{
                    color: capturing ? "#44ff88" : "#666",
                    animation: capturing ? "blinkIcon 1s step-end infinite" : "none",
                  }}
                >
                  ●
                </span>
                &nbsp;
                <span style={{ color: capturing ? "#44ff88" : "#666", fontSize: "0.65rem" }}>
                  {capturing ? "CAPTURING" : "STOPPED"}
                </span>
              </span>
              <button style={s.wsCloseBtn} onClick={resetScene}>✕ Exit</button>
            </div>

            {/* ── Toolbar ── */}
            <div style={s.wsToolbar}>
              <button style={s.wsToolBtn} onClick={() => setCapturing((c) => !c)}>
                {capturing ? "⏹ Stop" : "▶ Start"}
              </button>
              <button style={s.wsToolBtn}>🔄 Restart</button>
              <div style={s.wsFilterRow}>
                <span style={s.wsFilterLabel}>Filter:</span>
                <input
                  style={s.wsFilterInput}
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder='e.g. http or ip.src == 192.168.1.14'
                  spellCheck={false}
                />
                <button style={{ ...s.wsToolBtn, padding: "3px 10px" }}>Apply</button>
              </div>
              <span style={s.wsPacketCount}>{packetCount} packets captured</span>
            </div>

            {/* ── Packet table ── */}
            <div style={s.wsTableWrap}>
              <table style={s.wsTable}>
                <thead>
                  <tr>
                    {["No.", "Time", "Source IP", "Destination IP", "Protocol", "Info"].map((h) => (
                      <th key={h} style={s.wsTh}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PACKETS.map((pkt) => (
                    <tr
                      key={pkt.no}
                      onClick={() => setSelectedPacket(pkt)}
                      style={{
                        ...s.wsTr,
                        background: selectedPacket?.no === pkt.no ? "#1a3a1a" : "transparent",
                        borderLeft: "3px solid transparent",
                        cursor: "pointer",
                      }}
                    >
                      <td style={s.wsTd}>{pkt.no}</td>
                      <td style={s.wsTd}>{pkt.details.timestamp.split(" ")[1]}</td>
                      <td style={{ ...s.wsTd, color: "#88ccff" }}>{pkt.src}</td>
                      <td style={{ ...s.wsTd, color: "#ffaa44" }}>{pkt.dst}</td>
                      <td style={{ ...s.wsTd, color: pkt.proto === "HTTP" ? "#ff9944" : "#44aaff", fontWeight: 600 }}>
                        {pkt.proto}
                      </td>
                      <td style={{ ...s.wsTd, color: "#999" }}>
                        {pkt.info}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Packet detail pane ── */}
            <div style={s.wsDetailPane}>
              {!selectedPacket ? (
                <p style={s.wsDetailHint}>
                  ↑ Click any packet row to inspect its full contents
                </p>
              ) : (
                <PacketDetail pkt={selectedPacket} />
              )}
            </div>

            {/* ── Status bar ── */}
            <div style={s.wsStatusBar}>
              <span>Packets: {packetCount} captured, 4 displayed</span>
              <span>Interface: eth0 — WS-03</span>
              <span>Capture duration: 00:00:03</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTION SIDEBAR — appears when packet #4 is selected ── */}
      {selectedPacket?.no === 4 && (
        <div
          style={{
            ...s.actionSidebar,
            animation: "slideInSidebar 0.4s ease forwards",
          }}
        >
          <div style={s.actionHeader}>⚡ RESPONSE ACTIONS</div>
          <p style={s.actionSub}>
            Packet #4 flagged as C2 beacon. Choose your response:
          </p>

          {["Block IP", "Isolate Host", "Ignore"].map((action) => {
            const applied = actionsApplied.includes(action);
            const isWrong = action === "Ignore";
            const color = isWrong ? "#cc4444" : "#00cc66";
            return (
              <button
                key={action}
                onClick={() => applyAction(action)}
                style={{
                  ...s.actionBtn,
                  border: `1px solid ${applied ? color : "#333"}`,
                  background: applied ? (isWrong ? "#1a0000" : "#001a0a") : "#141414",
                  color: applied ? color : "#ccc",
                }}
              >
                {applied ? (isWrong ? "✗ " : "✓ ") : "○ "}
                {action}
              </button>
            );
          })}

          {wrongAction && (
            <div style={s.wrongMsg}>
              ✗ Ignoring C2 traffic exposes the network to further compromise.
            </div>
          )}

          {clueUnlocked && (
            <button style={s.clueBtn} onClick={() => setShowCluePopup(true)}>
              🕵️ View Hidden Clue
            </button>
          )}

          <button style={s.backBtn} onClick={resetScene}>
            ↩ Back to Game
          </button>
        </div>
      )}

      {/* ── CLUE POPUP — portal into body ── */}
      {showCluePopup &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={s.popupBackdrop}
            onClick={() => setShowCluePopup(false)}
          >
            <div
              style={s.popupBox}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={s.popupHeader}>
                <span style={s.popupTitle}>🔍 HIDDEN CLUE DISCOVERED</span>
                <button style={s.popupClose} onClick={() => setShowCluePopup(false)}>
                  ✕
                </button>
              </div>
              <div style={s.popupBody}>
                <p style={s.popupLabel}>📦 Packet Metadata Extracted from Packet #4:</p>

                <div style={s.metaTable}>
                  {[
                    ["Device Hostname", "JN_TRIST"],
                    ["User-Agent", "2000#@!"],
                    ["C2 Domain", "update-control.net"],
                    ["Beacon ID", "JN_TRIST"],
                    ["Source IP", "192.168.1.14"],
                    ["Timestamp", "2024-11-14 03:12:04 UTC"],
                  ].map(([k, v]) => (
                    <div key={k} style={s.metaRow}>
                      <span style={s.metaKey}>{k}</span>
                      <span
                        style={{
                          ...s.metaVal,
                          color:
                            k === "Device Hostname" || k === "User-Agent"
                              ? "#ffaa44"
                              : "#ccc",
                          fontWeight:
                            k === "Device Hostname" || k === "User-Agent"
                              ? 700
                              : 400,
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={s.clueHighlight}>
                  <p style={s.clueHighlightTitle}>🕵️ CLUE ADDED TO INVESTIGATION BOARD</p>
                  <p style={s.clueHighlightText}>{NETWORK_CLUE}</p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

// ── Packet detail tree ────────────────────────────────────────────
function PacketDetail({ pkt }) {
  const d = pkt.details;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <DetailSection title={`▼ Frame ${pkt.no}  [${d.length}]`} defaultOpen>
        <MRow k="Arrival Time" v={d.timestamp} />
        <MRow k="Frame Length" v={d.length} />
        <MRow k="TTL" v={d.ttl} />
      </DetailSection>

      <DetailSection title="▼ Internet Protocol / TCP">
        <MRow k="Source IP" v={pkt.src} color="#88ccff" />
        <MRow k="Destination IP" v={pkt.dst} color="#ffaa44" />
        <MRow k="Flags" v={d.flags} />
        <MRow k="Seq" v={d.seq} />
        <MRow k="Ack" v={d.ack} />
        <MRow k="Window Size" v={d.window} />
      </DetailSection>

      {pkt.proto === "HTTP" && (
        <DetailSection
          title="▼ Hypertext Transfer Protocol"
          defaultOpen={pkt.no === 4}
        >
          <MRow k="Method" v={d.method} />
          <MRow k="Request URI" v={d.uri} color="#ccc" />
          <MRow k="Host" v={d.host} color="#ccc" />
          <MRow k="User-Agent" v={d.userAgent} color="#ccc" />
          {d.deviceHostname && (
            <MRow k="Device Hostname" v={d.deviceHostname} color="#ccc" />
          )}
        </DetailSection>
      )}

      <DetailSection title="▼ Analyst Notes" defaultOpen>
        <p
          style={{
            margin: 0,
            fontSize: "0.73rem",
            color: "#778877",
            lineHeight: 1.65,
            fontFamily: "'Courier New', monospace",
          }}
        >
          {d.summary}
        </p>
      </DetailSection>
    </div>
  );
}

function DetailSection({ title, children, highlight, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div
      style={{
        border: `1px solid ${highlight ? "#ff440033" : "#1e2a1e"}`,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "5px 10px",
          background: highlight ? "#1e0900" : "#131a13",
          cursor: "pointer",
          fontSize: "0.72rem",
          color: highlight ? "#ff9944" : "#557755",
          fontFamily: "'Courier New', monospace",
          userSelect: "none",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? title : title.replace("▼", "▶")}
      </div>
      {open && (
        <div
          style={{
            padding: "8px 14px",
            background: "#0d100d",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function MRow({ k, v, color }) {
  return (
    <div style={{ display: "flex", gap: 12, fontSize: "0.7rem" }}>
      <span
        style={{
          width: 140,
          flexShrink: 0,
          color: "#445544",
          fontFamily: "'Courier New', monospace",
        }}
      >
        {k}:
      </span>
      <span
        style={{
          color: color || "#99aa99",
          fontFamily: "'Courier New', monospace",
          wordBreak: "break-all",
        }}
      >
        {v}
      </span>
    </div>
  );
}

// ── Keyframes ─────────────────────────────────────────────────────
const keyframes = `
  @keyframes sceneZoomIn {
    from { transform: scale(0.1); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
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
    0%, 100% { box-shadow: 0 0 8px #ff6600; }
    50%       { box-shadow: 0 0 28px #ff8800, 0 0 48px #ff660033; }
  }
  @keyframes wrongShake {
    0%   { transform: translateX(0); }
    20%  { transform: translateX(-6px); }
    40%  { transform: translateX(6px); }
    60%  { transform: translateX(-4px); }
    80%  { transform: translateX(4px); }
    100% { transform: translateX(0); }
  }
`;

// ── Styles ─────────────────────────────────────────────────────────
const s = {
  idleWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    minHeight: 140,
    padding: 12,
  },
  alertCard: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    textAlign: "center",
  },
  alertTopRow: { display: "flex", alignItems: "center", gap: 8 },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#ff6600",
    display: "inline-block",
    animation: "blinkIcon 0.8s step-end infinite",
  },
  alertTag: {
    fontSize: "0.65rem",
    color: "#ff6600",
    letterSpacing: 2,
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
  },
  alertBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 22px",
    background: "#1a0800",
    border: "2px solid #ff6600",
    color: "#ff6600",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.9rem",
    fontWeight: 700,
    letterSpacing: 1,
    cursor: "pointer",
    textTransform: "uppercase",
    animation: "alertPulse 1.5s infinite",
  },
  alertSub: {
    fontSize: "0.75rem",
    color: "#665544",
    margin: 0,
    lineHeight: 1.7,
    fontFamily: "'Courier New', monospace",
  },
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
    background: "#080c08",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  zoomWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 1000,
  },
  wsWindow: {
    width: "min(950px, calc(100vw - 250px))",
    background: "#121812",
    border: "2px solid #1e2e1e",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 0 60px rgba(0,100,0,0.2), 0 0 0 6px #0a0a0a",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  wsTopBar: {
    background: "#1a2a1a",
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderBottom: "1px solid #1e2e1e",
    flexShrink: 0,
  },
  dot: { width: 12, height: 12, borderRadius: "50%", display: "inline-block" },
  wsTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: "0.74rem",
    color: "#668866",
    fontFamily: "'Courier New', monospace",
    letterSpacing: 1,
  },
  wsCloseBtn: {
    background: "none",
    border: "none",
    color: "#556",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontFamily: "'Courier New', monospace",
    padding: "2px 8px",
    borderRadius: 3,
    border: "1px solid #333",
  },
  wsToolbar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    background: "#111811",
    borderBottom: "1px solid #1a1a1a",
    flexShrink: 0,
    flexWrap: "wrap",
  },
  wsToolBtn: {
    padding: "4px 12px",
    background: "#1a2a1a",
    border: "1px solid #2a3a2a",
    color: "#668866",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.72rem",
    cursor: "pointer",
    borderRadius: 3,
  },
  wsFilterRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 200,
  },
  wsFilterLabel: {
    fontSize: "0.7rem",
    color: "#556655",
    fontFamily: "'Courier New', monospace",
    whiteSpace: "nowrap",
  },
  wsFilterInput: {
    flex: 1,
    background: "#0a100a",
    border: "1px solid #2a3a2a",
    color: "#668866",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.7rem",
    padding: "3px 8px",
    borderRadius: 3,
    outline: "none",
  },
  wsPacketCount: {
    fontSize: "0.65rem",
    color: "#445544",
    fontFamily: "'Courier New', monospace",
    whiteSpace: "nowrap",
  },
  wsTableWrap: {
    overflowY: "auto",
    maxHeight: 190,
    flexShrink: 0,
  },
  wsTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.72rem",
    fontFamily: "'Courier New', monospace",
  },
  wsTh: {
    padding: "5px 10px",
    background: "#1a2a1a",
    color: "#446644",
    textAlign: "left",
    borderBottom: "1px solid #1e2e1e",
    fontWeight: 700,
    letterSpacing: 1,
    fontSize: "0.62rem",
    position: "sticky",
    top: 0,
  },
  wsTr: {
    borderBottom: "1px solid #141414",
    transition: "background 0.15s",
  },
  wsTd: {
    padding: "5px 10px",
    color: "#889988",
    whiteSpace: "nowrap",
  },
  wsDetailPane: {
    flex: 1,
    overflowY: "auto",
    padding: 12,
    background: "#0d110d",
    borderTop: "1px solid #1a1a1a",
    minHeight: 160,
  },
  wsDetailHint: {
    color: "#334433",
    fontSize: "0.75rem",
    fontFamily: "'Courier New', monospace",
    margin: "40px auto",
    textAlign: "center",
  },
  wsStatusBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 12px",
    background: "#0d0d0d",
    borderTop: "1px solid #1a1a1a",
    fontSize: "0.63rem",
    color: "#334433",
    fontFamily: "'Courier New', monospace",
    flexShrink: 0,
    flexWrap: "wrap",
    gap: 8,
  },
  actionSidebar: {
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
    gap: 10,
    flexShrink: 0,
    opacity: 0,
    boxShadow: "-4px 0 24px rgba(0,0,0,0.7)",
  },
  actionHeader: {
    fontSize: "0.7rem",
    letterSpacing: 2,
    color: "#666",
    textTransform: "uppercase",
    paddingBottom: 8,
    borderBottom: "1px solid #222",
    fontFamily: "'Courier New', monospace",
  },
  actionSub: {
    fontSize: "0.72rem",
    color: "#556",
    margin: 0,
    lineHeight: 1.5,
    fontFamily: "'Courier New', monospace",
  },
  actionBtn: {
    padding: "10px 12px",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.82rem",
    cursor: "pointer",
    borderRadius: 5,
    textAlign: "left",
    transition: "all 0.2s",
    fontWeight: 600,
  },
  wrongMsg: {
    fontSize: "0.68rem",
    color: "#cc4444",
    fontFamily: "'Courier New', monospace",
    lineHeight: 1.5,
    border: "1px solid #441111",
    background: "#1a0000",
    padding: "6px 8px",
    borderRadius: 4,
    animation: "wrongShake 0.4s ease",
  },
  clueBtn: {
    padding: "9px 12px",
    background: "#0a1a0a",
    border: "1.5px solid #00cc66",
    color: "#00cc66",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.8rem",
    cursor: "pointer",
    borderRadius: 5,
    fontWeight: 700,
  },
  backBtn: {
    marginTop: "auto",
    padding: 9,
    background: "transparent",
    border: "1px solid #333",
    color: "#666",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.72rem",
    cursor: "pointer",
    borderRadius: 4,
  },
  popupBackdrop: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.92)",
    zIndex: 999999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  popupBox: {
    background: "#0d0d0d",
    border: "1px solid #1e2e1e",
    borderRadius: 10,
    width: "min(560px, 95vw)",
    maxHeight: "88vh",
    overflowY: "auto",
    boxShadow: "0 0 60px rgba(0,200,100,0.14)",
  },
  popupHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "13px 18px",
    background: "#111",
    borderBottom: "1px solid #1e2e1e",
    borderRadius: "10px 10px 0 0",
  },
  popupTitle: {
    fontSize: "0.88rem",
    fontWeight: 700,
    color: "#00cc66",
    letterSpacing: 1,
    fontFamily: "'Courier New', monospace",
  },
  popupClose: {
    background: "none",
    border: "none",
    color: "#666",
    fontSize: "1rem",
    cursor: "pointer",
    padding: "3px 7px",
    borderRadius: 4,
  },
  popupBody: {
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  popupLabel: {
    fontSize: "0.78rem",
    color: "#8899ff",
    fontWeight: 700,
    margin: 0,
    fontFamily: "'Courier New', monospace",
    letterSpacing: 1,
  },
  metaTable: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    background: "#0a0a0a",
    border: "1px solid #1a2a1a",
    borderRadius: 6,
    padding: "10px 14px",
  },
  metaRow: {
    display: "flex",
    gap: 12,
    padding: "4px 0",
    borderBottom: "1px solid #111",
  },
  metaKey: {
    width: 150,
    flexShrink: 0,
    fontSize: "0.72rem",
    color: "#445544",
    fontFamily: "'Courier New', monospace",
  },
  metaVal: {
    fontSize: "0.72rem",
    fontFamily: "'Courier New', monospace",
    wordBreak: "break-all",
    color: "#ccc",
  },
  clueHighlight: {
    background: "#0a1a0a",
    border: "1px solid #1a4a1a",
    borderLeft: "4px solid #00cc66",
    borderRadius: "0 6px 6px 0",
    padding: "12px 14px",
  },
  clueHighlightTitle: {
    margin: "0 0 6px",
    fontSize: "0.72rem",
    color: "#00cc66",
    fontWeight: 700,
    letterSpacing: 1,
    fontFamily: "'Courier New', monospace",
  },
  clueHighlightText: {
    margin: 0,
    fontSize: "0.78rem",
    color: "#88ccaa",
    lineHeight: 1.65,
    fontFamily: "'Courier New', monospace",
  },
};