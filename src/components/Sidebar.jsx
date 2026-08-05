import React from 'react';
import { useCourt } from '../context/CourtContext';
import { LayoutDashboard, Gavel, Calendar, FileText, Bot, BarChart3, Plus, Sparkles } from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, onOpenNewCase, isOpen = true }) {
  const { cases, schedule } = useCourt();
  const activeCasesCount = cases.filter(c => c.status === 'Active').length;
  const upcomingHearingsCount = schedule.filter(s => s.status === 'Scheduled').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Case Repository', icon: Gavel, badge: cases.length },
    { id: 'schedule', label: 'Court Schedule', icon: Calendar, badge: upcomingHearingsCount },
    { id: 'documents', label: 'Case Documents', icon: FileText },
    { id: 'ai-assistant', label: 'AI Legal Assistant', icon: Bot, isAi: true },
    { id: 'analytics', label: 'Court Analytics', icon: BarChart3 }
  ];

  if (!isOpen) return null;

  return (
    <aside className="flex-sidebar-container">
      <style>{`
        .flex-sidebar-container {
          position: fixed;
          top: var(--header-height);
          left: 0;
          bottom: 0;
          width: var(--sidebar-width);
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid var(--glass-border);
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 900;
          animation: slideRight 0.2s ease-out;
        }

        @keyframes slideRight {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        body.light-theme .flex-sidebar-container {
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
        }

        .sidebar-top-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .nav-flex-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .nav-flex-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.88rem;
          transition: var(--transition);
        }

        .nav-flex-item-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-flex-item:hover {
          background: var(--card-hover-bg);
          color: var(--text-main);
          transform: translateX(4px);
        }

        .nav-flex-item.active {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(14, 165, 233, 0.25));
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.35);
        }

        .nav-flex-item.ai-item {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(244, 63, 94, 0.15));
          color: #c084fc;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .nav-flex-item.ai-item.active {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(244, 63, 94, 0.35));
          color: #e9d5ff;
        }

        .nav-badge {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
        }

        body.light-theme .nav-badge {
          background: #e2e8f0;
          color: #0f172a;
        }

        .sidebar-bottom-widget {
          padding: 1rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
        }

        body.light-theme .sidebar-bottom-widget {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        @media (max-width: 992px) {
          .flex-sidebar-container {
            width: 240px;
          }
        }
      `}</style>

      <div className="sidebar-top-section">
        <div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={onOpenNewCase}>
            <Plus size={16} />
            <span>New Case Filing</span>
          </button>
        </div>

        <ul className="nav-flex-list">
          {navItems.map(item => {
            const IconComponent = item.icon;
            const isActive = activePage === item.id;
            return (
              <li
                key={item.id}
                className={`nav-flex-item ${isActive ? 'active' : ''} ${item.isAi ? 'ai-item' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                <div className="nav-flex-item-content">
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="nav-badge">{item.badge}</span>
                )}
                {item.isAi && <Sparkles size={14} style={{ color: '#c084fc' }} />}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar-bottom-widget">
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
          Live Docket Summary
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>{activeCasesCount}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active Cases</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0ea5e9' }}>{upcomingHearingsCount}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hearings</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
