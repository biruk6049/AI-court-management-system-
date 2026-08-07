import React from 'react';
import { useCourt } from '../context/CourtContext';
import { BarChart3, TrendingUp, PieChart, Clock, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AnalyticsPage() {
  const { cases, schedule } = useCourt();

  const activeCount = cases.filter(c => c.status === 'Active').length;
  const pendingCount = cases.filter(c => c.status === 'Pending').length;
  const closedCount = cases.filter(c => c.status === 'Closed').length;

  const typeCounts = {
    Criminal: cases.filter(c => c.type === 'Criminal').length,
    Civil: cases.filter(c => c.type === 'Civil').length,
    Probate: cases.filter(c => c.type === 'Probate').length,
    Family: cases.filter(c => c.type === 'Family').length
  };

  return (
    <div className="analytics-page">
      <style>{`
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .bar-container {
          margin-bottom: 1rem;
        }

        .bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 0.3rem;
        }

        .bar-bg {
          height: 10px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 5px;
          overflow: hidden;
        }

        body.light-theme .bar-bg {
          background: #e2e8f0;
        }

        .bar-fill {
          height: 100%;
          border-radius: 5px;
          transition: width 0.6s ease;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Court System Analytics</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Judicial throughput, case load distribution, clearance rates, and timeline performance metrics
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div>
            <div className="stat-lbl">Clearance Rate</div>
            <div className="stat-val" style={{ color: '#34d399' }}>94.2%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>+3.5% this quarter</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <TrendingUp size={26} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div>
            <div className="stat-lbl">Avg Resolution Time</div>
            <div className="stat-val" style={{ color: '#38bdf8' }}>42 Days</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>From filing to judgment</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8' }}>
            <Clock size={26} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div>
            <div className="stat-lbl">Courtroom Efficiency</div>
            <div className="stat-val" style={{ color: '#a5b4fc' }}>98.1%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>On-time hearing starts</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
            <ShieldCheck size={26} />
          </div>
        </div>
      </div>

      {/* Visual Progress Breakdown */}
      <div className="analytics-grid">
        {/* Case Breakdown by Classification */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} style={{ color: 'var(--primary)' }} />
            Case Load by Classification
          </h3>

          {Object.entries(typeCounts).map(([type, val]) => {
            const pct = Math.round((val / (cases.length || 1)) * 100);
            return (
              <div key={type} className="bar-container">
                <div className="bar-label">
                  <span>{type}</span>
                  <span style={{ fontWeight: 700 }}>{val} cases ({pct}%)</span>
                </div>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #0ea5e9)' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Case Status Distribution */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} style={{ color: 'var(--secondary)' }} />
            Case Status Lifecycle
          </h3>

          {[
            { label: 'Active Docket', val: activeCount, color: '#f87171' },
            { label: 'Pending Review', val: pendingCount, color: '#fbbf24' },
            { label: 'Closed / Resolved', val: closedCount, color: '#34d399' }
          ].map((item, i) => {
            const pct = Math.round((item.val / (cases.length || 1)) * 100);
            return (
              <div key={i} className="bar-container">
                <div className="bar-label">
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 700 }}>{item.val} ({pct}%)</span>
                </div>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${pct}%`, background: item.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
