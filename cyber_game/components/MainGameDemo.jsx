"use client";
import { useState } from "react";
import RansomwareAttackScene from "./RansomwareAttackScene";

/**
 * HintBox — drop this anywhere in your main game layout.
 * It collects hints emitted by RansomwareAttackScene and displays them.
 */
export function HintBox({ hints }) {
  return (
    <div className="hint-box">
      <div className="hint-box-header">
        <span className="hint-icon">🕵️</span>
        <span>CLUE VAULT</span>
        <span className="hint-count">{hints.length}</span>
      </div>
      {hints.length === 0 ? (
        <p className="hint-empty">No clues collected yet. Investigate incidents to find hints.</p>
      ) : (
        <ul className="hint-list">
          {hints.map((h, i) => (
            <li key={i} className="hint-item">
              <span className="hint-num">#{i + 1}</span>
              <code className="hint-text">{h}</code>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .hint-box {
          background: #0b0b14;
          border: 1px solid #223;
          border-radius: 8px;
          padding: 14px 16px;
          font-family: 'Courier New', monospace;
          min-width: 280px;
          max-width: 440px;
          box-shadow: 0 0 20px rgba(68,136,255,0.08);
        }
        .hint-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          letter-spacing: 2px;
          color: #4488ff;
          text-transform: uppercase;
          font-weight: 700;
          padding-bottom: 10px;
          border-bottom: 1px solid #1a1a2e;
          margin-bottom: 10px;
        }
        .hint-icon { font-size: 1rem; }
        .hint-count {
          margin-left: auto;
          background: #4488ff22;
          color: #4488ff;
          border: 1px solid #4488ff44;
          border-radius: 10px;
          padding: 1px 8px;
          font-size: 0.65rem;
        }
        .hint-empty {
          color: #445;
          font-size: 0.78rem;
          margin: 0;
          line-height: 1.5;
        }
        .hint-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .hint-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #0d0d1f;
          border: 1px solid #2233aa44;
          border-radius: 5px;
          padding: 8px 10px;
        }
        .hint-num {
          color: #4488ff;
          font-size: 0.65rem;
          font-weight: 700;
          padding-top: 1px;
          flex-shrink: 0;
        }
        .hint-text {
          font-family: 'Courier New', monospace;
          font-size: 0.7rem;
          color: #aabbff;
          word-break: break-all;
          line-height: 1.55;
        }
      `}</style>
    </div>
  );
}

/**
 * MainGameDemo — demonstrates how to wire RansomwareAttackScene + HintBox
 * together in your actual game page.
 *
 * In your real game, replace the placeholder sections with your existing UI.
 */
export default function MainGameDemo() {
  const [hints, setHints] = useState([]);

  function handleHintCollected(hint) {
    setHints((prev) => (prev.includes(hint) ? prev : [...prev, hint]));
  }

  return (
    <div className="game-root">

      {/* ─── YOUR EXISTING GAME WORLD HERE ─── */}
      <div className="game-world">

        {/* Top HUD */}
        <div className="hud">
          <span className="hud-title">🌐 CYBER INVESTIGATION</span>
          <HintBox hints={hints} />
        </div>

        {/* Alert computer — this is the object player clicks */}
        <div className="room">
          <p className="room-label">OFFICE ROOM — Computer Terminal</p>
          <div className="computer-object">
            <RansomwareAttackScene onHintCollected={handleHintCollected} />
          </div>
        </div>

      </div>

      <style jsx>{`
        .game-root {
          width: 100vw;
          height: 100vh;
          background: #080810;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Courier New', monospace;
        }
        .game-world {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .hud {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 16px 24px;
          background: #0b0b14;
          border-bottom: 1px solid #1a1a2a;
          flex-shrink: 0;
          flex-wrap: wrap;
          gap: 12px;
        }
        .hud-title {
          font-size: 1rem;
          font-weight: 700;
          color: #4488ff;
          letter-spacing: 2px;
          text-transform: uppercase;
          align-self: center;
        }
        .room {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: radial-gradient(ellipse at 50% 60%, #0f1525 0%, #070710 100%);
        }
        .room-label {
          position: absolute;
          top: 16px;
          left: 20px;
          font-size: 0.7rem;
          color: #334;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0;
        }
        .computer-object {
          width: min(360px, 90vw);
          height: 220px;
          background: #0e1220;
          border: 1.5px solid #223;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 0 40px rgba(68,136,255,0.07);
        }
      `}</style>
    </div>
  );
}
