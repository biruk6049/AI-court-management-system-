import React, { useState } from 'react';
import { useCourt } from '../context/CourtContext';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, MapPin } from 'lucide-react';

export default function NewHearingModal({ isOpen, onClose, defaultCaseId = '' }) {
  const { cases, addHearing } = useCourt();
  const { profile } = useAuth();

  const [caseId, setCaseId] = useState(defaultCaseId || (cases[0]?.id || ''));
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Preliminary Hearing');
  const [date, setDate] = useState('');
  const [room, setRoom] = useState('Courtroom 3A');
  const [judge, setJudge] = useState('Hon. Smith');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caseId || !title.trim() || !date) return;

    setIsSubmitting(true);
    try {
      await addHearing({
        caseId,
        title,
        type,
        date: new Date(date).toISOString(),
        room,
        judge,
        creatorName: profile?.name || profile?.full_name || 'Clerk'
      });
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8' }}>
              <Calendar size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Schedule Court Hearing</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Book a session on the judicial calendar docket</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Legal Case *</label>
            <select className="form-select" value={caseId} onChange={(e) => setCaseId(e.target.value)} required>
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.title} ({c.type})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Session / Hearing Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Preliminary Hearing: TechCorp Motion"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Hearing Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Arraignment">Arraignment</option>
                <option value="Preliminary Hearing">Preliminary Hearing</option>
                <option value="Motion">Motion to Dismiss / Suppress</option>
                <option value="Trial">Full Jury Trial</option>
                <option value="Sentencing">Sentencing Hearing</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date & Time *</label>
              <input
                type="datetime-local"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Courtroom Assignment</label>
              <select className="form-select" value={room} onChange={(e) => setRoom(e.target.value)}>
                <option value="Courtroom 1A">Courtroom 1A (Civil)</option>
                <option value="Courtroom 1B">Courtroom 1B (Probate)</option>
                <option value="Courtroom 2C">Courtroom 2C (Special)</option>
                <option value="Courtroom 3A">Courtroom 3A (Criminal High Security)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Presiding Magistrate</label>
              <select className="form-select" value={judge} onChange={(e) => setJudge(e.target.value)}>
                <option value="Hon. Smith">Hon. Smith</option>
                <option value="Hon. Davis">Hon. Davis</option>
                <option value="Hon. Miller">Hon. Miller</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Hearing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
