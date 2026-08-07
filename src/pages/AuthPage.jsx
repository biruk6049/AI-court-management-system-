import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, User, Gavel, FileText, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const { loginWithCredentials, loginAsRole, registerUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState('Judge');
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleProfiles = {
    Judge: { username: 'judge_smith', name: 'Hon. Smith', desc: 'Presiding Magistrate Access & Case Directives', icon: Shield, color: '#818cf8' },
    Clerk: { username: 'clerk_lee', name: 'Lee Clerk', desc: 'Docket Filing & Hearing Calendar Scheduling', icon: FileText, color: '#fbbf24' },
    Lawyer: { username: 'lawyer_wick', name: 'John Wick, Esq.', desc: 'Defense Motions & Evidence Discovery', icon: User, color: '#38bdf8' },
    Admin: { username: 'admin', name: 'System Administrator', desc: 'Audit Logs & Security User Permissions', icon: Sparkles, color: '#f87171' }
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setError(null);
  };

  const handleRoleLogin = (roleKey) => {
    loginAsRole(roleKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        await registerUser({ email, password, fullName, role: selectedRole });
      } else {
        const uName = email || roleProfiles[selectedRole].username;
        await loginWithCredentials(uName, password || 'password');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-landing-wrapper">
      <style>{`
        .auth-landing-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .auth-card-container {
          width: 100%;
          max-width: 540px;
          padding: 2.5rem;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
        }

        body.light-theme .auth-card-container {
          background: #ffffff;
          border-color: #e2e8f0;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .role-grid-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .role-card-btn {
          padding: 0.85rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        body.light-theme .role-card-btn {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .role-card-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        body.light-theme .role-card-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .role-card-btn.active {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(14, 165, 233, 0.25));
          border-color: var(--primary);
        }

        body.light-theme .role-card-btn.active {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(14, 165, 233, 0.1));
          border-color: var(--primary);
        }
      `}</style>

      <div className="auth-card-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img
            src="/astrea_logo.png"
            alt="ASTREA - AI Court Management System"
            style={{
              height: 60,
              width: 'auto',
              objectFit: 'contain',
              margin: '0 auto 1rem',
              display: 'block',
              borderRadius: 12
            }}
          />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>ASTREA Portal</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Select your judicial role to sign in to the court network
          </p>
        </div>

        {/* Role Cards Grid */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
          Select Role Authentication
        </div>

        <div className="role-grid-cards">
          {Object.entries(roleProfiles).map(([key, prof]) => {
            const IconComp = prof.icon;
            const isSelected = selectedRole === key;
            return (
              <div
                key={key}
                className={`role-card-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleRoleSelect(key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: prof.color }}>
                    <IconComp size={16} />
                    <span>{key} Portal</span>
                  </div>
                  {isSelected && <CheckCircle2 size={14} style={{ color: varPrimary('#6366f1') }} />}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {prof.name}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder={`e.g. ${roleProfiles[selectedRole].name}`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <input
              type="text"
              className="form-input"
              placeholder={roleProfiles[selectedRole].username}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Security Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={isSubmitting}>
            <span>{isRegister ? `Register as ${selectedRole}` : `Sign In as ${selectedRole}`}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Login Button for Selected Role */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', borderColor: roleProfiles[selectedRole].color }}
            onClick={() => handleRoleLogin(selectedRole)}
          >
            <CheckCircle2 size={16} style={{ color: roleProfiles[selectedRole].color }} />
            <span>Enter Portal as {roleProfiles[selectedRole].name} ({selectedRole})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function varPrimary(fallback) {
  return '#6366f1';
}
