// File: D:\LegacyMindAI\components\AuthGuard.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/session');
      if (res.ok) {
        setAuthenticated(true);
      } else {
        router.push('/login');
      }
      setLoading(false);
    }
    checkSession();
  }, [router]);

  if (loading) return <p style={{ color: '#fff' }}>Checking auth...</p>;

  return <>{authenticated ? children : null}</>;
}
