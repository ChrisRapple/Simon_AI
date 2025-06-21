import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setAuthenticated(true);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setChecked(true);
      }
    }
    checkSession();
  }, []);

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
      overflow: "hidden"
    }}>
      <img
        src="/LegacyMind1.png"
        alt="LegacyMind.ai Logo"
        style={{ width: "200px", marginBottom: "30px" }}
      />
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>Welcome to LegacyMind.ai</h1>
      <p style={{ fontSize: "1.2rem", color: "#CCCCCC", marginBottom: "40px" }}>
        LegacyMind is a digital preservation company dedicated to capturing the essence of human experience through AI.
        We create interactive, intelligent avatars that echo the voices, values, and stories of those who matter most—forever.
      </p>

      {checked && authenticated ? (
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
      ) : checked ? (
        <a href="/api/auth/signin" style={{
          backgroundColor: "#4CAF50",
          color: "#FFFFFF",
          padding: "12px 24px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          transition: "background-color 0.3s ease"
        }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#388E3C"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
        >
          Login to Talk to Simon
        </a>
      ) : null}
    </div>
  );
}
