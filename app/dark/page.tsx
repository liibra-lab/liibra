<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>LIIBRA::DARK</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=UnifrakturMaguntia&family=VT323&display=swap');

    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

    :root {
      --red:   #cc0000;
      --dred:  #880000;
      --black: #080808;
      --bone:  #c8c0b0;
      --dim:   #666050;
    }

    body {
      background: var(--black);
      color: var(--bone);
      font-family: 'Share Tech Mono', monospace;
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      cursor: none;
      overflow-x: hidden;
    }

    /* scanlines */
    body::after {
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

    @keyframes flicker {
      0%,100% { opacity:1 }
      93%     { opacity:.88 }
      96%     { opacity:.94 }
    }
    body { animation: flicker 9s infinite; }

    /* cursor */
    #cur {
      position: fixed;
      width: 8px; height: 14px;
      background: var(--red);
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      animation: blink 1s step-end infinite;
    }
    @keyframes blink { 50%{ opacity:0 } }

    /* noise */
    .noise {
      position: fixed; inset:0;
      pointer-events:none; z-index:8999; opacity:.022;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 120px;
    }

    /* layout */
    .wrap {
      flex: 1;
      max-width: 780px;
      width: 100%;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      flex-direction: column;
    }

    /* HEADER */
    header {
      padding: 16px 0;
      border-bottom: 1px solid var(--dred);
      display: flex;
      justify-content: space-between;
      align-items: center;
      opacity: 0;
      animation: show .1s steps(1) .2s forwards;
    }
    .site-id {
      font-size: clamp(.62rem, 2vw, .75rem);
      color: var(--dim);
      letter-spacing: .1em;
    }
    .site-id b { color: var(--red); }
    .build {
      font-size: .6rem;
      color: #2a2a2a;
      letter-spacing: .1em;
    }

    /* MAIN */
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 48px 0 40px;
      gap: 28px;
    }

    /* ascii box */
    .ascii-box {
      font-size: clamp(.48rem, 1.5vw, .6rem);
      line-height: 1.15;
      color: var(--dred);
      white-space: pre;
      user-select: none;
      opacity: 0;
      animation: show .1s steps(1) .4s forwards;
    }

    /* title */
    .main-title {
      font-family: 'UnifrakturMaguntia', cursive;
      font-size: clamp(3.8rem, 16vw, 8rem);
      color: var(--bone);
      line-height: .85;
      text-shadow: 2px 2px 0 var(--dred);
      position: relative;
      display: inline-block;
      opacity: 0;
      animation: show .1s steps(1) .5s forwards, glitch 7s 2s infinite;
    }
    .main-title::after {
      content: 'DARK';
      position: absolute;
      bottom: -.12em; right: -.04em;
      font-family: 'VT323', monospace;
      font-size: .27em;
      color: var(--red);
      letter-spacing: .4em;
      text-shadow: none;
    }

    @keyframes glitch {
      0%,89%,100% { clip-path:none; transform:none }
      90% { clip-path:polygon(0 15%,100% 15%,100% 35%,0 35%); transform:translate(-3px,0) }
      91% { clip-path:polygon(0 55%,100% 55%,100% 75%,0 75%); transform:translate(3px,0) }
      92% { clip-path:none; transform:none }
    }

    /* tagline — typewriter */
    .tagline {
      font-size: clamp(.72rem, 2.2vw, .82rem);
      color: var(--dim);
      line-height: 1.7;
      max-width: 480px;
      opacity: 0;
      overflow: hidden;
      white-space: nowrap;
      border-right: 1px solid var(--red);
      animation: typeIn 1.1s steps(72) 1s forwards;
    }

    /* status */
    .status {
      font-size: clamp(.58rem, 1.8vw, .65rem);
      color: #333;
      letter-spacing: .08em;
      opacity: 0;
      animation: show .1s steps(1) 2.3s forwards;
    }
    .status span { color: var(--red); }

    /* CTA */
    .cta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      opacity: 0;
      animation: show .1s steps(1) 2.5s forwards;
    }
    .btn {
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
    .btn-enter {
      background: var(--red);
      border-color: var(--red);
      color: #080808;
    }
    .btn-enter::before { content: '> '; }
    .btn-enter:hover, .btn-enter:active { background: #ff1111; }
    .btn-lore {
      background: transparent;
      border-color: #222;
      color: var(--dim);
    }
    .btn-lore:hover, .btn-lore:active { border-color: var(--dim); color: var(--bone); }

    /* FOOTER */
    footer {
      padding: 14px 0;
      border-top: 1px solid #111;
      display: flex;
      justify-content: space-between;
      align-items: center;
      opacity: 0;
      animation: show .1s steps(1) 2.8s forwards;
    }
    .footer-copy {
      font-size: .58rem;
      color: #252525;
      letter-spacing: .1em;
    }
    .footer-count {
      font-size: .58rem;
      color: #252525;
      letter-spacing: .1em;
    }
    .footer-count span { color: var(--red); }

    /* ── MOBILE ── */
    @media (max-width: 480px) {
      .tagline {
        white-space: normal;
        border-right: none;
        animation: show .1s steps(1) 1s forwards;
      }
      main { padding: 36px 0 28px; gap: 22px; }
      .cta { gap: 10px; }
      .btn { padding: 12px 20px; width: 100%; text-align: center; }
      footer { flex-direction: column; gap: 6px; align-items: flex-start; }
    }

    @keyframes show { from{opacity:0} to{opacity:1} }
    @keyframes typeIn { from{width:0; opacity:1} to{width:100%; opacity:1} }
  </style>
</head>
<body>

<div id="cur"></div>
<div class="noise"></div>

<div class="wrap">

  <header>
    <span class="site-id">liibra.com.br/<b>dark</b></span>
    <span class="build">[v0.9.1-alpha]</span>
  </header>

  <main>
    <div class="ascii-box">╔══════════════════════════════════╗
║  RPG · FANTASIA SOMBRIA · BROWSER ║
╚══════════════════════════════════╝</div>

    <h1 class="main-title">Liibra</h1>

    <p class="tagline">Um reino esquecido pelos deuses. Escolha — ou deixe as trevas escolherem.</p>

    <p class="status">STATUS: <span>ONLINE</span> &nbsp;·&nbsp; JOGADORES: <span id="count">---</span></p>

    <div class="cta">
      <a href="#" class="btn btn-enter">Entrar no jogo</a>
      <a href="#" class="btn btn-lore">[ ler a lore ]</a>
    </div>
  </main>

  <footer>
    <span class="footer-copy">© 1998–2025 LIIBRA</span>
    <span class="footer-count">visitas: <span id="visits">2.847</span></span>
  </footer>

</div>

<script>
  // cursor — desktop only
  const cur = document.getElementById('cur');
  const isMobile = () => window.matchMedia('(hover:none)').matches;
  if (!isMobile()) {
    document.addEventListener('mousemove', e => {
      cur.style.left = (e.clientX - 4) + 'px';
      cur.style.top  = (e.clientY - 7) + 'px';
    });
  } else {
    cur.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  // player count
  const target = 280 + Math.floor(Math.random() * 100);
  let n = 0;
  const el = document.getElementById('count');
  const t = setInterval(() => {
    n += Math.ceil((target - n) / 8);
    el.textContent = n;
    if (n >= target) { el.textContent = target; clearInterval(t); }
  }, 60);

  // visit counter slow tick
  let v = 2847;
  setInterval(() => {
    if (Math.random() > 0.65) {
      v++;
      document.getElementById('visits').textContent = v.toLocaleString('pt-BR');
    }
  }, 5000);
</script>

</body>
</html>