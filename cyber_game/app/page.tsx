"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const CHARS = "01アイウエオカキクケコタチツテトサシスセソ";
    let W: number, H: number, cols: number, drops: number[];
    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      cols = Math.floor(W / 18);
      drops = Array(cols).fill(1);
    }
    function draw() {
      ctx.fillStyle = "rgba(2,12,2,.06)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#00ff88";
      ctx.font = "14px monospace";
      for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.globalAlpha = Math.random() * 0.7 + 0.15;
        ctx.fillText(ch, i * 18, drops[i] * 18);
        if (drops[i] * 18 > H && Math.random() > 0.97) drops[i] = 0;
        drops[i]++;
      }
      ctx.globalAlpha = 1;
    }
    resize();
    window.addEventListener("resize", resize);
    const id = setInterval(draw, 55);
    return () => { clearInterval(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.13, pointerEvents: "none" }} />;
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [agentId, setAgentId] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("Blue Team Analyst");
  const [clearance, setClearance] = useState("LEVEL 4 — SECRET");
  const [gender, setGender] = useState("M");
  const [error, setError] = useState("");
  const [glitch, setGlitch] = useState(false);
  const [loading, setLoading] = useState(false);

  function doLogin() {
    if (!name.trim()) { setError("⚠ ANALYST NAME REQUIRED"); return; }
    if (!agentId.trim()) { setError("⚠ ID NUMBER REQUIRED"); return; }
    const y = parseInt(year);
    if (!y || y < 1970 || y > 2005) { setError("⚠ BIRTH YEAR MUST BE 1970–2005"); return; }
    setError("");
    sessionStorage.setItem("soc_player", JSON.stringify({ name: name.trim(), id: agentId.trim(), year: y, role, clearance, gender }));
    localStorage.setItem("username", name.trim());
    setGlitch(true);
    setLoading(true);
    setTimeout(() => { setGlitch(false); router.push("/briefing"); }, 500);
  }

  function onKey(e: React.KeyboardEvent) { if (e.key === "Enter") doLogin(); }

  const preview = name.trim() ? `> ${name.trim()}${agentId.trim() ? " · " + agentId.trim() : ""}_` : "";

  const LBL = (label: string) => (
    <div style={{ fontSize: ".64rem", letterSpacing: ".18em", color: "rgba(0,255,136,.55)", marginBottom: ".35rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
      <span style={{ color: "#00ff88" }}>&gt;</span> {label}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { min-height:100vh; background:#020c02; overflow-x:hidden; }
        .lr::before { content:''; position:fixed; inset:0; z-index:1; pointer-events:none; background: linear-gradient(rgba(0,255,136,.028) 1px,transparent 1px), linear-gradient(90deg,rgba(0,255,136,.028) 1px,transparent 1px); background-size:50px 50px; }
        .lr::after { content:''; position:fixed; left:0; right:0; height:120px; z-index:2; pointer-events:none; background:linear-gradient(180deg,transparent,rgba(0,255,136,.04),transparent); animation:scanline 8s linear infinite; }
        @keyframes scanline { from{top:-120px} to{top:100vh} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.1} }
        @keyframes cardIn { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes tscan { from{top:-2px} to{top:100%} }
        @keyframes glitch-a { 0%,88%,100%{transform:none;opacity:0} 89%{transform:translateX(-4px);opacity:.7} 91%{transform:translateX(4px);opacity:.7} 93%{transform:none;opacity:0} }
        @keyframes glitch-b { 0%,88%,100%{transform:none;opacity:0} 89%{transform:translateX(4px);opacity:.7} 91%{transform:translateX(-4px);opacity:.7} 93%{transform:none;opacity:0} }
        @keyframes flashIn { 0%{opacity:1}20%{opacity:0}40%{opacity:1}60%{opacity:0}100%{opacity:1} }
        .flash { animation: flashIn .4s ease; }
        .ci { width:100%; background:rgba(0,0,0,.55); border:1px solid rgba(0,255,136,.18); border-bottom:2px solid rgba(0,255,136,.38); color:#00ff88; font-family:'Share Tech Mono',monospace; font-size:1rem; padding:.65rem .85rem; outline:none; transition:border-color .2s,box-shadow .2s; caret-color:#00ff88; letter-spacing:.04em; margin-bottom:.75rem; }
        .ci:focus { border-color:rgba(0,255,136,.5); border-bottom-color:#00ff88; box-shadow:0 4px 16px rgba(0,255,136,.08); }
        .ci::placeholder { color:rgba(0,255,136,.18); }
        .cs { width:100%; background:rgba(0,0,0,.55); border:1px solid rgba(0,255,136,.18); border-bottom:2px solid rgba(0,255,136,.38); color:#00ff88; font-family:'Share Tech Mono',monospace; font-size:.95rem; padding:.65rem .85rem; outline:none; cursor:pointer; transition:border-color .2s; appearance:none; margin-bottom:.75rem; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2300ff88' opacity='.4'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:calc(100% - .8rem) center; background-color:rgba(0,0,0,.55); background-size:10px 6px; }
        .cs:focus { border-color:rgba(0,255,136,.5); border-bottom-color:#00ff88; }
        .cs option { background:#020c02; color:#00ff88; }
        .sbtn { width:100%; font-family:'Orbitron',monospace; font-size:.74rem; font-weight:700; letter-spacing:.18em; padding:.92rem; background:linear-gradient(90deg,#00cc6a,#00ff88); color:#000; border:none; cursor:pointer; clip-path:polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%); transition:all .25s; margin-top:.4rem; }
        .sbtn:hover { background:linear-gradient(90deg,#00ff88,#33ffaa); box-shadow:0 0 30px rgba(0,255,136,.4); transform:translateY(-1px); }
        .sbtn:active { transform:translateY(0); }
        .sbtn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .lbtn { width:100%; font-family:'Share Tech Mono',monospace; font-size:.68rem; letter-spacing:.15em; padding:.75rem; background:transparent; color:rgba(0,255,136,.55); border:1px solid rgba(0,255,136,.22); cursor:pointer; transition:all .25s; margin-top:.55rem; display:flex; align-items:center; justify-content:center; gap:.6rem; text-decoration:none; }
        .lbtn:hover { background:rgba(0,255,136,.05); border-color:rgba(0,255,136,.45); color:#00ff88; box-shadow:0 0 16px rgba(0,255,136,.1); }
        .or-line { display:flex; align-items:center; gap:.75rem; margin:.7rem 0 0; font-family:'Share Tech Mono',monospace; font-size:.52rem; color:rgba(0,255,136,.2); letter-spacing:.15em; }
        .or-line::before,.or-line::after { content:''; flex:1; height:1px; background:rgba(0,255,136,.1); }
      `}</style>

      <MatrixRain />
      <div style={{ position:"fixed", inset:0, zIndex:3, pointerEvents:"none", background:"rgba(0,255,136,.28)", opacity: glitch ? 0.3 : 0, transition:"opacity .1s" }} />

      <div className="lr" style={{ position:"relative", zIndex:10, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"1.2rem 1rem 2rem", gap:"1rem", fontFamily:"'Share Tech Mono',monospace", color:"#00ff88" }}>

        {/* Title */}
        <div style={{ position:"relative", textAlign:"center", border:"1px solid rgba(0,255,136,.22)", background:"rgba(2,14,2,.92)", backdropFilter:"blur(8px)", padding:".9rem 2.4rem", boxShadow:"0 0 40px rgba(0,255,136,.08)" }}>
          <span style={{position:"absolute",top:-1,left:-1,width:14,height:14,borderTop:"2px solid #00ff88",borderLeft:"2px solid #00ff88"}} />
          <span style={{position:"absolute",bottom:-1,right:-1,width:14,height:14,borderBottom:"2px solid #00ff88",borderRight:"2px solid #00ff88"}} />
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".55rem",fontSize:".55rem",letterSpacing:".22em",color:"rgba(0,255,136,.55)",marginBottom:".5rem"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#00ff88",display:"inline-block",animation:"blink .8s infinite"}} />
            SYSTEM ACCESS REQUIRED
            <span style={{width:6,height:6,borderRadius:"50%",background:"#00ff88",display:"inline-block",animation:"blink .8s infinite"}} />
          </div>
          <div style={{position:"relative",display:"inline-block",marginBottom:".35rem"}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:"clamp(1.3rem,4vw,2.2rem)",letterSpacing:".25em",color:"#00ff88",textShadow:"0 0 30px rgba(0,255,136,.6)"}}>CYBER DEFENDER</div>
            <div style={{position:"absolute",top:0,left:0,right:0,fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:"clamp(1.3rem,4vw,2.2rem)",letterSpacing:".25em",color:"#ff3355",clipPath:"polygon(0 20%,100% 20%,100% 40%,0 40%)",animation:"glitch-a 4s infinite",opacity:.7,pointerEvents:"none"}}>CYBER DEFENDER</div>
            <div style={{position:"absolute",top:0,left:0,right:0,fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:"clamp(1.3rem,4vw,2.2rem)",letterSpacing:".25em",color:"#00d4ff",clipPath:"polygon(0 60%,100% 60%,100% 80%,0 80%)",animation:"glitch-b 4s infinite .15s",opacity:.7,pointerEvents:"none"}}>CYBER DEFENDER</div>
          </div>
          <div style={{fontSize:".6rem",color:"rgba(0,255,136,.45)",letterSpacing:".15em",display:"flex",alignItems:"center",justifyContent:"center",gap:".6rem"}}>
            <span style={{color:"rgba(0,255,136,.25)"}}>&lt;</span> OPERATION BLACKOUT — SECURITY CLEARANCE REQUIRED <span style={{color:"rgba(0,255,136,.25)"}}>/&gt;</span>
          </div>
        </div>

        {/* Terminal card */}
        <div className={glitch ? "flash" : ""} style={{ width:"min(520px,96vw)", position:"relative", background:"rgba(2,14,2,.94)", backdropFilter:"blur(10px)", border:"1px solid rgba(0,255,136,.25)", boxShadow:"0 0 40px rgba(0,255,136,.07),0 20px 60px rgba(0,0,0,.6)", animation:"cardIn .55s cubic-bezier(.16,1,.3,1)" }}>
          <span style={{position:"absolute",top:-1,left:-1,width:14,height:14,borderTop:"2px solid #00ff88",borderLeft:"2px solid #00ff88",zIndex:2}} />
          <span style={{position:"absolute",bottom:-1,right:-1,width:14,height:14,borderBottom:"2px solid #00ff88",borderRight:"2px solid #00ff88",zIndex:2}} />
          <div style={{position:"absolute",left:0,right:0,height:2,pointerEvents:"none",zIndex:2,background:"linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)",animation:"tscan 3s linear infinite"}} />

          {/* Titlebar */}
          <div style={{display:"flex",alignItems:"center",gap:".55rem",padding:".5rem .85rem",borderBottom:"1px solid rgba(0,255,136,.12)",background:"rgba(0,255,136,.03)"}}>
            <div style={{display:"flex",gap:".4rem"}}>
              {["rgba(255,80,80,.5)","rgba(255,200,80,.5)","rgba(0,255,136,.5)"].map((c,i)=>(
                <div key={i} style={{width:13,height:13,borderRadius:"50%",background:c}} />
              ))}
            </div>
            <div style={{flex:1,textAlign:"center",fontSize:".72rem",color:"rgba(0,255,136,.35)",letterSpacing:".12em"}}>agent_login.sh</div>
            <div style={{fontSize:".6rem",color:"#00ff88",letterSpacing:".1em",display:"flex",alignItems:"center",gap:".3rem"}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"#00ff88",display:"inline-block",animation:"blink .8s infinite"}} /> LIVE
            </div>
          </div>

          {/* Form */}
          <div style={{padding:"1.2rem 1.8rem 1.5rem"}}>
            <div style={{fontSize:".68rem",color:"rgba(0,255,136,.4)",letterSpacing:".12em",marginBottom:"1rem",lineHeight:1.8}}>
              <span style={{color:"rgba(0,255,136,.8)"}}>$ INITIALIZING SECURE TERMINAL...</span><br/>
              <span style={{color:"rgba(0,255,136,.25)"}}>// Connection encrypted · Salt: 0x3FA2 · TLS 1.3</span><br/>
              <span style={{color:"rgba(0,255,136,.8)"}}>$ ENTER ANALYST CREDENTIALS TO PROCEED</span>
            </div>

            {LBL("ANALYST NAME")}
            <input className="ci" placeholder="your_full_name" maxLength={32} value={name} onChange={e=>setName(e.target.value)} onKeyDown={onKey} />
            <div style={{fontSize:".65rem",marginTop:"-.5rem",marginBottom:".6rem",letterSpacing:".06em",minHeight:".8rem",transition:"color .2s",color:preview?"rgba(0,255,136,.6)":"rgba(0,255,136,.3)"}}>{preview}</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".7rem"}}>
              <div>{LBL("ID NUMBER")}<input className="ci" placeholder="BT-XXXX" maxLength={10} value={agentId} onChange={e=>setAgentId(e.target.value)} onKeyDown={onKey} /></div>
              <div>{LBL("BIRTH YEAR")}<input className="ci" placeholder="e.g. 1998" type="number" min={1970} max={2005} value={year} onChange={e=>setYear(e.target.value)} onKeyDown={onKey} /></div>
            </div>

            {LBL("OPERATIONAL ROLE")}
            <select className="cs" value={role} onChange={e=>setRole(e.target.value)}>
              <option>Blue Team Analyst</option><option>SOC Engineer</option><option>Threat Hunter</option><option>Incident Responder</option>
            </select>

            {LBL("CLEARANCE LEVEL")}
            <select className="cs" value={clearance} onChange={e=>setClearance(e.target.value)}>
              <option>LEVEL 2 — RESTRICTED</option><option>LEVEL 3 — CONFIDENTIAL</option><option>LEVEL 4 — SECRET</option><option>LEVEL 5 — TOP SECRET</option>
            </select>

            {LBL("AVATAR PROFILE")}
            <select className="cs" value={gender} onChange={e=>setGender(e.target.value)}>
              <option value="M">Male</option><option value="F">Female</option>
            </select>

            <button className="sbtn" onClick={doLogin} disabled={loading}>
              {loading ? "AUTHENTICATING..." : "▶ INITIALIZE PROTOCOL — ENTER CONTROL ROOM"}
            </button>

            <div style={{fontSize:".6rem",color:"#ff3355",textAlign:"center",minHeight:"1rem",marginTop:".35rem",letterSpacing:".08em"}}>{error}</div>

            <div className="or-line">OR STUDY FIRST</div>

            <Link href="/learn" className="lbtn">
              📚 ENTER LEARNING MODULE — NO LOGIN REQUIRED
            </Link>
          </div>

          <div style={{padding:".65rem 1rem",borderTop:"1px solid rgba(0,255,136,.08)",display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",fontSize:".6rem",color:"rgba(0,255,136,.25)",letterSpacing:".12em"}}>
            {["SECURE CONNECTION ESTABLISHED","ENCRYPTED","v1.0.0"].map((t,i)=>(
              <span key={i} style={{display:"flex",alignItems:"center",gap:".5rem"}}>
                {i>0&&<span style={{width:5,height:5,borderRadius:"50%",background:"rgba(0,255,136,.4)",display:"inline-block"}}/>}{t}
              </span>
            ))}
          </div>
        </div>

        <div style={{display:"flex",gap:"1.2rem",fontSize:".52rem",color:"rgba(0,255,136,.2)",letterSpacing:".15em",flexWrap:"wrap",justifyContent:"center"}}>
          {["v1.0.0","CLASSIFIED","ENCRYPTED","BLUE TEAM ACCESS ONLY"].map((t,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
              {i>0&&<span style={{color:"rgba(0,255,136,.1)"}}>|</span>}{t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}