import React, { useState } from 'react';
import { useCourt } from '../context/CourtContext';
import { useAuth } from '../context/AuthContext';
import { X, Gavel, Calendar, FileText, Clock, User, Shield, CheckCircle, Plus, Sparkles } from 'lucide-react';

export default function CaseDetailsModal({ caseItem, isOpen, onClose, onScheduleHearing, onAttachDocument }) {
  const { updateCase } = useCourt();
  const { profile } = useAuth();
  const [newStatus, setNewStatus] = useState(caseItem?.status || 'Active');

  if (!isOpen || !caseItem) return null;

  const handleStatusChange = (status) => {
    setNewStatus(status);
    updateCase(caseItem.id, {
      status,
      updatedBy: profile?.name || profile?.full_name || 'Judge'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-role" style={{ fontSize: '0.8rem' }}>{caseItem.id}</span>
              <span className={`badge badge-${caseItem.status.toLowerCase()}`}>{caseItem.status}</span>
              <span className={`badge badge-${caseItem.priority.toLowerCase()}`}>{caseItem.priority} Priority</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>{caseItem.type}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{caseItem.title}</h2>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Action Toolbar */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--glass-border)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              value={newStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => onScheduleHearing(caseItem.id)}>
              <Calendar size={14} />
              <span>Schedule Hearing</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => onAttachDocument(caseItem.id)}>
              <Plus size={14} />
              <span>Attach File</span>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Left Column: Details & Timeline */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Case Description</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {caseItem.description || 'No description provided.'}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Assigned Personnel</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <Shield size={16} style={{ color: '#818cf8' }} />
                  <span style={{ color: 'var(--text-dim)' }}>Presiding Judge:</span>
                  <span style={{ fontWeight: 600 }}>{caseItem.judge}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <User size={16} style={{ color: '#38bdf8' }} />
                  <span style={{ color: 'var(--text-dim)' }}>Attorneys:</span>
                  <span style={{ fontWeight: 600 }}>
                    {caseItem.lawyers && caseItem.lawyers.length > 0 ? caseItem.lawyers.join(', ') : 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Procedural History</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', paddingLeft: '1.25rem' }}>
                <div style={{
                  position: 'absolute',
                  left: '6px',
                  top: '6px',
                  bottom: '6px',
                  width: '2px',
                  background: 'var(--glass-border)'
                }} />
                {(caseItem.timeline || []).map((t, idx) => (
                  <div key={t.id || idx} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-1.45rem',
                      top: '3px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'var(--primary)'
                    }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.event}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {t.date} • {t.created_by || 'System'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Next Hearing & Attached Documents */}
          <div>
            <div style={{
              padding: '1rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(14, 165, 233, 0.1))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase' }}>Next Hearing Date</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.3rem 0', color: 'var(--text-main)' }}>
                {caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleString() : 'No Hearing Scheduled'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {caseItem.nextHearing ? 'Courtroom 3A • Hon. Smith' : 'Click schedule button above to add'}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Attached Files ({caseItem.documents ? caseItem.documents.length : 0})
              </h4>
              {caseItem.documents && caseItem.documents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {caseItem.documents.map((doc, i) => (
                    <div key={i} style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} style={{ color: '#38bdf8' }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doc.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.type} • {doc.date}</div>
                        </div>
                      </div>
                      <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>Verified</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  color: 'var(--text-dim)',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  border: '1px dashed var(--glass-border)'
                }}>
                  No documents attached to this case yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
