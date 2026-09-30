import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Swords, Zap, Timer, CheckCircle2, Trophy, Gamepad2, XCircle, Handshake, ChevronRight } from 'lucide-react';
import { useAuth } from '../core/hooks/useAuth';
import { getCurrentUserStats, getMatchHistory } from '../features/match/services/matchService';
import { getProblemCount } from '../features/problem/services/problemService';
import type { UserStats, PastMatch } from '../features/match/types/match';
import { formatDistanceToNow } from 'date-fns';

const StatCard: React.FC<{ to: string; icon: React.ReactNode; label: string; value: number | string; color: string }> = ({ to, icon, label, value, color }) => (
  <Link to={to} className="glass-card p-5 flex items-center gap-4 cursor-pointer" style={{ textDecoration: 'none' }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: color === 'purple' ? 'rgba(124,58,237,0.15)' : color === 'cyan' ? 'rgba(6,182,212,0.12)' : color === 'green' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: color === 'purple' ? 'var(--purple-light)' : color === 'cyan' ? 'var(--cyan-light)' : color === 'green' ? '#34d399' : '#f87171',
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</p>
      <p className="stat-number" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{value}</p>
    </div>
  </Link>
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasFetched = useRef(false);

  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentMatches, setRecentMatches] = useState<PastMatch[]>([]);
  const [, setProblemCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.email || hasFetched.current) {
      setIsLoading(false);
      return;
    }
    hasFetched.current = true;
    const fetchData = async () => {
      try {
        const [statsData, historyData, problemCountData] = await Promise.all([
          getCurrentUserStats(),
          getMatchHistory({ page: 0, size: 3 }),
          getProblemCount(),
        ]);
        setStats(statsData);
        setRecentMatches(historyData?.content || []);
        setProblemCount(problemCountData.totalCount);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.email]);

  const getResultBadge = (result: PastMatch['result']) => {
    switch (result) {
      case 'WIN':  return 'badge-green';
      case 'LOSS': return 'badge-red';
      case 'DRAW': return 'badge-cyan';
      default:     return 'badge-purple';
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 96 }}>
        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--purple-light)' }} />
      </div>
    );
  }

  const username = user?.email ? user.email.split('@')[0] : 'Coder';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingBottom: 80 }}>

      {/* ── Hero / Welcome ── */}
      <div className="animate-slide-up" style={{ paddingTop: 16 }}>
        <p style={{ fontSize: 13, color: 'var(--purple-light)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Welcome back
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}>
          Ready to{' '}
          <span className="gradient-text">clash</span>
          ,{' '}
          <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{username}</span>?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Pick a battle mode and start competing.
        </p>
      </div>

      {/* ── Game Mode Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

        {/* Codeforces Duel */}
        <div
          className="glass-card"
          style={{ padding: 28, borderColor: 'rgba(124,58,237,0.2)', position: 'relative', overflow: 'hidden' }}
        >
          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 120, height: 120,
            borderRadius: '50%', background: 'rgba(124,58,237,0.12)', filter: 'blur(30px)', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.1))',
                border: '1px solid rgba(124,58,237,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--purple-light)',
              }}>
                <Swords size={20} />
              </div>
              <span className="badge-purple"><Zap size={9} style={{ display: 'inline', marginRight: 3 }} />Recommended</span>
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Codeforces Duel
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              Battle on multiple problems from live Codeforces contests with <strong style={{ color: 'var(--text-primary)' }}>ICPC Scoring</strong> (Points + Time Penalty).
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {['Supports 1–4 problems per duel', 'Official ICPC Penalty Rules', 'Submit directly on Codeforces'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--purple-light)', flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/duel/create')}>
                Create Room
              </button>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/duel/join')}>
                Join Room
              </button>
            </div>
          </div>
        </div>

        {/* Standard Match */}
        <div
          className="glass-card glass-card-cyan"
          style={{ padding: 28, borderColor: 'rgba(6,182,212,0.15)', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 120, height: 120,
            borderRadius: '50%', background: 'rgba(6,182,212,0.08)', filter: 'blur(30px)', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.08))',
                border: '1px solid rgba(6,182,212,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--cyan-light)',
              }}>
                <Gamepad2 size={20} />
              </div>
              <span className="badge-cyan"><Timer size={9} style={{ display: 'inline', marginRight: 3 }} />Speed Run</span>
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Standard Match
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              Rapid 1v1 on a single problem from our library. <strong style={{ color: 'var(--text-primary)' }}>Sudden Death:</strong> First to solve wins instantly.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {['Single Problem (Internal Library)', 'First AC ends the match', 'Best for quick warmups'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--cyan-light)', flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-cyan" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/match/create')}>
                Create Match
              </button>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/match/join')}>
                Join Match
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats + Recent Activity (authenticated only) ── */}
      {user ? (
        <>
          {stats && (
            <section>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Your Performance
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <StatCard to="/matches/history?result=ALL"  icon={<Gamepad2 size={20} />}  label="Played" value={stats.duelsPlayed} color="purple" />
                <StatCard to="/matches/history?result=WIN"  icon={<Trophy size={20} />}    label="Won"    value={stats.duelsWon}    color="green" />
                <StatCard to="/matches/history?result=LOSS" icon={<XCircle size={20} />}   label="Lost"   value={stats.duelsLost}   color="red" />
                <StatCard to="/matches/history?result=DRAW" icon={<Handshake size={20} />} label="Drawn"  value={stats.duelsDrawn}  color="cyan" />
              </div>
            </section>
          )}

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Recent Activity
              </h2>
              <Link to="/matches/history" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--purple-light)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
              {recentMatches.length > 0 ? (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {recentMatches.map((match, i) => {
                    const displayDate = match.endedAt || match.createdAt;
                    const isDuel = match.matchType === 'DUEL' || match.problemTitle.includes('Duel');
                    return (
                      <li
                        key={match.matchId}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '14px 20px',
                          borderBottom: i < recentMatches.length - 1 ? '1px solid var(--border)' : 'none',
                          transition: 'background 0.2s',
                          cursor: 'default',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: isDuel ? 'rgba(124,58,237,0.12)' : 'rgba(6,182,212,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isDuel ? 'var(--purple-light)' : 'var(--cyan-light)',
                          }}>
                            {isDuel ? <Swords size={16} /> : <Gamepad2 size={16} />}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14, marginBottom: 2 }} className="line-clamp-1">
                              {match.problemTitle}
                            </p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>vs {match.opponentUsername}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                          <span className={getResultBadge(match.result)}>{match.result}</span>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                            {formatDistanceToNow(new Date(displayDate))} ago
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Gamepad2 size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <p style={{ fontSize: 14 }}>No matches played yet. Start your first battle!</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <section
          className="glass-card gradient-border"
          style={{ padding: 40, textAlign: 'center' }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Trophy size={24} style={{ color: 'var(--purple-light)' }} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Track Your Progress</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>
            Sign in to see your match history, win rates, and performance stats.
          </p>
          <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => navigate('/login')}>
            Sign In to Dashboard
          </button>
        </section>
      )}
    </div>
  );
};

export default Home;
