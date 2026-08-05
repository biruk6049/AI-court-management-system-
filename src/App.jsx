import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CourtProvider } from './context/CourtContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NewCaseModal from './components/NewCaseModal';
import NewHearingModal from './components/NewHearingModal';
import NewDocumentModal from './components/NewDocumentModal';
import CaseDetailsModal from './components/CaseDetailsModal';
import RoleSwitcherModal from './components/RoleSwitcherModal';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import SchedulePage from './pages/SchedulePage';
import DocumentsPage from './pages/DocumentsPage';
import AiAssistantPage from './pages/AiAssistantPage';
import AnalyticsPage from './pages/AnalyticsPage';

function MainAppContent() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modal States
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isNewHearingOpen, setIsNewHearingOpen] = useState(false);
  const [isNewDocOpen, setIsNewDocOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [modalDefaultCaseId, setModalDefaultCaseId] = useState('');

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="pulse-indicator" style={{ width: 16, height: 16, margin: '0 auto 1rem' }} />
          <div>Initializing Astraea AI Court System...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleOpenHearingForCase = (cId) => {
    setModalDefaultCaseId(cId || '');
    setIsNewHearingOpen(true);
  };

  const handleOpenDocForCase = (cId) => {
    setModalDefaultCaseId(cId || '');
    setIsNewDocOpen(true);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            setActivePage={setActivePage}
            onOpenNewCase={() => setIsNewCaseOpen(true)}
            onOpenNewHearing={() => handleOpenHearingForCase('')}
            onSelectCase={(c) => setSelectedCase(c)}
          />
        );
      case 'cases':
        return (
          <CasesPage
            onOpenNewCase={() => setIsNewCaseOpen(true)}
            onSelectCase={(c) => setSelectedCase(c)}
          />
        );
      case 'schedule':
        return (
          <SchedulePage
            onOpenNewHearing={() => handleOpenHearingForCase('')}
          />
        );
      case 'documents':
        return (
          <DocumentsPage
            onOpenNewDocument={() => handleOpenDocForCase('')}
          />
        );
      case 'ai-assistant':
        return <AiAssistantPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return (
          <DashboardPage
            setActivePage={setActivePage}
            onOpenNewCase={() => setIsNewCaseOpen(true)}
            onOpenNewHearing={() => handleOpenHearingForCase('')}
            onSelectCase={(c) => setSelectedCase(c)}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
      />

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenNewCase={() => setIsNewCaseOpen(true)}
        isOpen={isSidebarOpen}
      />

      <main className="main-content" style={{ marginLeft: isSidebarOpen ? 'var(--sidebar-width)' : 0 }}>
        {renderActivePage()}
      </main>

      {/* Modals */}
      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
      />

      <NewHearingModal
        isOpen={isNewHearingOpen}
        onClose={() => setIsNewHearingOpen(false)}
        defaultCaseId={modalDefaultCaseId}
      />

      <NewDocumentModal
        isOpen={isNewDocOpen}
        onClose={() => setIsNewDocOpen(false)}
        defaultCaseId={modalDefaultCaseId}
      />

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      <CaseDetailsModal
        isOpen={Boolean(selectedCase)}
        caseItem={selectedCase}
        onClose={() => setSelectedCase(null)}
        onScheduleHearing={(cId) => { setSelectedCase(null); handleOpenHearingForCase(cId); }}
        onAttachDocument={(cId) => { setSelectedCase(null); handleOpenDocForCase(cId); }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CourtProvider>
        <MainAppContent />
      </CourtProvider>
    </AuthProvider>
  );
}
