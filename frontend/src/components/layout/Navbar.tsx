import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="sticky top-0 z-50 glass border-b"
      style={{ borderColor: 'rgba(124, 58, 237, 0.15)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link
            to={isAuthenticated ? '/home' : '/'}
            className="flex items-center gap-2 shrink-0"
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 800,
                color: 'white',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {'</>'}
            </div>
            <span
              className="text-xl font-bold gradient-text"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
            >
              CodeClash
            </span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex gap-1">
              {[
                { to: '/home', label: 'Home' },
                { to: '/matches/history', label: 'Matches' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => {
                    (e.target as HTMLElement).style.color = 'var(--text-primary)';
                    (e.target as HTMLElement).style.background = 'rgba(124,58,237,0.1)';
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                    (e.target as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Center: status pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
        >
          <span className="online-dot" style={{ background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }}></span>
          Backend paused ·&nbsp;
          <a
            href="https://www.youtube.com/watch?v=nctT-6Y0xJg"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-text font-semibold"
          >
            Watch AWS demo ↗
          </a>
        </div>

        {/* Right: GitHub + Auth */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/vasudilware07/CodeClash"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            title="View on GitHub"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="hidden sm:block">GitHub</span>
          </a>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm"
              style={{ padding: '7px 16px' }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-sm"
              style={{ padding: '7px 16px' }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

