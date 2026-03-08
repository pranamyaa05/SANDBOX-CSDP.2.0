"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // No navbar on the login/root page
  if (pathname === "/") return null;

  return <Navbar pathname={pathname} />;
}

function Navbar({ pathname }: { pathname: string }) {
  const [time, setTime] = useState("");
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const run = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 280);
      setTimeout(run, 4000 + Math.random() * 5000);
    };
    const h = setTimeout(run, 3000);
    return () => clearTimeout(h);
  }, []);

  // Only show Learn and Game — no Points, no Start Game
  const NAV_LINKS = [
    { href: "/learn", label: "LEARN" },
    { href: "/game",  label: "GAME"  },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');
        @keyframes nav-scan   { from{left:-60%} to{left:120%} }
        @keyframes nav-blink  { 0%,100%{opacity:1} 50%{opacity:.1} }
        @keyframes nav-glitch {
          0%,100%{color:#00ff88;transform:none}
          20%{color:#ff3355;transform:translateX(-3px)}
          40%{color:#00d4ff;transform:translateX(3px)}
          60%{color:#00ff88;transform:none}
        }
        .nav-link {
          font-family:'Share Tech Mono',monospace; font-size:.68rem; letter-spacing:.18em;
          color:rgba(0,255,136,.4); text-decoration:none;
          padding:.3rem .8rem; border:1px solid transparent; border-radius:2px;
          transition:all .2s; position:relative;
        }
        .nav-link:hover { color:#00ff88; border-color:rgba(0,255,136,.25); background:rgba(0,255,136,.04); box-shadow:0 0 12px rgba(0,255,136,.1); }
        .nav-link.active { color:#00ff88; border-color:rgba(0,255,136,.35); background:rgba(0,255,136,.06); }
        .nav-link.active::after { content:''; position:absolute; bottom:-1px; left:15%; right:15%; height:1px; background:#00ff88; box-shadow:0 0 6px #00ff88; }
      `}</style>

      <nav style={{
        position:"sticky", top:0, zIndex:50000,
        background:"rgba(2,10,2,.93)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(0,255,136,.1)",
        boxShadow:"0 2px 24px rgba(0,0,0,.5)",
        overflow:"hidden",
      }}>
        {/* Scan sweep */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:"100%",pointerEvents:"none",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,width:"35%",height:"100%",
            background:"linear-gradient(90deg,transparent,rgba(0,255,136,.04),transparent)",
            animation:"nav-scan 4s linear infinite"}} />
        </div>

        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:".5rem 1.5rem",position:"relative",zIndex:1}}>

          {/* Brand */}
          <Link href="/game" style={{textDecoration:"none"}}>
            <div style={{
              fontFamily:"'Orbitron',monospace", fontWeight:900,
              fontSize:"clamp(.75rem,2vw,.95rem)", letterSpacing:".2em",
              color:"#00ff88", textShadow:"0 0 20px rgba(0,255,136,.5)",
              animation: glitch ? "nav-glitch .28s ease" : "none",
              display:"flex", alignItems:"center", gap:7,
            }}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#00ff88",
                display:"inline-block",animation:"nav-blink .9s infinite",
                boxShadow:"0 0 8px #00ff88"}} />
              CYBER DEFENDER
            </div>
          </Link>

          {/* Nav links */}
          <div style={{display:"flex",alignItems:"center",gap:".4rem"}}>
            {NAV_LINKS.map(({href, label}) => (
              <Link key={href} href={href} className={`nav-link${isActive(href) ? " active" : ""}`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Live clock */}
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:".56rem",
            color:"rgba(0,255,136,.3)",letterSpacing:".12em",
            display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#00ff88",
              display:"inline-block",animation:"nav-blink 1.2s infinite"}} />
            {time}
          </div>
        </div>
      </nav>
    </>
  );
}