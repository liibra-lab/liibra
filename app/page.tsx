import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const services = [
  {
    index: "01",
    title: "Systems Architecture",
    body: "Designing modular structures and workflows that scale without fragility.",
  },
  {
    index: "02",
    title: "Strategy & Decision Frameworks",
    body: "Helping leaders navigate uncertainty with clarity and rigor.",
  },
  {
    index: "03",
    title: "Execution & Alignment",
    body: "Turning strategy into sustainable, owned execution.",
  },
];

const insights = [
  {
    tag: "Architecture",
    title: "Modularity as Advantage",
    body: "Why flexible systems outperform rigid hierarchies over time.",
  },
  {
    tag: "Decision-making",
    title: "Designing for Independence",
    body: "Reducing dependency through architectural thinking.",
  },
  {
    tag: "Leadership",
    title: "Clarity Under Pressure",
    body: "Decision-making frameworks for complex environments.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/50">
      <span className="text-sm font-semibold tracking-[0.18em] uppercase text-stone-100">
        Liibra
      </span>
      <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-stone-400">
        <a href="#services" className="hover:text-stone-100 transition-colors duration-200">Services</a>
        <a href="#insights" className="hover:text-stone-100 transition-colors duration-200">Insights</a>
        <a
          href="#contact"
          className="px-4 py-2 border border-stone-600 text-stone-200 hover:bg-stone-100 hover:text-stone-950 transition-all duration-300"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}

function ServiceCard({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div className="group border-t border-stone-700 pt-6 hover:border-stone-300 transition-colors duration-300">
      <span className="text-xs tracking-widest text-stone-500 font-mono">{index}</span>
      <h3 className="mt-3 mb-2 text-base font-medium text-stone-100 group-hover:text-white transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm text-stone-500 leading-relaxed">{body}</p>
    </div>
  );
}

function InsightCard({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div className="group cursor-pointer">
      <div className="mb-3">
        <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 border border-stone-700 px-2 py-0.5">
          {tag}
        </span>
      </div>
      <h3 className="text-base font-medium text-stone-200 mb-2 group-hover:text-white transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm text-stone-500 leading-relaxed mb-4">{body}</p>
      <span className="text-xs tracking-widest uppercase text-stone-500 group-hover:text-stone-300 transition-colors duration-200">
        Read →
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="bg-stone-950 text-stone-300 font-['Garamond','EB_Garamond','Georgia',serif] antialiased">
      <Nav />

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-24">
        <div className="max-w-5xl">
          <p className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-8">
            Management Consulting
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-[-0.02em] text-stone-100 mb-8">
            Clarity,<br />
            structure,<br />
            and strategy.
          </h1>
          <p className="text-lg md:text-xl text-stone-400 max-w-xl leading-relaxed mb-12">
            For organizations that build for the long term.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-stone-100 text-stone-950 text-sm tracking-widest uppercase hover:bg-white transition-colors duration-200"
            >
              Get in touch
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-stone-700 text-stone-300 text-sm tracking-widest uppercase hover:border-stone-400 hover:text-stone-100 transition-all duration-200"
            >
              Our work
            </a>
          </div>
        </div>

           {/* Decorative rule */}
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 text-stone-600">
          <div className="w-px h-16 bg-stone-700" />
          <span className="text-[10px] tracking-[0.3em] uppercase rotate-90 whitespace-nowrap leading-none">
            Est. 2021
          </span>
          <div className="w-px h-16 bg-stone-700" />
        </div>


      {/* SERVICES */}
      <section id="services" className="px-8 md:px-16 lg:px-24 py-28">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between mb-12 border-b border-stone-800 pb-4">
            <h2 className="text-xs tracking-[0.25em] uppercase text-stone-400">
              What we do
            </h2>
            <span className="text-xs text-stone-600 font-mono">Services</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {services.map((s) => (
              <ServiceCard key={s.index} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section id="insights" className="px-8 md:px-16 lg:px-24 py-28 bg-stone-900/40">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between mb-12 border-b border-stone-800 pb-4">
            <h2 className="text-xs tracking-[0.25em] uppercase text-stone-400">
              Insights
            </h2>
            <a href="#" className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-300 transition-colors">
              All articles →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {insights.map((i) => (
              <InsightCard key={i.title} {...i} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="contact" className="px-8 md:px-16 lg:px-24 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="border border-stone-800 p-12 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-4">
                Start a conversation
              </p>
              <h2 className="text-3xl md:text-5xl font-normal text-stone-100 leading-tight">
                Ready to build<br />with clarity?
              </h2>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a
                href="mailto:hello@liibra.com"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-stone-100 text-stone-950 text-sm tracking-widest uppercase hover:bg-white transition-colors duration-200"
              >
                hello@liibra.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 md:px-16 lg:px-24 py-8 border-t border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs tracking-[0.18em] uppercase text-stone-600">Liibra</span>
          <div className="flex items-center gap-6 text-xs tracking-widest uppercase text-stone-600">
            <a href="#services" className="hover:text-stone-400 transition-colors">Services</a>
            <a href="#insights" className="hover:text-stone-400 transition-colors">Insights</a>
            <a href="#contact" className="hover:text-stone-400 transition-colors">Contact</a>
          </div>
          <span className="text-xs text-stone-700">© 2026</span>
        </div>
      </footer>
    </main>
  );
}
