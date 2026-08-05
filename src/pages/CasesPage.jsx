import React, { useState } from 'react';
import { useCourt } from '../context/CourtContext';
import { Gavel, Search, Plus, Filter, Grid, List, Calendar, User, ChevronRight } from 'lucide-react';

export default function CasesPage({ onOpenNewCase, onSelectCase }) {
  const {
    filteredCases,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    searchTerm,
    setSearchTerm
  } = useCourt();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  return (
    <div className="cases-page">
      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .cases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }

        .case-card {
          padding: 1.5rem;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .case-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.4);
        }

        .case-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .cases-table {
          width: 100%;
          border-collapse: collapse;
        }

        .cases-table th {
          text-align: left;
          padding: 0.85rem 1rem;
          color: var(--text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          border-bottom: 1px solid var(--glass-border);
        }

        .cases-table td {
          padding: 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--glass-border-light);
        }

        .cases-table tr:hover td {
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
        }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Case Repository</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Manage, track, and inspect all court case filings and legal dockets
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenNewCase}>
          <Plus size={16} />
          <span>New Case Filing</span>
        </button>
      </div>

      {/* Controls & Filter Bar */}
      <div className="glass-panel filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Filter size={16} />
          <span>Filters:</span>
        </div>

        {/* Classification */}
        <select className="form-select" style={{ width: 'auto' }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Criminal">Criminal</option>
          <option value="Civil">Civil</option>
          <option value="Probate">Probate</option>
          <option value="Family">Family</option>
        </select>

        {/* Status */}
        <select className="form-select" style={{ width: 'auto' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
          <option value="Under Review">Under Review</option>
        </select>

        {/* Priority */}
        <select className="form-select" style={{ width: 'auto' }} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem' }}>
          <button
            className={`btn btn-secondary btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <Grid size={18} />
          </button>
          <button
            className={`btn btn-secondary btn-icon ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Grid or List Display */}
      {viewMode === 'grid' ? (
        <div className="cases-grid">
          {filteredCases.map(c => (
            <div key={c.id} className="glass-panel case-card" onClick={() => onSelectCase(c)}>
              <div>
                <div className="case-card-header">
                  <span className="badge badge-role">{c.id}</span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span>
                    <span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{c.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineClamp: 2 }}>
                  {c.description || 'No description available.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--glass-border-light)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Presiding: {c.judge}</span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>{c.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table className="cases-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Classification</th>
                <th>Presiding Judge</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Next Hearing</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map(c => (
                <tr key={c.id} onClick={() => onSelectCase(c)}>
                  <td style={{ fontWeight: 700, color: '#a5b4fc' }}>{c.id}</td>
                  <td style={{ fontWeight: 600 }}>{c.title}</td>
                  <td>{c.type}</td>
                  <td>{c.judge}</td>
                  <td><span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span></td>
                  <td><span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span></td>
                  <td>{c.nextHearing ? new Date(c.nextHearing).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm">
                      <span>View</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
