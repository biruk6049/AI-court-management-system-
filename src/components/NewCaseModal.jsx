import React, { useState } from 'react';
import { useCourt } from '../context/CourtContext';
import { useAuth } from '../context/AuthContext';
import { X, Gavel, FileText } from 'lucide-react';

export default function NewCaseModal({ isOpen, onClose }) {
  const { addCase } = useCourt();
  const { profile } = useAuth();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Criminal');
  const [priority, setPriority] = useState('High');
  const [judge, setJudge] = useState('Hon. Smith');
  const [lawyers, setLawyers] = useState('');
  const [description, setDescription] = useState('');
  const [nextHearing, setNextHearing] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await addCase({
        title,
        type,
        priority,
        judge,
        lawyers,
        description,
        nextHearing: nextHearing ? new Date(nextHearing).toISOString() : null,
        creatorName: profile?.name || profile?.full_name || 'Clerk'
      });
      setIsSubmitting(false);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setLawyers('');
      setNextHearing('');
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
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              <Gavel size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>New Case Registration</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>File a new legal case into the judicial system</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Case Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. State vs. John Doe"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Case Classification</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Criminal">Criminal</option>
                <option value="Civil">Civil</option>
                <option value="Probate">Probate</option>
                <option value="Family">Family</option>
                <option value="Appellate">Appellate</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Presiding Judge</label>
              <select className="form-select" value={judge} onChange={(e) => setJudge(e.target.value)}>
                <option value="Hon. Smith">Hon. Smith</option>
                <option value="Hon. Davis">Hon. Davis</option>
                <option value="Hon. Miller">Hon. Miller</option>
                <option value="Hon. Rodriguez">Hon. Rodriguez</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Hearing Date</label>
              <input
                type="datetime-local"
                className="form-input"
                value={nextHearing}
                onChange={(e) => setNextHearing(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Attorneys (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Wick, Alice Smith"
              value={lawyers}
              onChange={(e) => setLawyers(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Case Summary & Charges Description</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Provide background context, specific charges, or claimed damages..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
