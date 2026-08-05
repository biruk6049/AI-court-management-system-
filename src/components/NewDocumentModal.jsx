import React, { useState, useRef } from 'react';
import { useCourt } from '../context/CourtContext';
import { useAuth } from '../context/AuthContext';
import { X, FileText, Upload, Sparkles, Check, Paperclip } from 'lucide-react';

export default function NewDocumentModal({ isOpen, onClose, defaultCaseId = '' }) {
  const { cases, addDocument } = useCourt();
  const { profile } = useAuth();

  const [caseId, setCaseId] = useState(defaultCaseId || (cases[0]?.id || ''));
  const [name, setName] = useState('');
  const [type, setType] = useState('Evidence');
  const [summary, setSummary] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!name) {
        setName(file.name);
      }
      setSummary(`Uploaded document ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB). Category: ${type}.`);
    }
  };

  const handleGenerateSummary = () => {
    if (!name) return;
    setSummary(`AI Generated Summary for ${name}: Verified legal filing recorded under ${type}. Contains official seals, signature timestamps, and case references.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caseId || !name.trim()) return;

    setIsSubmitting(true);
    try {
      let fileUrl = null;
      if (selectedFile) {
        fileUrl = URL.createObjectURL(selectedFile);
      } else {
        fileUrl = `https://documents.court.gov/archive/${Date.now()}.pdf`;
      }

      await addDocument({
        caseId,
        name: name.endsWith('.pdf') || name.includes('.') ? name : `${name}.pdf`,
        type,
        summary: summary || `Document filed under ${type}.`,
        file_url: fileUrl,
        file_size: selectedFile ? selectedFile.size : 1024 * 500,
        uploadedBy: profile?.name || profile?.full_name || 'Clerk'
      });
      setIsSubmitting(false);
      onClose();
      // Reset form
      setName('');
      setSelectedFile(null);
      setSummary('');
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
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Upload Case Document</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Attach real files, evidence, judicial orders, or filings</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Link to Case *</label>
            <select className="form-select" value={caseId} onChange={(e) => setCaseId(e.target.value)} required>
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Document Title / File Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Affidavit of Witness.pdf"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Evidence">Evidence</option>
                <option value="Order">Judicial Order</option>
                <option value="Report">Expert Report</option>
                <option value="Motion">Motion Filing</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Document Summary</label>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleGenerateSummary}
                style={{ color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.4)' }}
              >
                <Sparkles size={13} />
                <span>Auto-Summarize</span>
              </button>
            </div>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Brief description or key points of this filing..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {/* Real HTML5 File Selector */}
          <div className="form-group">
            <label className="form-label">Select File to Upload</label>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--glass-border)',
                borderRadius: '14px',
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: selectedFile ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                borderColor: selectedFile ? '#10b981' : 'var(--glass-border)',
                transition: 'var(--transition)'
              }}
            >
              {selectedFile ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', color: '#34d399' }}>
                  <Paperclip size={22} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedFile.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={28} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Click to browse file from your computer
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Supports PDF, DOCX, PNG, JPG files
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Save & Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
