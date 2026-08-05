import React, { useState } from 'react';
import { useCourt } from '../context/CourtContext';
import { FileText, Plus, Search, Sparkles, Download, Eye, Tag, Calendar, User, Filter } from 'lucide-react';

export default function DocumentsPage({ onOpenNewDocument }) {
  const { documents } = useCourt();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const filteredDocs = documents.filter(d => {
    const matchesCategory = categoryFilter === 'All' || d.type === categoryFilter;
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.caseTitle && d.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.summary && d.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="documents-page">
      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }

        .doc-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .doc-card:hover {
          border-color: rgba(56, 189, 248, 0.4);
          transform: translateY(-4px);
        }

        .doc-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(14, 165, 233, 0.15);
          color: #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Document Repository</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Secure storage for judicial evidence, orders, filings, and expert reports
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenNewDocument}>
          <Plus size={16} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search documents by name or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Order', 'Evidence', 'Report'].map(cat => (
            <button
              key={cat}
              className={`btn ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'All' ? 'All Types' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="docs-grid">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="glass-panel doc-card">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="doc-icon-wrapper">
                  <FileText size={22} />
                </div>
                <span className="badge badge-medium" style={{ fontSize: '0.7rem' }}>{doc.type}</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>{doc.name}</h3>
              <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '0.6rem', fontWeight: 600 }}>
                Case: {doc.caseTitle || doc.caseId}
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                {doc.summary || 'No summary generated yet.'}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {doc.date}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDoc(doc)}>
                <Eye size={14} />
                <span>Inspect</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Inspector Modal */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-medium">{selectedDoc.type}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.3rem' }}>{selectedDoc.name}</h3>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={() => setSelectedDoc(null)}>✕</button>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Document Summary:</div>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{selectedDoc.summary}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => alert("Downloading secure PDF file...")}>
                <Download size={16} />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
