import { useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import RegisterForm from "../components/RegisterForm";
import type { AuthResponse } from "../types/auth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLoginSuccess = (data: AuthResponse) => {
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'rgba(124,58,237,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(6,182,212,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20, justifyContent: 'center' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>{'</>'}</div>
            <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>CodeClash</span>
          </Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>Join the arena</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Create your account and start competing.</p>
        </div>
        <div className="glass-card" style={{ padding: 32 }}>
          <RegisterForm onLoginSuccess={handleLoginSuccess} theme="dark" />
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--purple-light)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
