"use client";

import { useEffect, useRef, useState } from "react";

export default function DarkPage() {
  const curRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number | string>("---");
  const [visits, setVisits] = useState(2847);
  const [isMobile, setIsMobile] = useState(false);

  // Cursor tracking
  useEffect(() => {
    const mobile = window.matchMedia("(hover: none)").matches;
    setIsMobile(mobile);
    if (mobile) return;

    const move = (e: MouseEvent) => {
      if (curRef.current) {
        curRef.current.style.left = e.clientX - 4 + "px";
        curRef.current.style.top = e.clientY - 7 + "px";
      }
    };
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, []);

  // Player count tick-up
  useEffect(() => {
    const target = 280 + Math.floor(Math.random() * 100);
    let n = 0;
    const t = setInterval(() => {
      n += Math.ceil((target - n) / 8);
      setCount(n);
      if (n >= target) {
        setCount(target);
        clearInterval(t);
      }
    }, 60);
    return () => clearInterval(t);
  }, []);

  // Visit counter slow tick
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.65) setVisits((v) => v + 1);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=UnifrakturMaguntia&family=VT323&display=swap');

        :root {
          --red:   #cc0000;
          --dred:  #880000;
          --black: #080808;
          --bone:  #c8c0b0;
          --dim:   #666050;
        }

        .dark-page {
          background: var(--black);
          color: var(--bone);
          font-family: 'Share Tech Mono', monospace;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          cursor: none;
          position: relative;
        }

        /* scanlines */
        .dark-page::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9000;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px, transparent 2px,
            rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px
          );
        }

        @keyframes dp-flicker {
          0%,100% { opacity:1 }
          93%     { opacity:.88 }
          96%     { opacity:.94 }
        }
        .dark-page { animation: dp-flicker 9s infinite; }

        /* cursor */
        .dp-cur {
          position: fixed;
          width: 8px; height: 14px;
          background: var(--red);
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          animation: dp-blink 1s step-end infinite;
        }
        @keyframes dp-blink { 50%{ opacity:0 } }

        /* noise */
        .dp-noise {
          position: fixed; inset:0;
          pointer-events:none; z-index:8999; opacity:.022;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 120px;
        }

        /* layout */
        .dp-wrap {
          flex: 1;
          max-width: 780px;
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .dp-header {
          padding: 16px 0;
          border-bottom: 1px solid var(--dred);
          display: flex;
          justify-content: space-between;
          align-items: center;
          opacity: 0;
          animation: dp-show .1s steps(1) .2s forwards;
        }
        .dp-site-id {
          font-size: clamp(.62rem, 2vw, .75rem);
          color: var(--dim);
          letter-spacing: .1em;
        }
        .dp-site-id b { color: var(--red); }
        .dp-build {
          font-size: .6rem;
          color: #2a2a2a;
          letter-spacing: .1em;
        }

        /* MAIN */
        .dp-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 0 40px;
          gap: 28px;
        }

        /* ascii box */
        .dp-ascii {
          font-size: clamp(.48rem, 1.5vw, .6rem);
          line-height: 1.15;
          color: var(--dred);
          white-space: pre;
          user-select: none;
          opacity: 0;
          animation: dp-show .1s steps(1) .4s forwards;
        }

        /* title */
        .dp-title {
          font-family: 'UnifrakturMaguntia', cursive;
          font-size: clamp(3.8rem, 16vw, 8rem);
          color: var(--bone);
          line-height: .85;
          text-shadow: 2px 2px 0 var(--dred);
          position: relative;
          display: inline-block;
          opacity: 0;
          animation: dp-show .1s steps(1) .5s forwards, dp-glitch 7s 2s infinite;
        }
        .dp-title::after {
          content: 'DARK';
          position: absolute;
          bottom: -.12em; right: -.04em;
          font-family: 'VT323', monospace;
          font-size: .27em;
          color: var(--red);
          letter-spacing: .4em;
          text-shadow: none;
        }

        @keyframes dp-glitch {
          0%,89%,100% { clip-path:none; transform:none }
          90% { clip-path:polygon(0 15%,100% 15%,100% 35%,0 35%); transform:translate(-3px,0) }
          91% { clip-path:polygon(0 55%,100% 55%,100% 75%,0 75%); transform:translate(3px,0) }
          92% { clip-path:none; transform:none }
        }

        /* tagline */
        .dp-tagline {
          font-size: clamp(.72rem, 2.2vw, .82rem);
          color: var(--dim);
          line-height: 1.7;
          max-width: 480px;
          opacity: 0;
          overflow: hidden;
          white-space: nowrap;
          border-right: 1px solid var(--red);
          animation: dp-typeIn 1.1s steps(72) 1s forwards;
        }

        /* status */
        .dp-status {
          font-size: clamp(.58rem, 1.8vw, .65rem);
          color: #333;
          letter-spacing: .08em;
          opacity: 0;
          animation: dp-show .1s steps(1) 2.3s forwards;
        }
        .dp-status span { color: var(--red); }

        /* CTA */
        .dp-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          opacity: 0;
          animation: dp-show .1s steps(1) 2.5s forwards;
        }
        .dp-btn {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(.68rem, 2vw, .75rem);
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: 12px 28px;
          border: 1px solid;
          cursor: none;
          text-decoration: none;
          display: inline-block;
          -webkit-tap-highlight-color: transparent;
        }
        .dp-btn-enter {
          background: var(--red);
          border-color: var(--red);
          color: #080808;
        }
        .dp-btn-enter::before { content: '> '; }
        .dp-btn-enter:hover, .dp-btn-enter:active { background: #ff1111; }
        .dp-btn-lore {
          background: transparent;
          border-color: #222;
          color: var(--dim);
        }
        .dp-btn-lore:hover, .dp-btn-lore:active { border-color: var(--dim); color: var(--bone); }

        /* FOOTER */
        .dp-footer {
          padding: 14px 0;
          border-top: 1px solid #111;
          display: flex;
          justify-content: space-between;
          align-items: center;
          opacity: 0;
          animation: dp-show .1s steps(1) 2.8s forwards;
        }
        .dp-footer-copy {
          font-size: .58rem;
          color: #252525;
          letter-spacing: .1em;
        }
        .dp-footer-count {
          font-size: .58rem;
          color: #252525;
          letter-spacing: .1em;
        }
        .dp-footer-count span { color: var(--red); }

        @media (max-width: 480px) {
          .dp-tagline {
            white-space: normal;
            border-right: none;
            animation: dp-show .1s steps(1) 1s forwards;
          }
          .dp-main { padding: 36px 0 28px; gap: 22px; }
          .dp-cta { gap: 10px; }
          .dp-btn { padding: 12px 20px; width: 100%; text-align: center; }
          .dp-footer { flex-direction: column; gap: 6px; align-items: flex-start; }
        }

        @keyframes dp-show { from{opacity:0} to{opacity:1} }
        @keyframes dp-typeIn { from{width:0; opacity:1} to{width:100%; opacity:1} }
      `}</style>

      <div className="dark-page">
        {!isMobile && <div ref={curRef} className="dp-cur" />}
        <div className="dp-noise" />

        <div className="dp-wrap">
          <header className="dp-header">
            <span className="dp-site-id">
              liibra.com.br/<b>dark</b>
            </span>
            <span className="dp-build">[v0.9.1-alpha]</span>
          </header>

          <main className="dp-main">
            <div className="dp-ascii">{`╔══════════════════════════════════╗\n║  RPG · FANTASIA SOMBRIA · BROWSER ║\n╚══════════════════════════════════╝`}</div>

            <h1 className="dp-title">Liibra</h1>

            <p className="dp-tagline">
              Um reino esquecido pelos deuses. Escolha — ou deixe as trevas escolherem.
            </p>

            <p className="dp-status">
              STATUS: <span>ONLINE</span> &nbsp;·&nbsp; JOGADORES: <span>{count}</span>
            </p>

            <div className="dp-cta">
              <a href="#" className="dp-btn dp-btn-enter">Entrar no jogo</a>
              <a href="#" className="dp-btn dp-btn-lore">[ ler a lore ]</a>
            </div>
          </main>

          <footer className="dp-footer">
            <span className="dp-footer-copy">© 1998–2025 LIIBRA</span>
            <span className="dp-footer-count">
              visitas: <span>{visits.toLocaleString("pt-BR")}</span>
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}

