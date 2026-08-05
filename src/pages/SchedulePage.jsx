import React, { useState } from 'react';
import { useCourt } from '../context/CourtContext';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, User } from 'lucide-react';

export default function SchedulePage({ onOpenNewHearing }) {
  const { schedule, cases } = useCourt();
  const [selectedDateFilter, setSelectedDateFilter] = useState('All');

  const filteredSchedule = schedule.filter(s => {
    if (selectedDateFilter === 'Scheduled') return s.status === 'Scheduled';
    if (selectedDateFilter === 'Completed') return s.status === 'Completed';
    return true;
  });

  return (
    <div className="schedule-page">
      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .schedule-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .hearing-card {
          padding: 1.25rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-left: 4px solid var(--primary);
        }

        .hearing-time-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
          font-weight: 600;
          font-size: 0.85rem;
        }

        @media (max-width: 992px) {
          .schedule-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Judicial Court Schedule</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Real-time calendar docket, courtroom allocations, and hearing timetables
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenNewHearing}>
          <Plus size={16} />
          <span>Schedule New Hearing</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        {['All', 'Scheduled', 'Completed'].map(tab => (
          <button
            key={tab}
            className={`btn ${selectedDateFilter === tab ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setSelectedDateFilter(tab)}
          >
            {tab} Sessions
          </button>
        ))}
      </div>

      {/* Layout Grid */}
      <div className="schedule-grid">
        {/* Hearing Items Timeline */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={18} style={{ color: 'var(--secondary)' }} />
              Dockets & Sessions ({filteredSchedule.length})
            </h3>

            {filteredSchedule.map(h => (
              <div key={h.id} className="glass-panel hearing-card">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                    <span className="badge badge-role">{h.type}</span>
                    <span className="badge badge-closed">{h.status}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{h.title}</h4>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={14} style={{ color: '#38bdf8' }} />
                      {h.room}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <User size={14} style={{ color: '#818cf8' }} />
                      {h.judge}
                    </span>
                  </div>
                </div>

                <div className="hearing-time-badge">
                  <Clock size={14} />
                  <span>{new Date(h.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Courtroom Availability Summary */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Courtroom Status</h3>
            
            {[
              { room: 'Courtroom 1A', status: 'Available', judge: 'Hon. Davis', type: 'Civil' },
              { room: 'Courtroom 1B', status: 'In Session', judge: 'Hon. Miller', type: 'Probate' },
              { room: 'Courtroom 2C', status: 'Scheduled 10:30', judge: 'Hon. Smith', type: 'Special' },
              { room: 'Courtroom 3A', status: 'In Session', judge: 'Hon. Smith', type: 'Criminal' }
            ].map((r, i) => (
              <div key={i} style={{
                padding: '0.85rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.room}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.judge} • {r.type}</div>
                </div>
                <span className={`badge ${r.status.includes('Session') ? 'badge-high' : 'badge-low'}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
