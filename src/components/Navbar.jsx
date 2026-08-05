import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourt } from '../context/CourtContext';
import { Search, Sun, Moon, Shield, LogOut, Sparkles, ChevronDown, Menu } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onToggleSidebar, onOpenRoleModal }) {
  const { profile, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useCourt();
  const [theme, setTheme] = useState('dark');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      document.body.classList.add('light-theme');
    } else {
      setTheme('dark');
      document.body.classList.remove('light-theme');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="rectangular-navbar">
      <style>{`
        .rectangular-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--glass-border);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          border-radius: 0;
        }

        body.light-theme .rectangular-navbar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hamburger-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .hamburger-btn:hover {
          background: rgba(99, 102, 241, 0.2);
          border-color: var(--primary);
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
        }

        .brand-logo {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #0ea5e9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .brand-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.1;
        }

        .search-box {
          position: relative;
          width: 280px;
        }

        .search-box input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.4rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          color: var(--text-main);
          font-size: 0.85rem;
          outline: none;
        }

        body.light-theme .search-box input {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .role-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(99, 102, 241, 0.15);
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.35);
          padding: 0.4rem 0.75rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }

        .role-btn:hover {
          background: rgba(99, 102, 241, 0.3);
          transform: translateY(-1px);
        }

        .user-text-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          border-radius: 10px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--glass-border);
        }

        body.light-theme .user-text-pill {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .user-initials-badge {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: linear-gradient(135deg, #6366f1, #0ea5e9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 0.75rem;
        }

        .user-dropdown-menu {
          position: absolute;
          right: 1.5rem;
          top: 100%;
          background: var(--bg-dark);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 0.5rem;
          width: 200px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
          z-index: 1100;
        }

        @media (max-width: 768px) {
          .search-box { width: 130px; }
        }
      `}</style>

      <div className="nav-left">
        {/* Three Horizontal Bars Hamburger Menu Button */}
        <button className="hamburger-btn" onClick={onToggleSidebar} title="Toggle Side Navigation Menu">
          <Menu size={20} />
        </button>

        <div className="brand-container" onClick={() => setActivePage('dashboard')}>
          <div className="brand-logo">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="brand-title">Astraea AI</div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Court Management System
            </div>
          </div>
        </div>

        <div className="search-box">
          <Search className="search-icon" size={15} />
          <input
            type="text"
            placeholder="Search active cases, hearings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-right">
        {/* Dashboard-Styled Role Switcher Button */}
        <button className="role-btn" onClick={onOpenRoleModal} title="Switch Role Permission Modal">
          <Shield size={14} />
          <span>Switch Role ({profile?.role || 'Judge'})</span>
          <ChevronDown size={13} />
        </button>

        {/* Theme Toggle */}
        <button className="btn btn-secondary btn-icon" onClick={toggleTheme} title="Toggle Light/Dark mode">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Text/Initials Badge User Pill */}
        <div style={{ position: 'relative' }}>
          <div className="user-text-pill" onClick={() => setShowUserDropdown(!showUserDropdown)}>
            <div className="user-initials-badge">
              {getInitials(profile?.name || profile?.full_name)}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {profile?.name || profile?.full_name || 'Hon. Smith'}
            </span>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </div>

          {showUserDropdown && (
            <div className="user-dropdown-menu">
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {profile?.name || 'Hon. Smith'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Role: {profile?.role || 'Judge'}
                </div>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}
                onClick={() => { logout(); setShowUserDropdown(false); }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
