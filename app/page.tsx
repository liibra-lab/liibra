export default function Home() {
  return (
    <main
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* HERO */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3.6rem",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}
        >
          Liibra Consulting
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            maxWidth: "640px",
            lineHeight: 1.55,
            opacity: 0.65,
          }}
        >
          Clarity, structure, and strategy for organizations that build for the long term.
        </p>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "6rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "2rem" }}>What we do</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
          <div>
            <h3>Systems Architecture</h3>
            <p style={{ opacity: 0.65 }}>
              Designing modular structures and workflows that scale without fragility.
            </p>
          </div>

          <div>
            <h3>Strategy & Decision Frameworks</h3>
            <p style={{ opacity: 0.65 }}>
              Helping leaders navigate uncertainty with clarity and rigor.
            </p>
          </div>

          <div>
            <h3>Execution & Alignment</h3>
            <p style={{ opacity: 0.65 }}>
              Turning strategy into sustainable, owned execution.
            </p>
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section style={{ padding: "6rem 2rem", backgroundColor: "#f6f7f8" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "2rem" }}>Insights</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
            <div>
              <h3>Modularity as advantage</h3>
              <p style={{ opacity: 0.65 }}>
                Why flexible systems outperform rigid hierarchies.
              </p>
            </div>

            <div>
              <h3>Designing for independence</h3>
              <p style={{ opacity: 0.65 }}>
                Reducing dependency through architectural thinking.
              </p>
            </div>

            <div>
              <h3>Clarity under pressure</h3>
              <p style={{ opacity: 0.65 }}>
                Decision‑making frameworks for complex environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          fontSize: "0.85rem",
          opacity: 0.6,
        }}
      >
        © 2026 Liibra Consulting
      </footer>
    </main>
  );
}
