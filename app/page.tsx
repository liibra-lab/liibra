export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
        padding: "0 2rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3.8rem",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          marginBottom: "1rem",
        }}
      >
        Legal Information Institute of Brazil
      </h1>

      <p
        style={{
          fontSize: "1.25rem",
          maxWidth: "620px",
          lineHeight: 1.55,
          opacity: 0.65,
        }}
      >
        A modern, open-access platform inspired by the clarity and mission of the Cornell Legal Information Institute.
      </p>
    </main>
  );
}

