export default function Home() {
  return (
    <div style={{
      backgroundColor: "#1E1E1E",
      color: "#FFFFFF",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      textAlign: "center",
      padding: "20px",
      overflow: "hidden" // prevents child content from overflowing
    }}>
      <img
        src="/LegacyMind1.png"
        alt="LegacyMind.ai Logo"
        style={{ width: "200px", marginBottom: "30px" }}
      />
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>Welcome to LegacyMind.ai</h1>
      <p style={{ fontSize: "1.2rem", color: "#CCCCCC", marginBottom: "40px" }}>
        Talk to Simon, your grief companion AI.
      </p>
      <a href="/simon" style={{
        backgroundColor: "#2196F3",
        color: "#FFFFFF",
        padding: "12px 24px",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "bold",
        transition: "background-color 0.3s ease"
      }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1A73E8"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2196F3"}
      >
        Talk to Simon
      </a>
    </div>
  );
}
