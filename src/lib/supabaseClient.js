import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('astraea_supabase_url') || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('astraea_supabase_key') || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project-ref.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial mock data used when Supabase cloud is not configured
export const INITIAL_MOCK_DATA = {
  cases: [
    { 
      id: "C-2026-001", 
      title: "State vs. Doe", 
      type: "Criminal", 
      status: "Active", 
      priority: "High",
      nextHearing: "2026-05-15T09:00:00Z", 
      judge: "Hon. Smith", 
      lawyers: ["John Wick", "Jane Doe"],
      description: "Robbery charges in the 1st degree.",
      created_at: "2026-04-01T10:00:00Z",
      timeline: [
        { id: "1", event: "Case Created", date: "2026-04-01", created_by: "System" },
        { id: "2", event: "Judge Assigned (Hon. Smith)", date: "2026-04-02", created_by: "Clerk Lee" },
        { id: "3", event: "Hearing Scheduled for Arraignment", date: "2026-04-05", created_by: "Clerk Lee" }
      ],
      documents: [
        { id: "d1", name: "Initial Complaint.pdf", type: "Order", date: "2026-04-01", uploaded_by: "Clerk Lee", summary: "Formal criminal charge complaint detailing location and alleged offense." }
      ]
    },
    { 
      id: "C-2026-002", 
      title: "TechCorp vs. InnovateLLC", 
      type: "Civil", 
      status: "Pending", 
      priority: "Medium",
      nextHearing: "2026-06-02T14:00:00Z", 
      judge: "Hon. Davis", 
      lawyers: ["Alice Smith"],
      description: "Patent infringement dispute over AI neural network algorithms.",
      created_at: "2026-04-10T11:30:00Z",
      timeline: [
        { id: "1", event: "Case Created & Summons Issued", date: "2026-04-10", created_by: "Alice Smith" }
      ],
      documents: [
        { id: "d2", name: "Patent Filing #88492.pdf", type: "Evidence", date: "2026-04-11", uploaded_by: "Alice Smith", summary: "Official USPTO patent specification for deep learning optimization." }
      ]
    },
    { 
      id: "C-2026-003", 
      title: "Estate of Wayne", 
      type: "Probate", 
      status: "Closed", 
      priority: "Low",
      nextHearing: null, 
      judge: "Hon. Miller", 
      lawyers: [],
      description: "Execution of the Wayne estate and trust agreements.",
      created_at: "2025-12-01T08:00:00Z",
      timeline: [
        { id: "1", event: "Case Created", date: "2025-12-01", created_by: "System" },
        { id: "2", event: "Probate Approval Issued", date: "2026-02-10", created_by: "Hon. Miller" },
        { id: "3", event: "Case Closed", date: "2026-03-15", created_by: "Hon. Miller" }
      ],
      documents: [
        { id: "d3", name: "Final Will & Testament.pdf", type: "Report", date: "2025-12-02", uploaded_by: "Clerk Lee", summary: "Notarized last will and trust distribution directives." }
      ]
    },
    { 
      id: "C-2026-004", 
      title: "City of Metropolis vs. LexCorp", 
      type: "Civil", 
      status: "Active", 
      priority: "High",
      nextHearing: "2026-05-20T10:30:00Z", 
      judge: "Hon. Smith", 
      lawyers: ["Bruce Wayne"],
      description: "Environmental damages and commercial zoning law violations.",
      created_at: "2026-04-15T14:20:00Z",
      timeline: [
        { id: "1", event: "Case Created & Emergency Injunction Filed", date: "2026-04-15", created_by: "Bruce Wayne" }
      ],
      documents: []
    }
  ],
  schedule: [
    { id: "S-101", caseId: "C-2026-001", title: "Arraignment: State vs. Doe", date: "2026-05-15T09:00:00Z", type: "Arraignment", room: "Courtroom 3A", judge: "Hon. Smith", status: "Scheduled" },
    { id: "S-102", caseId: "C-2026-002", title: "Preliminary Hearing: TechCorp", date: "2026-06-02T14:00:00Z", type: "Preliminary Hearing", room: "Courtroom 1B", judge: "Hon. Davis", status: "Scheduled" },
    { id: "S-103", caseId: "C-2026-004", title: "Motion to Dismiss: LexCorp", date: "2026-05-20T10:30:00Z", type: "Motion", room: "Courtroom 2C", judge: "Hon. Smith", status: "Scheduled" }
  ],
  users: [
    { id: "U-1", username: "admin", email: "admin@court.gov", role: "Admin", name: "Admin User", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
    { id: "U-2", username: "judge_smith", email: "judge.smith@court.gov", role: "Judge", name: "Hon. Smith", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
    { id: "U-3", username: "lawyer_wick", email: "john.wick@legal.com", role: "Lawyer", name: "John Wick", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
    { id: "U-4", username: "clerk_lee", email: "clerk.lee@court.gov", role: "Clerk", name: "Lee Clerk", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" }
  ],
  auditLogs: [
    { id: "al-1", user_name: "Hon. Smith", action: "Assigned to Case C-2026-004", details: "Assigned as Presiding Magistrate", timestamp: "2026-04-15T14:22:00Z" },
    { id: "al-2", user_name: "Lee Clerk", action: "Uploaded Document", details: "Initial Complaint.pdf added to C-2026-001", timestamp: "2026-04-01T10:05:00Z" },
    { id: "al-3", user_name: "System AI", action: "AI Triage Completed", details: "Flagged C-2026-001 as High Priority", timestamp: "2026-04-01T10:02:00Z" }
  ]
};
