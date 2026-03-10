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
          minHeight: "85vh",
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
            fontSize: "3.4rem",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          Liibra Consulting
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            maxWidth: "600px",
            lineHeight: 1.6,
            opacity: 0.65,
          }}
        >
          Clarity, structure, and strategy for organizations that build for the long term.
        </p>
      </section>

      {/* SERVICES */}
      <section
        style={{
          padding: "6rem 2rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "1.35rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
            marginBottom: "2.5rem",
            textAlign: "left",
          }}
        >
          What we do
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Systems Architecture
            </h3>
            <p style={{ opacity: 0.65, lineHeight: 1.6 }}>
              Designing modular structures and workflows that scale without fragility.
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Strategy & Decision Frameworks
            </h3>
            <p style={{ opacity: 0.65, lineHeight: 1.6 }}>
              Helping leaders navigate uncertainty with clarity and rigor.
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Execution & Alignment
            </h3>
            <p style={{ opacity: 0.65, lineHeight: 1.6 }}>
              Turning strategy into sustainable, owned execution.
            </p>
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section
        style={{
          padding: "6rem 2rem",
          backgroundColor: "#f6f7f8",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.35rem",
              fontWeight: 500,
              letterSpacing: "0.02em",
              marginBottom: "2.5rem",
              textAlign: "left",
            }}
          >
            Insights
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  marginBottom: "0.4rem",
                }}
              >
                Modularity as Advantage
              </h3>
              <p style={{ opacity: 0.65, lineHeight: 1.6 }}>
                Why flexible systems outperform rigid hierarchies.
              </p>
            </div>

            <div>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  marginBottom: "0.4rem",
                }}
              >
                Designing for Independence
              </h3>
              <p style={{ opacity: 0.65, lineHeight: 1.6 }}>
                Reducing dependency through architectural thinking.
              </p>
            </div>

            <div>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  marginBottom: "0.4rem",
                }}
              >
                Clarity Under Pressure
              </h3>
              <p style={{ opacity: 0.65, lineHeight: 1.6 }}>
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
          fontSize: "0.8rem",
          opacity: 0.5,
        }}
      >
        © 2026 Liibra Consulting
      </footer>
    </main>
  );
}
