import React, { useState, useEffect } from "react";
import { useAuth } from "../../../core/hooks/useAuth";
import { Loader2, Trophy, Gamepad2, XCircle, Handshake, ChevronRight } from "lucide-react";
import { getCurrentUserStats } from "../../match/services/matchService";
import type { UserStats } from "../../match/types/match";
import { useNavigate } from "react-router-dom";

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: number | string; color: string }> = ({ icon, label, value, color }) => (
  <div className="glass-card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: color === "purple" ? "rgba(124,58,237,0.15)" : color === "cyan" ? "rgba(6,182,212,0.12)" : color === "green" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: color === "purple" ? "var(--purple-light)" : color === "cyan" ? "var(--cyan-light)" : color === "green" ? "#34d399" : "#f87171",
    }}>{icon}</div>
    <div>
      <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</p>
      <p className="stat-number" style={{ color: "var(--text-primary)" }}>{value}</p>
    </div>
  </div>
);

const StatsSection = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUserStats().then(setStats).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Duel Stats
        </h2>
        <button onClick={() => navigate("/matches/history")} style={{
          display: "flex", alignItems: "center", gap: 4, color: "var(--purple-light)", fontSize: 13, fontWeight: 600, background: "none", border: "none", cursor: "pointer"
        }}>
          View History <ChevronRight size={14} />
        </button>
      </div>
      {isLoading && <div style={{ display: "flex", justifyContent: "center", padding: 32 }}><Loader2 className="animate-spin" size={24} style={{ color: "var(--purple-light)" }} /></div>}
      {!isLoading && stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <StatItem icon={<Gamepad2 size={22} />} label="Played" value={stats.duelsPlayed} color="purple" />
          <StatItem icon={<Trophy size={22} />}   label="Won"    value={stats.duelsWon}    color="green" />
          <StatItem icon={<XCircle size={22} />}  label="Lost"   value={stats.duelsLost}   color="red" />
          <StatItem icon={<Handshake size={22} />} label="Drawn" value={stats.duelsDrawn}  color="cyan" />
        </div>
      )}
      {!isLoading && !stats && (
        <div className="glass-card" style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
          No stats available yet. Play some matches!
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useAuth();
  const username = user?.email?.split("@")[0] || "User";
  const initial = username.charAt(0).toUpperCase();

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32, paddingBottom: 64, paddingTop: 16 }}>
      {/* Profile Header */}
      <div className="glass-card" style={{ padding: 28, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18, flexShrink: 0,
          background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 800, color: "white", fontFamily: "Space Grotesk, sans-serif",
          boxShadow: "0 8px 32px rgba(124,58,237,0.3)",
        }}>
          {initial}
        </div>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, textTransform: "capitalize" }}>
            {username}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{user?.email}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <span className="online-dot"></span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Active Competitor</span>
          </div>
        </div>
      </div>

      <StatsSection />
    </div>
  );
};

export default ProfilePage;
