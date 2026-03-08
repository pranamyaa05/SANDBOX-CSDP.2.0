"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ── PHISHING CLUE ──────────────────────────────────────────────────────────
const PHISHING_CLUE =
  "Phishing triage complete: 3 malicious emails identified — blackmail (emotional manipulation), fake security tool (brand impersonation), vacation scam (credential harvesting link).";

// ── EMAIL DATA ──────────────────────────────────────────────────────────────
// Images use Next.js public paths — place images in /public/emails/
// Supported filenames (use any of these, just match what you have):
const IMAGES = {
  kidnap:   "/emails/kidnap.png",
  policy:   "/emails/policy.png",
  vacation: "/emails/vacation.png",
}

const ALL_EMAILS = [
  // ── LEGIT 1
  {
    id: "l1",
    from: "admin@cyberdefend.io",
    fromName: "CyberDefend Security",
    subject: "⚠ Monthly Security Awareness Reminder",
    preview: "Please review this month's security policy updates...",
    time: "08:14",
    read: false,
    avatar: "CD",
    avatarColor: "#00cc66",
    body: `Hi Team,

This is your monthly reminder to stay vigilant against social engineering and phishing attempts.

Key reminders for this month:
  • Never share your credentials over email or phone
  • Verify sender addresses before clicking any links
  • Report suspicious emails to security@cyberdefend.io
  • Enable MFA on all corporate accounts immediately

Threat landscape update: We have seen a 34% increase in spear-phishing targeting IT staff this quarter. Stay alert.

Best regards,
Admin — CyberDefend Security Team`,
    image: null,
    suspicious: false,
    indicators: [],
  },
  // ── LEGIT 2
  {
    id: "l2",
    from: "sarah.chen@horizongroup.com",
    fromName: "Sarah Chen",
    subject: "Thank you — Project Titan delivery",
    preview: "Just wanted to say a huge thank you for the incredible work...",
    time: "10:02",
    read: true,
    avatar: "SC",
    avatarColor: "#4466ff",
    body: `Hi,

Just wanted to drop a quick note to say a huge thank you for the incredible work your team delivered on Project Titan.

The client demo went brilliantly — stakeholders were genuinely impressed with the security architecture and the seamless rollout. Your team's attention to detail made all the difference.

Looking forward to continuing our partnership on the next phase.

Warm regards,
Sarah Chen
Senior Account Manager — Horizon Group`,
    image: null,
    suspicious: false,
    indicators: [],
  },
  // ── LEGIT 3
  {
    id: "l3",
    from: "noreply@confluence.atlassian.net",
    fromName: "Confluence Notifications",
    subject: "Page updated: Incident Response Runbook v3.2",
    preview: "J. Martinez updated 'Incident Response Runbook' in the...",
    time: "11:45",
    read: true,
    avatar: "CF",
    avatarColor: "#0052cc",
    body: `Confluence Notification

J. Martinez updated the page:

  📄 Incident Response Runbook v3.2
  Space: Security Operations — Internal Wiki

Changes include:
  • Section 4.1: Updated escalation contacts
  • Section 7: Added ransomware containment checklist
  • Appendix B: New forensics tool references

View the page: https://confluence.cyberdefend.io/ir-runbook

You are receiving this because you are watching this page.`,
    image: null,
    suspicious: false,
    indicators: [],
  },
  // ── PHISHING 1 — Blackmail / Kidnap
  {
    id: "p1",
    from: "anonymous_1337@proton-secure.xyz",
    fromName: "Anonymous",
    subject: "WE HAVE YOUR DAUGHTER — READ CAREFULLY",
    preview: "Do not contact police. We are watching you. Your daughter...",
    time: "06:33",
    read: false,
    avatar: "!!",
    avatarColor: "#ff2200",
    body: `We have your daughter.

Do NOT contact the police. Do NOT tell your colleagues. We are watching every move you make — including your emails, your calls, your location.

She is safe FOR NOW. That changes if you make a mistake.

What we want:
  → Transfer $50,000 in Bitcoin to wallet: 1A2b3C4d5E6f7G8h9I0j
  → Send us full admin credentials to your company network
  → Do this within 6 HOURS or we start sending pieces

Proof of life is attached below. She is scared. Do the right thing.

— They Who Watch`,
    image: IMAGES.kidnap,
    imageAlt: "Proof of life image attached",
    suspicious: true,
    indicators: [
      "Sender domain: proton-secure.xyz — NOT a real ProtonMail domain",
      "Extreme emotional manipulation & artificial urgency",
      "Requests Bitcoin payment + corporate credentials simultaneously",
      "Classic social engineering: fear + countdown pressure",
      "No verifiable proof — designed to bypass rational thinking",
    ],
  },
  // ── PHISHING 2 — Fake Security Tool
  {
    id: "p2",
    from: "offers@p0licy-security.net",
    fromName: "POLICY Security Suite",
    subject: "🛡 LIMITED OFFER: Protect Your Business — 90% OFF Today Only",
    preview: "Your network is UNPROTECTED. Install POLICY Security Suite now...",
    time: "09:17",
    read: false,
    avatar: "PS",
    avatarColor: "#22aa44",
    body: `⚠ YOUR BUSINESS IS AT RISK ⚠

Our scanners have detected CRITICAL vulnerabilities on your corporate network.

POLICY Security Suite is the #1 rated enterprise protection platform used by 50,000+ companies worldwide.

🔥 TODAY ONLY — 90% OFF Enterprise License

What you get:
  ✅ Real-time threat monitoring
  ✅ Automated incident response
  ✅ Compliance dashboard (ISO 27001, SOC2)
  ✅ 24/7 dedicated support

👉 CLICK HERE TO INSTALL NOW:
   http://p0licy-security.net/install.exe

Offer expires in 02:47:33 — don't miss out!

Best,
POLICY Security Team`,
    image: IMAGES.policy,
    imageAlt: "POLICY Security Suite logo",
    suspicious: true,
    indicators: [
      "Domain: p0licy-security.net — zero '0' instead of letter 'o' (typosquatting)",
      "Claims to have scanned your network — impossible without access",
      "Direct .exe installer link — classic malware delivery vector",
      "Fake urgency countdown timer to pressure quick action",
      "Legitimate vendors never cold-email .exe installers",
    ],
  },
  // ── PHISHING 3 — Vacation Scam
  {
    id: "p3",
    from: "deals@sunvacation-booking.info",
    fromName: "Sun Vacation Deals",
    subject: "🌴 You've been selected! Free 7-night trip — Claim before midnight",
    preview: "Congratulations! Your email was selected for an exclusive...",
    time: "13:55",
    read: false,
    avatar: "SV",
    avatarColor: "#ff9900",
    body: `🌴 CONGRATULATIONS! 🌴

Your email address has been randomly selected from 2 million entries to receive a FREE 7-night all-inclusive vacation to the Greek Islands!

Package includes:
  ✈ Return flights from your nearest airport
  🏨 5-star resort accommodation
  🍽 Full board — all meals & drinks included
  🚌 Airport transfers & guided tours

All we need is a small admin fee of $49 to confirm your booking and release your prize.

👉 CLAIM YOUR FREE TRIP NOW:
   http://sunvacation-booking.info/claim?ref=WIN2026

⏰ Offer expires TONIGHT at midnight. Only 3 spots remaining!

Sun Vacation Deals Ltd.`,
    image: IMAGES.vacation,
    imageAlt: "Vacation advertisement photo",
    suspicious: true,
    indicators: [
      "Domain: sunvacation-booking.info — .info TLD, not a known travel brand",
      "'Randomly selected from 2 million' — classic lottery/prize scam opener",
      "Requests $49 fee to claim a 'free' prize — advance-fee fraud",
      "Extreme urgency: 'tonight at midnight', '3 spots remaining'",
      "Claim link leads to credential-harvesting page",
    ],
  },
];

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── IMAGE with fallback ────────────────────────────────────────────────────
function EmailImage({ src, alt }) {
  const [status, setStatus] = useState("loading"); // loading | loaded | error

  return (
    <div style={{
      marginBottom: 20,
      border: "1px solid #ff220044",
      borderRadius: 4,
      overflow: "hidden",
      maxWidth: 420,
    }}>
      {/* Attachment bar */}
      <div style={{
        background: "#1a0800",
        padding: "5px 12px",
        fontSize: 10,
        color: "#ff8844",
        borderBottom: "1px solid #ff220033",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        📎 attachment.jpg
        {status === "loading" && (
          <span style={{ color: "#554433", marginLeft: "auto" }}>loading...</span>
        )}
        {status === "loaded" && (
          <span style={{ color: "#886644", marginLeft: "auto" }}>image loaded</span>
        )}
        {status === "error" && (
          <span style={{ color: "#ff4444", marginLeft: "auto" }}>⚠ could not load</span>
        )}
      </div>

      {/* Image */}
      {status !== "error" && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          style={{
            width: "100%",
            maxHeight: 260,
            objectFit: "cover",
            display: status === "loaded" ? "block" : "none",
            background: "#0a0a0a",
          }}
        />
      )}

      {/* Loading placeholder */}
      {status === "loading" && (
        <div style={{
          height: 120,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#332211",
          fontSize: 11,
        }}>
          ⏳ Loading image...
        </div>
      )}

      {/* Error fallback — shows descriptive placeholder */}
      {status === "error" && (
        <div style={{
          background: "#0f0500",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{ fontSize: 28 }}>🖼</div>
          <div style={{ color: "#ff6644", fontSize: 11, textAlign: "center" }}>
            {alt}
          </div>
          <div style={{
            color: "#554433", fontSize: 9,
            background: "#1a0800",
            border: "1px solid #331100",
            borderRadius: 3,
            padding: "4px 10px",
          }}>
            Image path: {src}
          </div>
          <div style={{ color: "#332211", fontSize: 9 }}>
            Place image in /public{src}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function PhishingEmailScene({ onHintCollected, onActiveChange }) {
  const [stage, setStage]               = useState("zooming");
  const [emails]                        = useState(() => shuffle(ALL_EMAILS));
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [verdicts, setVerdicts]         = useState({});
  const [hintText, setHintText]         = useState("");
  const [savedHints, setSavedHints]     = useState([]);
  const [clueUnlocked, setClueUnlocked] = useState(false);
  const [showCluePopup, setShowCluePopup] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [wrongVerdict, setWrongVerdict] = useState(false);

  const ACCENT = "#ffcc00";
  const phishingIds = ALL_EMAILS.filter(e => e.suspicious).map(e => e.id);
  const correctVerdicts = phishingIds.filter(id => verdicts[id] === "phishing");

  useEffect(() => {
    const t = setTimeout(() => setStage("active"), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (correctVerdicts.length === 3 && !clueUnlocked) {
      setClueUnlocked(true);
      onHintCollected(PHISHING_CLUE);
      setTimeout(() => setShowCluePopup(true), 400);
    }
  }, [verdicts]);

  function markVerdict(email, verdict) {
    if (verdicts[email.id]) return;
    const correct = email.suspicious ? verdict === "phishing" : verdict === "safe";
    if (!correct) {
      setWrongVerdict(true);
      setTimeout(() => setWrongVerdict(false), 1200);
      return;
    }
    setVerdicts(prev => ({ ...prev, [email.id]: verdict }));
  }

  function saveHint() {
    const trimmed = hintText.trim();
    if (!trimmed) return;
    setSavedHints(prev => [...prev, trimmed]);
    onHintCollected(`[Player Note] ${trimmed}`);
    setHintText("");
  }

  function resetScene() {
    setTimeout(() => onActiveChange(false), 300);
  }

  const content = (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#070c07",
      fontFamily: "'Courier New', monospace",
      animation: stage === "zooming" ? "sceneZoomIn 0.7s ease forwards" : "none",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes sceneZoomIn {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.75); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        @keyframes shakeRow {
          0%,100% { transform: translateX(0); }
          25%  { transform: translateX(-6px); }
          75%  { transform: translateX(6px); }
        }
        .email-row:hover { background: #111a11 !important; cursor: pointer; }
        .verdict-btn:hover { filter: brightness(1.3); transform: scale(1.02); }
        .verdict-btn { transition: filter 0.15s, transform 0.1s; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #050a05; }
        ::-webkit-scrollbar-thumb { background: #1a2a1a; border-radius: 3px; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: `1px solid ${ACCENT}44`,
        background: "#080e08",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: ACCENT, fontSize: 16, fontWeight: "bold", letterSpacing: 2 }}>
            📧 PHISHING TRIAGE
          </span>
          <span style={{
            background: `${ACCENT}22`, color: ACCENT,
            border: `1px solid ${ACCENT}55`,
            padding: "2px 10px", borderRadius: 3, fontSize: 10,
          }}>
            MAIL-SRV-01 — Corporate Inbox
          </span>
          <span style={{
            background: "#ff220018", color: "#ff5533",
            border: "1px solid #ff220044",
            padding: "2px 10px", borderRadius: 3, fontSize: 10,
          }}>
            ⚠ {3 - correctVerdicts.length} THREATS UNREVIEWED
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#00cc66", fontSize: 11 }}>
            {correctVerdicts.length} / 3 phishing caught
          </span>
          {clueUnlocked && (
            <button onClick={resetScene} style={{
              background: "#00cc6618", color: "#00cc66",
              border: "1px solid #00cc66", padding: "5px 14px",
              borderRadius: 3, cursor: "pointer", fontSize: 11,
              fontFamily: "'Courier New', monospace",
            }}>
              ↩ Back to Game
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{
          width: 190, background: "#080e08",
          borderRight: "1px solid #0f1a0f",
          flexShrink: 0, display: "flex", flexDirection: "column",
        }}>
          {/* Nav items */}
          <div style={{ padding: "12px 0" }}>
            {[
              { icon: "📥", label: "Inbox", count: emails.filter(e => !e.read).length, active: true },
              { icon: "⭐", label: "Starred", count: 0, active: false },
              { icon: "📤", label: "Sent",    count: 0, active: false },
              { icon: "🗑", label: "Trash",   count: 0, active: false },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 14px",
                background: item.active ? `${ACCENT}18` : "transparent",
                borderLeft: item.active ? `3px solid ${ACCENT}` : "3px solid transparent",
                color: item.active ? ACCENT : "#334433",
                fontSize: 12,
              }}>
                <span>{item.icon} {item.label}</span>
                {item.count > 0 && (
                  <span style={{
                    background: ACCENT, color: "#000",
                    borderRadius: 10, padding: "1px 6px",
                    fontSize: 9, fontWeight: "bold",
                  }}>{item.count}</span>
                )}
              </div>
            ))}
          </div>

          {/* ── HINT NOTEPAD ── */}
          <div style={{
            margin: "8px 10px",
            border: `1px solid ${ACCENT}33`,
            borderRadius: 4,
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{
              background: `${ACCENT}18`, color: ACCENT,
              padding: "6px 10px", fontSize: 10, letterSpacing: 1,
              borderBottom: `1px solid ${ACCENT}22`,
            }}>
              💡 HINT NOTEPAD
            </div>
            <div style={{ padding: 8, flex: 1, display: "flex", flexDirection: "column" }}>
              <textarea
                value={hintText}
                onChange={e => setHintText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) saveHint(); }}
                placeholder={"Type your findings...\n\nCtrl+Enter to save"}
                style={{
                  flex: 1, minHeight: 80,
                  background: "#0a140a", color: "#bbddbb",
                  border: "1px solid #1a3a1a", borderRadius: 3,
                  padding: 6, fontSize: 10, resize: "none",
                  fontFamily: "'Courier New', monospace",
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
              <button
                onClick={saveHint}
                style={{
                  width: "100%", marginTop: 5,
                  background: `${ACCENT}18`, color: ACCENT,
                  border: `1px solid ${ACCENT}44`,
                  padding: "5px 0", borderRadius: 3,
                  cursor: "pointer", fontSize: 10,
                  fontFamily: "'Courier New', monospace",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = ACCENT + "33"}
                onMouseLeave={e => e.currentTarget.style.background = ACCENT + "18"}
              >
                💾 Save Hint
              </button>

              {/* Saved hints list */}
              {savedHints.length > 0 && (
                <div style={{ marginTop: 8, overflowY: "auto" }}>
                  {savedHints.map((h, i) => (
                    <div key={i} style={{
                      background: "#0a180a", border: "1px solid #1a3a1a",
                      borderRadius: 3, padding: "4px 6px", marginBottom: 4,
                      color: "#77aa77", fontSize: 9, lineHeight: 1.4,
                    }}>
                      ✓ {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── EMAIL LIST ── */}
        <div style={{
          width: selectedEmail ? 260 : "100%",
          borderRight: selectedEmail ? "1px solid #0f1a0f" : "none",
          overflowY: "auto",
          flexShrink: 0,
          transition: "width 0.25s ease",
        }}>
          <div style={{
            padding: "8px 14px",
            borderBottom: "1px solid #0f1a0f",
            background: "#090f09",
            display: "flex", justifyContent: "space-between",
          }}>
            <span style={{ color: "#446644", fontSize: 10 }}>
              Inbox — {emails.length} messages
            </span>
            <span style={{ color: "#223322", fontSize: 10 }}>Latest first</span>
          </div>

          {emails.map((email, idx) => {
            const verdict    = verdicts[email.id];
            const isSelected = selectedEmail?.id === email.id;
            return (
              <div
                key={email.id}
                className="email-row"
                onClick={() => { setSelectedEmail(email); setShowIndicators(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px",
                  borderBottom: "1px solid #0a140a",
                  background: isSelected ? "#0f1f0f" : "transparent",
                  borderLeft: isSelected ? `3px solid ${ACCENT}` : "3px solid transparent",
                  animation: `fadeInUp 0.3s ease ${idx * 0.04}s both`,
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: `${email.avatarColor}22`,
                  border: `2px solid ${email.avatarColor}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: email.avatarColor, fontSize: 10, fontWeight: "bold",
                  flexShrink: 0,
                }}>
                  {email.avatar}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{
                      color: email.read ? "#446644" : "#aaccaa",
                      fontSize: 11, fontWeight: email.read ? "normal" : "bold",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      maxWidth: 120,
                    }}>
                      {email.fromName}
                    </span>
                    <span style={{ color: "#223322", fontSize: 9, flexShrink: 0 }}>
                      {email.time}
                    </span>
                  </div>
                  <div style={{
                    color: email.read ? "#334433" : "#778877",
                    fontSize: 10,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    marginTop: 2,
                  }}>
                    {email.subject}
                  </div>
                </div>

                {/* Status dot / verdict badge */}
                {verdict ? (
                  <div style={{
                    flexShrink: 0,
                    background: verdict === "phishing" ? "#ff220018" : "#00cc6618",
                    color:      verdict === "phishing" ? "#ff5533"   : "#00cc66",
                    border:     `1px solid ${verdict === "phishing" ? "#ff220044" : "#00cc6644"}`,
                    borderRadius: 3, padding: "2px 5px", fontSize: 8,
                  }}>
                    {verdict === "phishing" ? "⚠ PHISH" : "✓ SAFE"}
                  </div>
                ) : !email.read ? (
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: ACCENT, flexShrink: 0,
                  }} />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* ── EMAIL DETAIL PANE ── */}
        {selectedEmail ? (
          <div style={{
            flex: 1, overflowY: "auto",
            animation: "slideInRight 0.25s ease",
          }}>
            {/* Email header */}
            <div style={{
              padding: "18px 24px 14px",
              borderBottom: "1px solid #0f1a0f",
              background: "#090f09",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h2 style={{
                  color: selectedEmail.suspicious ? "#ff8844" : "#aaccaa",
                  fontSize: 15, margin: 0, lineHeight: 1.4, flex: 1,
                }}>
                  {selectedEmail.subject}
                </h2>
                <button
                  onClick={() => setSelectedEmail(null)}
                  style={{
                    background: "none", border: "none",
                    color: "#334433", fontSize: 16,
                    cursor: "pointer", padding: "0 0 0 12px",
                  }}
                >✕</button>
              </div>

              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: `${selectedEmail.avatarColor}22`,
                  border: `2px solid ${selectedEmail.avatarColor}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: selectedEmail.avatarColor, fontSize: 12, fontWeight: "bold",
                }}>
                  {selectedEmail.avatar}
                </div>
                <div>
                  <div style={{ color: "#99bb99", fontSize: 12, fontWeight: "bold" }}>
                    {selectedEmail.fromName}
                  </div>
                  <div style={{ color: "#334433", fontSize: 10, marginTop: 2 }}>
                    &lt;{selectedEmail.from}&gt;
                  </div>
                  <div style={{ color: "#223322", fontSize: 9, marginTop: 1 }}>
                    To: security-analyst@cyberdefend.io
                  </div>
                </div>
              </div>
            </div>

            {/* Email body */}
            <div style={{ padding: "18px 24px 40px" }}>

              {/* ── ATTACHED IMAGE — always rendered when present ── */}
              {selectedEmail.image && (
                <EmailImage
                  src={selectedEmail.image}
                  alt={selectedEmail.imageAlt}
                />
              )}

              {/* Body text */}
              <pre style={{
                color: "#99bb99", fontSize: 12, lineHeight: 1.8,
                whiteSpace: "pre-wrap", fontFamily: "'Courier New', monospace",
                margin: 0,
              }}>
                {selectedEmail.body}
              </pre>

              {/* Threat indicators — revealed after correct flag */}
              {selectedEmail.suspicious && verdicts[selectedEmail.id] === "phishing" && (
                <div style={{
                  marginTop: 22, border: "1px solid #ff220033",
                  borderRadius: 4, overflow: "hidden",
                  animation: "fadeInUp 0.4s ease",
                }}>
                  <div
                    onClick={() => setShowIndicators(p => !p)}
                    style={{
                      background: "#1a0400", padding: "8px 14px",
                      color: "#ff7755", fontSize: 11, cursor: "pointer",
                      display: "flex", justifyContent: "space-between",
                    }}
                  >
                    <span>🔍 Threat Indicators ({selectedEmail.indicators.length} found)</span>
                    <span>{showIndicators ? "▲" : "▼"}</span>
                  </div>
                  {showIndicators && (
                    <div style={{ background: "#0f0300", padding: "10px 14px" }}>
                      {selectedEmail.indicators.map((ind, i) => (
                        <div key={i} style={{
                          color: "#ff8866", fontSize: 11,
                          marginBottom: 7, display: "flex", gap: 8,
                        }}>
                          <span style={{ color: "#ff3300", flexShrink: 0 }}>⚠</span>
                          {ind}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Verdict buttons */}
              {!verdicts[selectedEmail.id] && (
                <div style={{
                  marginTop: 22, display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 0", borderTop: "1px solid #0f1a0f",
                  flexWrap: "wrap",
                }}>
                  <span style={{ color: "#334433", fontSize: 11 }}>Mark this email as:</span>
                  <button
                    className="verdict-btn"
                    onClick={() => markVerdict(selectedEmail, "safe")}
                    style={{
                      background: "#00cc6618", color: "#00cc66",
                      border: "1px solid #00cc6655",
                      padding: "8px 18px", borderRadius: 3,
                      cursor: "pointer", fontSize: 11,
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    ✓ Legitimate
                  </button>
                  <button
                    className="verdict-btn"
                    onClick={() => markVerdict(selectedEmail, "phishing")}
                    style={{
                      background: "#ff220018", color: "#ff6644",
                      border: "1px solid #ff220055",
                      padding: "8px 18px", borderRadius: 3,
                      cursor: "pointer", fontSize: 11,
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    ⚠ Flag as Phishing
                  </button>
                </div>
              )}

              {/* Post-verdict message */}
              {verdicts[selectedEmail.id] && (
                <div style={{
                  marginTop: 18, padding: "10px 14px",
                  background: verdicts[selectedEmail.id] === "phishing" ? "#140300" : "#001408",
                  border: `1px solid ${verdicts[selectedEmail.id] === "phishing" ? "#ff220055" : "#00cc6655"}`,
                  borderRadius: 4,
                  color: verdicts[selectedEmail.id] === "phishing" ? "#ff6644" : "#00cc66",
                  fontSize: 11, animation: "fadeInUp 0.3s ease",
                }}>
                  {verdicts[selectedEmail.id] === "phishing"
                    ? "⚠ Flagged as phishing — email quarantined. Expand threat indicators above ▲"
                    : "✓ Marked as legitimate — no further action required."}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* No email selected */
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            color: "#112211",
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📧</div>
            <div style={{ fontSize: 13 }}>Select an email to read</div>
            <div style={{ fontSize: 11, marginTop: 6, color: "#0d1a0d" }}>
              Flag all 3 phishing emails to unlock the investigation clue
            </div>
          </div>
        )}
      </div>

      {/* ── WRONG VERDICT FLASH ── */}
      {wrongVerdict && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#140000", border: "2px solid #ff2200",
          color: "#ff5533", padding: "14px 28px", borderRadius: 4,
          fontSize: 13, zIndex: 99999, textAlign: "center",
          animation: "popIn 0.2s ease",
          fontFamily: "'Courier New', monospace",
        }}>
          ✗ Incorrect — re-examine this email carefully
        </div>
      )}

      {/* ── CLUE UNLOCKED POPUP ── */}
      {showCluePopup && createPortal(
        <div style={{
          position: "fixed", inset: 0, zIndex: 999999,
          background: "#000000aa",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#080e08", border: `2px solid ${ACCENT}`,
            borderRadius: 6, padding: "28px 36px", maxWidth: 460,
            textAlign: "center",
            boxShadow: `0 0 40px ${ACCENT}44`,
            animation: "popIn 0.4s ease",
            fontFamily: "'Courier New', monospace",
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎯</div>
            <div style={{ color: ACCENT, fontSize: 15, fontWeight: "bold", marginBottom: 8 }}>
              PHISHING TRIAGE COMPLETE
            </div>
            <div style={{ color: "#88aa88", fontSize: 11, marginBottom: 18, lineHeight: 1.6 }}>
              All 3 phishing emails identified and quarantined.
            </div>
            <div style={{
              background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`,
              borderRadius: 4, padding: "10px 14px", marginBottom: 18,
              color: ACCENT, fontSize: 10, lineHeight: 1.7, textAlign: "left",
            }}>
              🔍 {PHISHING_CLUE}
            </div>
            <button
              onClick={() => { setShowCluePopup(false); resetScene(); }}
              style={{
                background: "#00cc6618", color: "#00cc66",
                border: "1px solid #00cc66",
                padding: "10px 26px", borderRadius: 3,
                cursor: "pointer", fontSize: 12,
                fontFamily: "'Courier New', monospace",
              }}
            >
              ↩ Back to Game
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );

  return createPortal(content, document.body);
}