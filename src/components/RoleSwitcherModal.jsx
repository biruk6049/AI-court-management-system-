import React from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Shield, User, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RoleSwitcherModal({ isOpen, onClose }) {
  const { profile, switchRole } = useAuth();

  if (!isOpen) return null;

  const roles = [
    {
      id: 'Judge',
      title: 'Presiding Judge / Magistrate',
      name: 'Hon. Smith',
      desc: 'High-level judicial overview, hearing calendar management, order approvals, and priority case triage.',
      icon: Shield,
      color: '#818cf8',
      bg: 'rgba(99, 102, 241, 0.15)',
      border: 'rgba(99, 102, 241, 0.35)'
    },
    {
      id: 'Clerk',
      title: 'Court Clerk',
      name: 'Lee Clerk',
      desc: 'Case filing registration, document uploading, evidence tagging, and courtroom schedule allocation.',
      icon: FileText,
      color: '#fbbf24',
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.35)'
    },
    {
      id: 'Lawyer',
      title: 'Lawyer / Counsel',
      name: 'John Wick, Esq.',
      desc: 'Defense filings, motion submissions, case discovery inspection, and courtroom hearing attendance.',
      icon: User,
      color: '#38bdf8',
      bg: 'rgba(14, 165, 233, 0.15)',
      border: 'rgba(14, 165, 233, 0.35)'
    },
    {
      id: 'Admin',
      title: 'System Administrator',
      name: 'Admin User',
      desc: 'Full system audit activity logs, security profile governance, and real-time database management.',
      icon: Sparkles,
      color: '#f87171',
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.35)'
    }
  ];

  const handleSelect = (roleId) => {
    switchRole(roleId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              <Shield size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Switch Judicial Role</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Change active user permissions and dashboard view</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Roles Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {roles.map(r => {
            const IconComponent = r.icon;
            const isCurrent = profile?.role === r.id;
            return (
              <div
                key={r.id}
                onClick={() => handleSelect(r.id)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  background: isCurrent ? r.bg : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isCurrent ? r.border : 'var(--glass-border)'}`,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                className="role-switcher-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: r.bg,
                    color: r.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{r.title}</span>
                      <span className="badge" style={{ background: r.bg, color: r.color, border: `1px solid ${r.border}` }}>
                        {r.id}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: '1.4' }}>
                      {r.desc}
                    </p>
                  </div>
                </div>

                {isCurrent && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: r.color, fontWeight: 700, fontSize: '0.8rem' }}>
                    <CheckCircle2 size={18} />
                    <span>Active</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
