import React from 'react';
import { useCourt } from '../context/CourtContext';
import { useAuth } from '../context/AuthContext';
import { Gavel, Calendar, FileText, Activity, Clock, Plus, Sparkles, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DashboardPage({ setActivePage, onOpenNewCase, onOpenNewHearing, onSelectCase }) {
  const { cases, schedule, auditLogs } = useCourt();
  const { profile } = useAuth();

  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status === 'Active').length;
  const highPriorityCases = cases.filter(c => c.priority === 'High').length;
  const upcomingHearings = schedule.filter(s => s.status === 'Scheduled');

  return (
    <div className="dashboard-page">
      <style>{`
        .welcome-banner {
          padding: 2rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(14, 165, 233, 0.15));
          border: 1px solid rgba(99, 102, 241, 0.4);
          border-radius: var(--border-radius);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .case-card-row {
          padding: 1rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .case-card-row:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateX(4px);
        }

        .hearing-item {
          padding: 0.85rem;
          border-radius: 10px;
          background: rgba(14, 165, 233, 0.08);
          border-left: 4px solid var(--secondary);
          margin-bottom: 0.75rem;
        }

        .audit-item {
          padding: 0.65rem 0;
          border-bottom: 1px solid var(--glass-border-light);
          font-size: 0.825rem;
        }

        @media (max-width: 992px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .welcome-banner { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-role">{profile?.role || 'Judge'} Portal</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-Time Docket Sync</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Welcome back, <span className="gradient-text">{profile?.name || profile?.full_name || 'Honorable Magistrate'}</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Astraea Judicial System monitoring {activeCases} active cases and {upcomingHearings.length} scheduled court sessions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={onOpenNewCase}>
            <Plus size={16} />
            <span>New Case</span>
          </button>
          <button className="btn btn-secondary" onClick={() => setActivePage('ai-assistant')}>
            <Sparkles size={16} style={{ color: '#c084fc' }} />
            <span>Launch AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Stats */}
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div>
            <div className="stat-lbl">Active Docket Cases</div>
            <div className="stat-val">{activeCases}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Total registered: {totalCases}</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
            <Gavel size={26} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div>
            <div className="stat-lbl">Upcoming Hearings</div>
            <div className="stat-val">{upcomingHearings.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Scheduled sessions</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8' }}>
            <Calendar size={26} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div>
            <div className="stat-lbl">High Priority Flags</div>
            <div className="stat-val" style={{ color: '#f87171' }}>{highPriorityCases}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Urgent attention</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
            <AlertTriangle size={26} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div>
            <div className="stat-lbl">Clearance Rate</div>
            <div className="stat-val" style={{ color: '#34d399' }}>94.2%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>System Efficiency</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <ShieldCheck size={26} />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="dashboard-grid">
        {/* Left Column: Recent Active Cases */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title" style={{ margin: 0 }}>
                <Gavel size={18} style={{ color: 'var(--primary)' }} />
                Active Docket Cases
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('cases')}>
                <span>View All Cases</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {cases.slice(0, 4).map(c => (
              <div key={c.id} className="case-card-row" onClick={() => onSelectCase(c)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="badge badge-role" style={{ fontSize: '0.75rem' }}>{c.id}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Judge: {c.judge} • Type: {c.type}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span>
                  <span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick AI Legal Insight Box */}
          <div className="glass-panel" style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(244, 63, 94, 0.15))',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Sparkles size={20} style={{ color: '#c084fc' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e9d5ff' }}>AI Judicial Assistant Summary</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#ddd6fe', lineHeight: '1.6' }}>
              Case <strong>C-2026-001 (State vs. Doe)</strong> has an upcoming hearing in 9 days. High priority flag detected based on criminal charge severity and witness filing updates.
            </p>
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
              onClick={() => setActivePage('ai-assistant')}
            >
              Consult Legal Assistant
            </button>
          </div>
        </div>

        {/* Right Column: Upcoming Schedule & Audit Feed */}
        <div>
          {/* Upcoming Hearings Widget */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title" style={{ margin: 0 }}>
                <Calendar size={18} style={{ color: 'var(--secondary)' }} />
                Upcoming Hearings
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={onOpenNewHearing}>
                <Plus size={14} />
              </button>
            </div>

            {upcomingHearings.length > 0 ? (
              upcomingHearings.map(h => (
                <div key={h.id} className="hearing-item">
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{h.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {new Date(h.date).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7dd3fc', marginTop: '0.2rem', fontWeight: 500 }}>
                    {h.room} • {h.judge}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textAlign: 'center', padding: '1rem' }}>
                No hearings scheduled today.
              </div>
            )}
          </div>

          {/* Real-time Audit Feed */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 className="section-title">
              <Activity size={18} style={{ color: 'var(--success)' }} />
              Live Audit Log
            </h3>

            {auditLogs.slice(0, 5).map((log, idx) => (
              <div key={log.id || idx} className="audit-item">
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.action}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.details}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
                  {log.user_name} • {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
