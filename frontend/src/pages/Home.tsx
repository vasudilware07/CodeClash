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


import { Loader2, Swords, Zap, Timer, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../core/hooks/useAuth';
import { getCurrentUserStats, getMatchHistory } from '../features/match/services/matchService';
import { getProblemCount } from '../features/problem/services/problemService';
import type { UserStats, PastMatch } from '../features/match/types/match';
import { formatDistanceToNow } from 'date-fns';

const StatCard: React.FC<{ to: string; icon: React.ReactNode; label: string; value: number | string }> = ({ to, icon, label, value }) => (
  <Link 
    to={to} 
    className="group bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-b-4 hover:border-b-[#F97316] shadow-sm"
  >
    <div className="text-[#F97316] text-3xl transition-transform group-hover:scale-110">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
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
        console.error("Failed to load stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.email]);

  const getResultInfo = (result: PastMatch['result']) => {
    switch (result) {
      case 'WIN': return { className: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400', text: 'WIN' };
      case 'LOSS': return { className: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400', text: 'LOSS' };
      case 'DRAW': return { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400', text: 'DRAW' };
      default: return { className: 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400', text: result };
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center pt-24"><Loader2 className="animate-spin text-[#F97316]" size={48} /></div>;
  }

  const username = user?.email ? user.email.split('@')[0] : "Coder";

  return (
    <div className="space-y-10 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Welcome, <span className="text-[#F97316] capitalize">{username}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Choose your battle mode.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl p-8 border border-orange-200 dark:border-zinc-700 shadow-sm transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-5">
            <Swords size={120} className="text-[#F97316]" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-200 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold mb-4">
              <Zap size={12} /> RECOMMENDED
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
              <Swords className="text-[#F97316]" /> Codeforces Duel
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 min-h-[48px]">
              Battle on multiple problems from live Codeforces contests. 
              <strong> ICPC Scoring</strong> (Points + Time Penalty).
            </p>

            <ul className="space-y-2 mb-8 text-sm text-gray-700 dark:text-gray-300">
               <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Supports multiple problems (1-4)</li>
               <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Official ICPC Penalty Rules</li>
               <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Submit directly on Codeforces</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/duel/create')} className="flex-1 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all transform hover:scale-105">
                Create Room
              </button>
              <button onClick={() => navigate('/duel/join')} className="flex-1 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg border border-gray-200 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                Join Room
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-gray-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <FaGamepad size={120} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 text-xs font-bold mb-4">
              <Timer size={12} /> SPEED RUN
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
              <FaCode className="text-blue-500" /> Standard Match
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 min-h-[48px]">
              A rapid 1v1 on a single problem from our library.
              <strong> Sudden Death Rules:</strong> The first person to solve it wins instantly.
            </p>

            <ul className="space-y-2 mb-8 text-sm text-gray-700 dark:text-gray-300">
               <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Single Problem (Internal Library)</li>
               <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> First AC ends the match</li>
               <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Best for quick warmups</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/match/create')} className="flex-1 bg-gray-900 dark:bg-zinc-700 hover:bg-gray-800 dark:hover:bg-zinc-600 text-white font-bold py-3 px-6 rounded-lg transition-all">
                Create Match
              </button>
              <button onClick={() => navigate('/match/join')} className="flex-1 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg border border-gray-200 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                Join Match
              </button>
            </div>
          </div>
        </div>
      </div>

      {user ? (
        <>
          {stats && (
            <section>
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Your Performance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard to="/matches/history?result=ALL" icon={<FaGamepad />} label="Played" value={stats.duelsPlayed} />
                <StatCard to="/matches/history?result=WIN" icon={<FaTrophy />} label="Won" value={stats.duelsWon} />
                <StatCard to="/matches/history?result=LOSS" icon={<FaTimesCircle />} label="Lost" value={stats.duelsLost} />
                <StatCard to="/matches/history?result=DRAW" icon={<FaHandshake />} label="Drawn" value={stats.duelsDrawn} />
              </div>
            </section>
          )}

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              <Link to='/matches/history' className="text-[#F97316] hover:text-[#EA580C] font-semibold flex items-center gap-1 transition-colors text-sm">
                View All <FaAngleRight />
              </Link>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              {recentMatches.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {recentMatches.map((match) => {
                    const resultInfo = getResultInfo(match.result);
                    const displayDate = match.endedAt || match.createdAt;
                    const isDuel = match.matchType === 'DUEL' || match.problemTitle.includes("Duel");

                    return (
                      <li key={match.matchId} className="p-4 sm:p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${match.result === 'WIN' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}>
                             {isDuel ? <Swords size={16} /> : <FaGamepad size={16} />}
                          </div>
                          <div>
                              <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{match.problemTitle}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">vs {match.opponentUsername}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${resultInfo.className}`}>
                            {resultInfo.text}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(displayDate))} ago</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <FaGamepad className="mx-auto text-4xl mb-4 opacity-20" />
                  <p>No matches played yet.</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="bg-gray-100 dark:bg-zinc-900 rounded-xl p-8 text-center border border-gray-200 dark:border-zinc-800">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Track Your Progress</h2>
           <p className="text-gray-500 dark:text-gray-400 mb-6">Login to see your detailed match history, win rates, and problem stats.</p>
           <button onClick={() => navigate('/login')} className="inline-flex items-center gap-2 bg-gray-900 dark:bg-zinc-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg transition-all">
             <FaSignInAlt /> Login to Dashboard
           </button>
        </section>
      )}

    </div>
  );
};

export default Home;