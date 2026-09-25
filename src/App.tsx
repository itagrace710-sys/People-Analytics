import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/views/HomeView';
import { DataCentreView } from './components/views/DataCentreView';
import { CleanDataView } from './components/views/CleanDataView';
import { DataModelView } from './components/views/DataModelView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ExecutiveInsightsView } from './components/views/ExecutiveInsightsView';
import { SqlPythonLabView } from './components/views/SqlPythonLabView';
import { DaxPowerBiView } from './components/views/DaxPowerBiView';
import { UserManagementView } from './components/views/UserManagementView';
import { ExportCentreView } from './components/views/ExportCentreView';
import { AddEmployeeModal } from './components/modals/AddEmployeeModal';
import { AnalysisResultModal } from './components/modals/AnalysisResultModal';
import { DeployToGithubModal } from './components/modals/DeployToGithubModal';
import { Menu, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, backgroundTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home': return <HomeView />;
      case 'data': return <DataCentreView />;
      case 'clean': return <CleanDataView />;
      case 'model': return <DataModelView />;
      case 'analytics': return <AnalyticsView />;
      case 'insights': return <ExecutiveInsightsView />;
      case 'sql_python': return <SqlPythonLabView />;
      case 'dax_bi': return <DaxPowerBiView />;
      case 'users': return <UserManagementView />;
      case 'export': return <ExportCentreView />;
      default: return <HomeView />;
    }
  };

  const getBackgroundClass = () => {
    switch (backgroundTheme) {
      case 'white':
        return 'bg-slate-50 text-slate-900';
      case 'grey':
        return 'bg-[#1f2735] text-slate-100';
      case 'multicolored':
        return 'bg-transparent text-slate-100';
      case 'dark':
      default:
        return 'bg-slate-950 text-slate-100';
    }
  };

  return (
    <div 
      data-theme={backgroundTheme}
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${getBackgroundClass()}`}
    >
      <Navbar />

      {/* Mobile Menu Toggle Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <span className="font-semibold text-slate-300 capitalize">
          Current View: <span className="text-indigo-400 font-mono">{activeTab.replace('_', ' ')}</span>
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="w-72 bg-slate-900 h-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AddEmployeeModal />
      <AnalysisResultModal />
      <DeployToGithubModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
