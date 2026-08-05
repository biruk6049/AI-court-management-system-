import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, INITIAL_MOCK_DATA } from '../lib/supabaseClient';

const CourtContext = createContext();

export function CourtProvider({ children }) {
  const [cases, setCases] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  // Load state and subscribe to Supabase Realtime changes
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured && supabase) {
        try {
          const [casesRes, scheduleRes, docsRes, logsRes] = await Promise.all([
            supabase.from('cases').select('*').order('created_at', { ascending: false }),
            supabase.from('hearings').select('*').order('date', { ascending: true }),
            supabase.from('documents').select('*').order('date', { ascending: false }),
            supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(20)
          ]);

          if (casesRes.data && casesRes.data.length > 0) setCases(casesRes.data);
          else loadInitialLocalCases();

          if (scheduleRes.data && scheduleRes.data.length > 0) setSchedule(scheduleRes.data);
          else loadInitialLocalSchedule();

          if (docsRes.data && docsRes.data.length > 0) setDocuments(docsRes.data);
          else loadInitialLocalDocuments();

          if (logsRes.data) setAuditLogs(logsRes.data);
          else loadInitialLocalLogs();

        } catch (err) {
          console.error("Supabase fetch failed, utilizing local store:", err);
          loadLocalStore();
        }
      } else {
        loadLocalStore();
      }
      setLoading(false);
    }

    loadData();

    // Supabase Real-time Subscriptions Setup
    if (isSupabaseConfigured && supabase) {
      const casesChannel = supabase
        .channel('public:cases')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, payload => {
          if (payload.eventType === 'INSERT') {
            setCases(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCases(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
          } else if (payload.eventType === 'DELETE') {
            setCases(prev => prev.filter(c => c.id !== payload.old.id));
          }
        })
        .subscribe();

      const hearingsChannel = supabase
        .channel('public:hearings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'hearings' }, payload => {
          if (payload.eventType === 'INSERT') {
            setSchedule(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setSchedule(prev => prev.map(h => h.id === payload.new.id ? { ...h, ...payload.new } : h));
          } else if (payload.eventType === 'DELETE') {
            setSchedule(prev => prev.filter(h => h.id !== payload.old.id));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(casesChannel);
        supabase.removeChannel(hearingsChannel);
      };
    }
  }, []);

  function loadLocalStore() {
    loadInitialLocalCases();
    loadInitialLocalSchedule();
    loadInitialLocalDocuments();
    loadInitialLocalLogs();
  }

  function loadInitialLocalCases() {
    const saved = localStorage.getItem('astraea_cases');
    if (saved) {
      setCases(JSON.parse(saved));
    } else {
      setCases(INITIAL_MOCK_DATA.cases);
      localStorage.setItem('astraea_cases', JSON.stringify(INITIAL_MOCK_DATA.cases));
    }
  }

  function loadInitialLocalSchedule() {
    const saved = localStorage.getItem('astraea_schedule');
    if (saved) {
      setSchedule(JSON.parse(saved));
    } else {
      setSchedule(INITIAL_MOCK_DATA.schedule);
      localStorage.setItem('astraea_schedule', JSON.stringify(INITIAL_MOCK_DATA.schedule));
    }
  }

  function loadInitialLocalDocuments() {
    const allDocs = INITIAL_MOCK_DATA.cases.flatMap(c => 
      (c.documents || []).map(d => ({ ...d, caseId: c.id, caseTitle: c.title }))
    );
    const saved = localStorage.getItem('astraea_documents');
    if (saved) {
      setDocuments(JSON.parse(saved));
    } else {
      setDocuments(allDocs);
      localStorage.setItem('astraea_documents', JSON.stringify(allDocs));
    }
  }

  function loadInitialLocalLogs() {
    const saved = localStorage.getItem('astraea_audit_logs');
    if (saved) {
      setAuditLogs(JSON.parse(saved));
    } else {
      setAuditLogs(INITIAL_MOCK_DATA.auditLogs);
      localStorage.setItem('astraea_audit_logs', JSON.stringify(INITIAL_MOCK_DATA.auditLogs));
    }
  }

  // Action Methods with automatic persistence & Supabase sync
  const addCase = async (newCaseData) => {
    const generatedId = `C-2026-${String(cases.length + 1).padStart(3, '0')}`;
    const newCase = {
      id: generatedId,
      title: newCaseData.title,
      type: newCaseData.type || 'Civil',
      status: newCaseData.status || 'Active',
      priority: newCaseData.priority || 'Medium',
      nextHearing: newCaseData.nextHearing || null,
      judge: newCaseData.judge || 'Unassigned',
      lawyers: newCaseData.lawyers ? newCaseData.lawyers.split(',').map(l => l.trim()) : [],
      description: newCaseData.description || '',
      created_at: new Date().toISOString(),
      timeline: [
        { id: String(Date.now()), event: "Case Registered", date: new Date().toISOString().split('T')[0], created_by: newCaseData.creatorName || "System" }
      ],
      documents: []
    };

    // Update Local State
    const updatedCases = [newCase, ...cases];
    setCases(updatedCases);
    localStorage.setItem('astraea_cases', JSON.stringify(updatedCases));

    // Log Activity
    logActivity(newCaseData.creatorName || "System User", "Created Case", `Case ${generatedId} (${newCase.title}) created.`);

    // If Supabase is connected, sync to database
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cases').insert([{
          id: newCase.id,
          title: newCase.title,
          type: newCase.type,
          status: newCase.status,
          priority: newCase.priority,
          judge: newCase.judge,
          lawyers: newCase.lawyers,
          description: newCase.description,
          next_hearing: newCase.nextHearing
        }]);
      } catch (e) {
        console.error("Error inserting case into Supabase:", e);
      }
    }

    return newCase;
  };

  const updateCase = async (caseId, updates) => {
    const updatedCases = cases.map(c => {
      if (c.id === caseId) {
        const newTimeline = [...(c.timeline || [])];
        if (updates.status && updates.status !== c.status) {
          newTimeline.push({
            id: String(Date.now()),
            event: `Status updated to ${updates.status}`,
            date: new Date().toISOString().split('T')[0],
            created_by: updates.updatedBy || "System"
          });
        }
        return { ...c, ...updates, timeline: newTimeline };
      }
      return c;
    });

    setCases(updatedCases);
    localStorage.setItem('astraea_cases', JSON.stringify(updatedCases));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('cases').update(updates).eq('id', caseId);
    }
  };

  const addHearing = async (hearingData) => {
    const generatedId = `S-${Date.now().toString().slice(-4)}`;
    const newHearing = {
      id: generatedId,
      caseId: hearingData.caseId,
      title: hearingData.title,
      date: hearingData.date,
      type: hearingData.type || 'Preliminary Hearing',
      room: hearingData.room || 'Courtroom 1A',
      judge: hearingData.judge || 'Hon. Smith',
      status: 'Scheduled'
    };

    const updatedSchedule = [...schedule, newHearing];
    setSchedule(updatedSchedule);
    localStorage.setItem('astraea_schedule', JSON.stringify(updatedSchedule));

    // Also update case next hearing date if earlier or blank
    const targetCase = cases.find(c => c.id === hearingData.caseId);
    if (targetCase) {
      updateCase(targetCase.id, { nextHearing: hearingData.date });
    }

    logActivity(hearingData.creatorName || "System", "Scheduled Hearing", `${newHearing.title} on ${new Date(newHearing.date).toLocaleDateString()}`);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('hearings').insert([{
        id: newHearing.id,
        case_id: newHearing.caseId,
        title: newHearing.title,
        date: newHearing.date,
        type: newHearing.type,
        room: newHearing.room,
        judge: newHearing.judge,
        status: newHearing.status
      }]);
    }

    return newHearing;
  };

  const addDocument = async (docData) => {
    const newDoc = {
      id: 'D-' + Date.now(),
      caseId: docData.caseId,
      caseTitle: cases.find(c => c.id === docData.caseId)?.title || docData.caseId,
      name: docData.name,
      type: docData.type || 'Evidence',
      date: new Date().toISOString().split('T')[0],
      uploaded_by: docData.uploadedBy || 'Court Clerk',
      summary: docData.summary || 'Uploaded document record.',
      file_url: docData.file_url || null
    };

    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);
    localStorage.setItem('astraea_documents', JSON.stringify(updatedDocs));

    // Also attach to target case document array
    setCases(prev => prev.map(c => {
      if (c.id === docData.caseId) {
        return { ...c, documents: [...(c.documents || []), newDoc] };
      }
      return c;
    }));

    logActivity(docData.uploadedBy || "Clerk", "Uploaded Document", `Added ${newDoc.name} to ${newDoc.caseTitle}`);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('documents').insert([{
        case_id: newDoc.caseId,
        name: newDoc.name,
        type: newDoc.type,
        summary: newDoc.summary,
        uploaded_by: newDoc.uploaded_by,
        file_url: newDoc.file_url
      }]);
    }

    return newDoc;
  };

  const logActivity = (userName, action, details) => {
    const newLog = {
      id: 'al-' + Date.now(),
      user_name: userName,
      action: action,
      details: details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 20)]);
    localStorage.setItem('astraea_audit_logs', JSON.stringify([newLog, ...auditLogs.slice(0, 20)]));

    if (isSupabaseConfigured && supabase) {
      supabase.from('audit_logs').insert([{
        user_name: userName,
        action: action,
        details: details
      }]);
    }
  };

  // Filtered cases calculation
  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.judge.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || c.type === filterType;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || c.priority === filterPriority;

    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  return (
    <CourtContext.Provider
      value={{
        cases,
        filteredCases,
        schedule,
        documents,
        auditLogs,
        loading,
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        filterStatus,
        setFilterStatus,
        filterPriority,
        setFilterPriority,
        addCase,
        updateCase,
        addHearing,
        addDocument,
        logActivity
      }}
    >
      {children}
    </CourtContext.Provider>
  );
}

export const useCourt = () => useContext(CourtContext);
